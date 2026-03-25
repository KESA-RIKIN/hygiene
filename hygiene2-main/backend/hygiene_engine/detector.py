from dataclasses import dataclass
from typing import List, Tuple, Dict, Any

import cv2
import numpy as np
from ultralytics import YOLO

from .config import EngineConfig

import json
import time
from pathlib import Path


@dataclass
class Detection:
    cls_name: str
    confidence: float
    bbox: Tuple[int, int, int, int]


class PPEViolationType:
    MISSING_GLOVES = "missing_gloves"
    MISSING_HAIRNET = "missing_hairnet"


def _dbg_log(hypothesis_id: str, location: str, message: str, data: Dict[str, Any]) -> None:
    try:
        payload = {
            "sessionId": "6c5d88",
            "runId": "prod",
            "hypothesisId": hypothesis_id,
            "location": location,
            "message": message,
            "data": data,
            "timestamp": int(time.time() * 1000),
        }
        log_path = Path(__file__).resolve().parent.parent / "debug.log"
        with open(log_path, "a", encoding="utf-8") as f:
            f.write(json.dumps(payload) + "\n")
    except Exception:
        pass


class YoloPPEDetector:
    def __init__(self, config: EngineConfig) -> None:
        self.config = config

        # Always use CPU on Render
        self.device = "cpu"
        self.use_half = False

        # Use lightweight default model
        self.person_model = YOLO("yolov8n.pt")
        self.ppe_model = YOLO("yolov8n.pt")

        self._person_label_map = self.person_model.model.names
        self._ppe_label_map = self.ppe_model.model.names

        self._glove_last_seen_ts = None
        self._hairnet_last_seen_ts = None
        self._smoothing_window_sec = 3.0

        # Warmup
        try:
            dummy = np.zeros((480, 640, 3), dtype=np.uint8)
            self.person_model.predict(dummy, device=self.device, verbose=False)
        except:
            pass

    def _parse_yolo_detections(self, results, label_map):
        detections = []
        r0 = results[0]

        for box in r0.boxes:
            score = float(box.conf.item())
            if score < self.config.min_confidence:
                continue

            cls_id = int(box.cls.item())
            name = label_map.get(cls_id, str(cls_id))

            x1, y1, x2, y2 = box.xyxy[0].tolist()

            detections.append(
                Detection(name, score, (int(x1), int(y1), int(x2), int(y2)))
            )

        return detections

    def _detect_persons(self, frame):
        results = self.person_model.predict(frame, device=self.device, verbose=False)
        all_dets = self._parse_yolo_detections(results, self._person_label_map)
        return [d for d in all_dets if d.cls_name == "person"]

    # 🔥 SIMPLIFIED PPE (NO CUSTOM MODEL)
    def _detect_ppe(self, frame):
        return [], []

    def _hands_show_skin(self, frame, persons):
        for p in persons:
            x1, y1, x2, y2 = p.bbox
            roi = frame[y1:y2, x1:x2]

            if roi.size == 0:
                continue

            hsv = cv2.cvtColor(roi, cv2.COLOR_BGR2HSV)

            lower = np.array([0, 30, 60])
            upper = np.array([25, 200, 255])

            mask = cv2.inRange(hsv, lower, upper)
            ratio = cv2.countNonZero(mask) / (roi.shape[0] * roi.shape[1])

            if ratio > 0.15:
                return True

        return False

    def analyze_frame(self, frame):
        persons = self._detect_persons(frame)

        has_person = len(persons) > 0
        hands_show_skin = self._hands_show_skin(frame, persons) if has_person else False

        has_glove = has_person and not hands_show_skin
        has_hairnet = False  # disabled

        violations = []

        if has_person:
            if not has_glove:
                violations.append(PPEViolationType.MISSING_GLOVES)

        is_compliant = has_person and not violations

        _dbg_log(
            "H2",
            "detector",
            "frame analysis",
            {
                "persons": len(persons),
                "glove": has_glove,
                "violations": violations,
            },
        )

        return {
            "persons": persons,
            "violations": violations,
            "is_compliant": is_compliant,
            "detections": persons,
        }
