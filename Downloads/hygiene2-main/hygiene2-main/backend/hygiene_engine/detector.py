from dataclasses import dataclass
from typing import List, Tuple, Dict, Any

import cv2
import numpy as np
import torch
from ultralytics import YOLO

from .config import EngineConfig

import json
import time
from pathlib import Path


@dataclass
class Detection:
    """
    Simple wrapper for a YOLO detection.
    """

    cls_name: str
    confidence: float
    bbox: Tuple[int, int, int, int]  # x1, y1, x2, y2


class PPEViolationType:
    MISSING_GLOVES = "missing_gloves"
    MISSING_HAIRNET = "missing_hairnet"


def _dbg_log(hypothesis_id: str, location: str, message: str, data: Dict[str, Any]) -> None:
    # region agent log
    try:
        payload = {
            "sessionId": "6c5d88",
            "runId": "pre-fix",
            "hypothesisId": hypothesis_id,
            "location": location,
            "message": message,
            "data": data,
            "timestamp": int(time.time() * 1000),
        }
        log_path = Path(__file__).resolve().parent.parent / "debug-6c5d88.log"
        with open(log_path, "a", encoding="utf-8") as f:
            f.write(json.dumps(payload, ensure_ascii=False) + "\n")
    except Exception:
        pass
    # endregion agent log


class YoloPPEDetector:
    """
    Dual-model YOLOv8 detector for hygiene compliance.

    Model 1: generic person detector (e.g. yolov8n.pt, COCO-trained)
    Model 2: custom PPE detector (your trained best.pt)

    Logic per frame:
    - Detect persons using Model 1
    - Detect PPE using Model 2
    - Filter PPE detections to only the configured glove/hairnet labels
    - Derive violations based on presence of persons vs PPE
    """

    def __init__(self, config: EngineConfig) -> None:
        self.config = config

        # Temporal smoothing state (seconds since epoch)
        self._glove_last_seen_ts: float | None = None
        self._hairnet_last_seen_ts: float | None = None
        self._smoothing_window_sec: float = 3.0  # ~3s demo-safe window

        # Determine best available device (GPU if possible)
        self.device = 'cuda' if torch.cuda.is_available() else 'cpu'
        self.use_half = self.device == 'cuda' # FP16 is much faster on GPU

        # Person detector
        self.person_model = YOLO(self.config.model.person_weights_path)
        self.person_model.to(self.device)
        
        self._person_label_map: Dict[int, str] = (
            self.person_model.model.names  # type: ignore[attr-defined]
        )

        # PPE detector
        self.ppe_model = YOLO(self.config.model.ppe_weights_path)
        self.ppe_model.to(self.device)
        
        self._ppe_label_map: Dict[int, str] = (
            self.ppe_model.model.names  # type: ignore[attr-defined]
        )

        _dbg_log(
            "H1",
            "hygiene_engine/detector.py:__init__",
            "Loaded YOLO models",
            {
                "person_weights_path": self.config.model.person_weights_path,
                "ppe_weights_path": self.config.model.ppe_weights_path,
                "device": self.device,
            },
        )

        # Warm up the models (eliminates lag on first real frame)
        try:
            dummy = np.zeros((480, 640, 3), dtype=np.uint8)
            self.person_model.predict(dummy, device=self.device, half=self.use_half, verbose=False)
            self.ppe_model.predict(dummy, device=self.device, half=self.use_half, verbose=False)
        except Exception as e:
            print(f"Warning: GPU warm-up failed, falling back to lazy load: {e}")

    def _parse_yolo_detections(
        self, results, label_map: Dict[int, str]
    ) -> List[Detection]:
        detections: List[Detection] = []

        # Ultralytics results object for detection is usually indexable: results[0]
        r0 = results[0]
        for box in r0.boxes:
            cls_id = int(box.cls.item())
            score = float(box.conf.item())
            if score < self.config.min_confidence:
                continue

            name = label_map.get(cls_id, str(cls_id))
            x1, y1, x2, y2 = box.xyxy[0].tolist()
            detections.append(
                Detection(
                    cls_name=name,
                    confidence=score,
                    bbox=(int(x1), int(y1), int(x2), int(y2)),
                )
            )
        return detections

    def _detect_persons(self, frame: np.ndarray) -> List[Detection]:
        # Perform inference on best available device
        results = self.person_model.predict(
            frame, 
            device=self.device, 
            half=self.use_half, 
            verbose=False
        )
        all_dets = self._parse_yolo_detections(results, self._person_label_map)
        persons = [d for d in all_dets if d.cls_name == "person"]
        return persons

    @staticmethod
    def _norm_label(name: str) -> str:
        return " ".join(name.lower().replace("_", " ").split())

    @classmethod
    def _is_negative_ppe_label(cls, raw_name: str) -> bool:
        """
        Treat labels like "without - gloves" / "without hairnet" as explicit negatives.
        These must NOT count as PPE present.
        """
        n = cls._norm_label(raw_name)
        return n.startswith("without") or " without " in f" {n} "

    @classmethod
    def _is_glove_related_label(cls, raw_name: str) -> bool:
        """
        Robust glove detection that does NOT depend on exact class names.
        Any positive glove-ish class (e.g. "Glove Hand and Bare Hand - v3 V2", "gloves")
        counts as glove present, unless it is an explicit negative like "without - gloves".
        """
        if cls._is_negative_ppe_label(raw_name):
            return False
        n = cls._norm_label(raw_name)
        return "glove" in n  # matches "glove" and "gloves"

    @classmethod
    def _is_hairnet_related_label(cls, raw_name: str) -> bool:
        """
        Robust hairnet detection that does NOT depend on exact class names.
        Any positive hairnet-ish class counts as hairnet present, unless explicit negative.
        """
        if cls._is_negative_ppe_label(raw_name):
            return False
        n = cls._norm_label(raw_name)
        return "hairnet" in n or "hair net" in n

    def _detect_ppe(self, frame: np.ndarray) -> Tuple[List[Detection], List[str]]:
        # Perform inference on best available device
        results = self.ppe_model.predict(
            frame, 
            device=self.device, 
            half=self.use_half, 
            verbose=False
        )
        all_dets = self._parse_yolo_detections(results, self._ppe_label_map)

        hairnets: List[Detection] = []
        raw_labels_seen: List[str] = []

        for d in all_dets:
            raw_labels_seen.append(d.cls_name)

            # IMPORTANT: never leak raw PPE label names outward.
            # Only hairnet-related labels count, and with stricter confidence threshold.
            if self._is_hairnet_related_label(d.cls_name) and d.confidence >= 0.65:
                hairnets.append(
                    Detection(cls_name="hairnet", confidence=d.confidence, bbox=d.bbox)
                )
            # All other PPE classes, including glove-related ones, are ignored.

        return hairnets, raw_labels_seen

    @staticmethod
    def _hand_rois_from_person_bbox(
        frame: np.ndarray, bbox: Tuple[int, int, int, int]
    ) -> List[np.ndarray]:
        """
        Approximate left/right hand regions from the lower portion of the person box.
        Returns a list of small image regions (ROIs).
        """
        h, w, _ = frame.shape
        x1, y1, x2, y2 = bbox

        x1 = max(0, min(w - 1, x1))
        x2 = max(0, min(w, x2))
        y1 = max(0, min(h - 1, y1))
        y2 = max(0, min(h, y2))

        box_w = x2 - x1
        box_h = y2 - y1
        if box_w <= 0 or box_h <= 0:
            return []

        # Use lower 40% of the box height as "hand area".
        y_start = y1 + int(0.6 * box_h)
        y_end = y2

        # Two vertical strips: left and right hand areas.
        x_left_start = x1 + int(0.1 * box_w)
        x_left_end = x1 + int(0.35 * box_w)

        x_right_start = x1 + int(0.65 * box_w)
        x_right_end = x1 + int(0.9 * box_w)

        rois: List[np.ndarray] = []

        def _crop(xa: int, ya: int, xb: int, yb: int) -> None:
            if xb > xa and yb > ya:
                rois.append(frame[ya:yb, xa:xb])

        _crop(x_left_start, y_start, x_left_end, y_end)
        _crop(x_right_start, y_start, x_right_end, y_end)
        return rois

    @staticmethod
    def _roi_skin_ratio_hsv(roi_bgr: np.ndarray) -> float:
        """
        Estimate fraction of pixels in ROI that look like skin in HSV space.
        """
        if roi_bgr.size == 0:
            return 0.0
        roi_hsv = cv2.cvtColor(roi_bgr, cv2.COLOR_BGR2HSV)

        # Basic skin-tone range (demo-focused, not perfect)
        lower1 = np.array([0, 30, 60], dtype=np.uint8)
        upper1 = np.array([25, 200, 255], dtype=np.uint8)

        lower2 = np.array([160, 30, 60], dtype=np.uint8)
        upper2 = np.array([179, 200, 255], dtype=np.uint8)

        mask1 = cv2.inRange(roi_hsv, lower1, upper1)
        mask2 = cv2.inRange(roi_hsv, lower2, upper2)
        mask = cv2.bitwise_or(mask1, mask2)

        skin_pixels = cv2.countNonZero(mask)
        total_pixels = roi_bgr.shape[0] * roi_bgr.shape[1]
        if total_pixels == 0:
            return 0.0
        return skin_pixels / float(total_pixels)

    def _hands_show_skin(self, frame: np.ndarray, persons: List[Detection]) -> bool:
        """
        Heuristic: return True if any detected person's hand-region ROIs show
        a strong presence of skin-tone colors.
        """
        for p in persons:
            rois = self._hand_rois_from_person_bbox(frame, p.bbox)
            if not rois:
                continue
            ratios = [self._roi_skin_ratio_hsv(roi) for roi in rois]
            if not ratios:
                continue
            # If any hand ROI has a sizable skin ratio, consider gloves missing.
            if max(ratios) >= 0.15:
                return True
        return False

    def analyze_frame(self, frame: np.ndarray) -> Dict[str, Any]:
        """
        Run both YOLO models on a frame and derive high-level PPE compliance info.

        Returns a dict containing:
        - persons:   List[Detection]
        - gloves:    List[Detection]
        - hairnets:  List[Detection]
        - violations: List[str] (values from PPEViolationType)
        - is_compliant: bool
        - detections: List[Detection] (union of all detections for backwards use, if needed)
        """
        persons = self._detect_persons(frame)
        hairnets, raw_ppe_labels_seen = self._detect_ppe(frame)

        has_person = len(persons) > 0

        # Heuristic glove detection: look for skin-tone in approximate hand regions.
        # If skin is strongly visible, we treat gloves as missing for this frame.
        hands_show_skin = self._hands_show_skin(frame, persons) if has_person else False
        instant_gloves_present = has_person and not hands_show_skin

        # Instantaneous hairnet presence based on current frame only.
        instant_has_hairnet = len(hairnets) > 0

        now_ts = time.time()

        # Update last-seen timestamps when PPE is visible in current frame.
        if instant_gloves_present:
            self._glove_last_seen_ts = now_ts
        if instant_has_hairnet:
            self._hairnet_last_seen_ts = now_ts

        # Temporal smoothing: once PPE is seen, keep it "present" for a short window,
        # even if detections temporarily drop due to flicker.
        def _within_window(last_ts: float | None) -> bool:
            return last_ts is not None and (now_ts - last_ts) <= self._smoothing_window_sec

        has_glove = instant_gloves_present or _within_window(self._glove_last_seen_ts)
        has_hairnet = instant_has_hairnet or _within_window(self._hairnet_last_seen_ts)

        violations: List[str] = []
        if has_person:
            if not has_glove:
                violations.append(PPEViolationType.MISSING_GLOVES)
            if self.config.enable_hairnet_check and not has_hairnet:
                violations.append(PPEViolationType.MISSING_HAIRNET)

        is_compliant = has_person and not violations

        # Only include clean labels in detections, and only for persons.
        # Gloves/hairnets are represented via smoothed booleans, not per-frame boxes.
        detections: List[Detection] = []
        detections.extend(persons)   # "person" only

        _dbg_log(
            "H2",
            "hygiene_engine/detector.py:analyze_frame",
            "Per-frame summary",
            {
                "has_person": has_person,
                "instant_gloves_present": instant_gloves_present,
                "hands_show_skin": hands_show_skin,
                "instant_has_hairnet": instant_has_hairnet,
                "smoothed_has_glove": has_glove,
                "smoothed_has_hairnet": has_hairnet,
                "violations": violations,
                "raw_ppe_labels_seen_sample": raw_ppe_labels_seen[:10],
                "raw_ppe_labels_seen_count": len(raw_ppe_labels_seen),
            },
        )

        return {
            "persons": persons,
            "violations": violations,
            "is_compliant": is_compliant,
            "detections": detections,
        }

