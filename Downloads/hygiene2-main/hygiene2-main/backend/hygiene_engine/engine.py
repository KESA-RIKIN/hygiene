from dataclasses import dataclass
from datetime import datetime, timedelta
from pathlib import Path
from typing import Dict, Optional

import cv2
import numpy as np

from .alert_manager import AlertManager
from .config import ENGINE_CONFIG, VIOLATIONS_DIR
from .database import init_db
from .detector import YoloPPEDetector, PPEViolationType
from .scoring import HygieneScorer, ScoringConfig
from .video_source import VideoSource


@dataclass
class EngineMetrics:
    total_frames: int = 0
    compliant_frames: int = 0

    @property
    def compliance_score(self) -> float:
        if self.total_frames == 0:
            return 0.0
        return self.compliant_frames / self.total_frames


class HygieneEngine:
    """
    Core CV engine that:
    - pulls frames from a VideoSource
    - runs YOLO-based PPE detection
    - applies cooldown-based violation logging
    - keeps simple compliance metrics
    - delegates scoring penalty to AlertManager (two-step re-check workflow)
    """

    def __init__(self, config=ENGINE_CONFIG) -> None:
        self.config = config
        self.detector = YoloPPEDetector(config=self.config)
        self.metrics = EngineMetrics()
        self.scorer = HygieneScorer(ScoringConfig())
        self.alert_manager = AlertManager(detector=self.detector, scorer=self.scorer)

        # cooldown tracking: violation_type -> last logged time (UTC)
        self._last_logged: Dict[str, datetime] = {}

        # Performance: process every Nth frame for inference
        self._frame_skip: int = 5  # run inference on 1 of every 5 frames
        self._last_analysis: dict = {
            "persons": [], "violations": [], "is_compliant": True, "detections": []
        }

        # Track latest detection booleans for /live/status
        self._last_hairnet_ok: bool = True
        self._last_gloves_ok: bool = True

        # State tracking for single-capture violation logic
        self._in_violation_state: bool = False

        init_db()

    def _handle_violation_state(self, is_compliant: bool, violations: list, frame: np.ndarray) -> None:
        """
        State-based violation management.
        Implementation of PART 1 & 2: Capture only ONE image per violation event.
        """
        now = datetime.utcnow()

        if not is_compliant:
            # Current frame is in violation
            if not self._in_violation_state:
                # TRANSITION: compliant -> violation
                # PART 1: Capture ONLY ONE image
                # Combine all active violations into the log entry or just note the first
                v_type = violations[0] if violations else "unknown"
                
                image_path = self._save_violation_frame(
                    frame=frame, violation_type=v_type, now=now
                )
                
                # Queue alert via AlertManager (stores in DB)
                self.alert_manager.queue_alert(
                    violation_type=v_type,
                    image_path=image_path,
                    hairnet_ok=PPEViolationType.MISSING_HAIRNET not in violations,
                    gloves_ok=PPEViolationType.MISSING_GLOVES not in violations,
                )
                
                self._in_violation_state = True
                self._mark_violation_logged(v_type, now)
            else:
                # PART 2: previous_state == "violation" AND current_state == "violation"
                # Do nothing (no capture)
                pass
        else:
            # PART 2: current_state == "compliant"
            # Reset state to compliant
            self._in_violation_state = False

    def _mark_violation_logged(self, violation_type: str, now: datetime) -> None:
        self._last_logged[violation_type] = now

    def _save_violation_frame(
        self, frame: np.ndarray, violation_type: str, now: datetime
    ) -> Path:
        timestamp_str = now.strftime("%Y%m%d_%H%M%S_%f")
        filename = f"{timestamp_str}_{violation_type}.jpg"
        path = VIOLATIONS_DIR / filename
        cv2.imwrite(str(path), frame)
        return path

    def run(self, video_source: VideoSource, stop_after_frames: Optional[int] = None) -> EngineMetrics:
        """
        Main processing loop. For real-time webcam usage, call without stop_after_frames.
        For testing or batch analysis, you can limit the number of processed frames.
        """
        for vf in video_source.frames():
            frame = vf.frame
            self.metrics.total_frames += 1

            analysis = self.detector.analyze_frame(frame)
            if self.config.draw_annotations:
                for det in analysis["persons"]:
                    x1, y1, x2, y2 = det.bbox
                    label = f"{det.cls_name} {det.confidence:.2f}"
                    cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
                    cv2.putText(frame, label, (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)
            if analysis["violations"]:
                for i, v in enumerate(analysis["violations"]):
                    cv2.putText(
                        frame,
                        f"VIOLATION: {v}",
                        (20, 40 + i * 30),
                        cv2.FONT_HERSHEY_SIMPLEX,
                        0.8,
                        (0, 0, 255),
                        2,
                    )
            violations = analysis["violations"]
            is_compliant = analysis["is_compliant"]

            if is_compliant:
                self.metrics.compliant_frames += 1

            # PART 1, 2, 3: State-based management replaces the per-frame cooldown loop
            self._handle_violation_state(is_compliant, violations, frame)

            if self.config.show_visualization:
                cv2.imshow("Hygiene Monitor", frame)
                if cv2.waitKey(1) & 0xFF == ord("q"):
                    break

            if stop_after_frames is not None and self.metrics.total_frames >= stop_after_frames:
                break

        if self.config.show_visualization:
            cv2.destroyAllWindows()
        video_source.release()
        return self.metrics

    def process_stream(self, video_source: VideoSource):
        """
        Performance-optimized generator for real-time video streaming.
        - Skips inference every N frames (reuses last analysis).
        - Resizes frame to max 640px wide before inference.
        - Yields (annotated_frame_bgr, score_dict) tuples.

        KEY CHANGE: violations detected here do NOT change the score.
        Score only changes when the user confirms via the re-check API.
        """
        frame_idx = 0

        for vf in video_source.frames():
            frame = vf.frame
            self.metrics.total_frames += 1
            frame_idx += 1

            # Resize for inference (keeps aspect ratio)
            h, w = frame.shape[:2]
            if w > 640:
                scale = 640 / w
                infer_frame = cv2.resize(frame, (640, int(h * scale)))
            else:
                infer_frame = frame

            # Only run inference every _frame_skip frames
            if frame_idx % self._frame_skip == 0:
                self._last_analysis = self.detector.analyze_frame(infer_frame)

            analysis = self._last_analysis
            violations = analysis["violations"]
            is_compliant = analysis["is_compliant"]

            # ---------------------------------------------------------------
            # Two-step scoring:
            # - Compliant frame  → slow recovery (score goes up gently)
            # - Violation frame  → score STAYS PUT; alert queued for re-check
            # ---------------------------------------------------------------
            if is_compliant:
                self.metrics.compliant_frames += 1
                self.scorer.update([])   # recovery only
            else:
                # Record violations in scorer for status display, no penalty
                self.scorer.update(violations)   # update() now ignores violations path

            # Track ppe status for /live/status
            self._last_hairnet_ok = PPEViolationType.MISSING_HAIRNET not in violations
            self._last_gloves_ok = PPEViolationType.MISSING_GLOVES not in violations

            # Draw annotations on original frame
            if self.config.draw_annotations:
                for det in analysis["persons"]:
                    x1, y1, x2, y2 = det.bbox
                    if w > 640:
                        sx = w / 640
                        sy = h / int(h * (640 / w))
                        x1, x2 = int(x1 * sx), int(x2 * sx)
                        y1, y2 = int(y1 * sy), int(y2 * sy)
                    label = f"{det.cls_name} {det.confidence:.2f}"
                    cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
                    cv2.putText(frame, label, (x1, y1 - 10),
                                cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)

            if violations:
                for i, v in enumerate(violations):
                    cv2.putText(frame, f"⚠ {v} → Sent to Review", (20, 40 + i * 30),
                                cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 165, 255), 2)

            # Draw score on frame
            score_text = f"Score: {self.scorer.score_int}"
            cv2.putText(frame, score_text, (20, frame.shape[0] - 20),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)

            # PART 1, 2, 3: State-based management replaces the per-frame cooldown logic
            self._handle_violation_state(is_compliant, violations, frame)

            score_dict = self.scorer.to_dict()
            score_dict["hairnet_ok"] = self._last_hairnet_ok
            score_dict["gloves_ok"] = self._last_gloves_ok
            score_dict["pending_alerts"] = self.alert_manager.pending_count

            yield frame, score_dict

        video_source.release()
