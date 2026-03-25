from dataclasses import dataclass
from typing import List, Tuple, Dict, Any

import cv2
import numpy as np

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

        # ❌ NO YOLO — lightweight mode
        self.person_model = None
        self.ppe_model = None

        self._glove_last_seen_ts = None
        self._hairnet_last_seen_ts = None
        self._smoothing_window_sec = 3.0

    # ✅ NO DETECTION (SAFE FOR RENDER)
    def _detect_persons(self, frame):
        return []

    def _detect_ppe(self, frame):
        return [], []

    def _hands_show_skin(self, frame, persons):
        return False

    def analyze_frame(self, frame):
        # Dummy response (no AI)
        persons = []

        has_person = False
        has_glove = True
        has_hairnet = True

        violations = []

        is_compliant = True

        _dbg_log(
            "H2",
            "detector",
            "frame analysis (dummy mode)",
            {
                "persons": 0,
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
