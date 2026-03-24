"""
AlertManager — two-step alert lifecycle.

Flow:
  1. Engine detects violation → create_alert() → DB row with status 'pending_review'
  2. AlertsPage shows alert with snapshot image.
  3. User clicks "Re-Check" → POST /api/v1/alerts/{id}/recheck
     → AlertManager.recheck_alert() → re-runs detector on stored JPEG
     → If violation confirmed: apply_penalty(), status = 'confirmed_violation'
     → If cleared: status = 'resolved'
  4. Score only changes in step 3.
"""
from __future__ import annotations

from pathlib import Path
from typing import List, Optional, TYPE_CHECKING

import cv2
import numpy as np

from .database import (
    create_alert as db_create_alert,
    get_alert_by_id,
    confirm_violation,
    resolve_violation,
    get_pending_alerts,
    clear_all_violations,
)

from .config import VIOLATIONS_DIR

if TYPE_CHECKING:  # avoid circular imports at runtime
    from .detector import YoloPPEDetector
    from .scoring import HygieneScorer


class AlertManager:
    """
    Manages the lifecycle of hygiene violation alerts.
    One instance is shared by the HygieneEngine / HygieneService.
    """
    def __init__(self, detector: "YoloPPEDetector", scorer: "HygieneScorer") -> None:
        self._detector = detector
        self._scorer = scorer
        # Track pending alert IDs in memory
        self._pending_ids: List[int] = []
        self._sync_with_db()

    def _sync_with_db(self) -> None:
        """Synchronize the in-memory pending list with the actual database state."""
        try:
            pending = get_pending_alerts(limit=1000)
            self._pending_ids = [a["id"] for a in pending]
        except Exception as e:
            print(f"Error syncing AlertManager with DB: {e}")
            self._pending_ids = []

    # ------------------------------------------------------------------
    # Step 1 — called from engine.process_stream on violation detected
    # ------------------------------------------------------------------

    def queue_alert(
        self,
        violation_type: str,
        image_path: Path,
        hairnet_ok: bool,
        gloves_ok: bool,
    ) -> int:
        """
        Persist a new alert and add it to the in-memory pending list.
        score is NOT changed here.
        """
        alert_id = db_create_alert(
            violation_type=violation_type,
            image_path=image_path,
            hairnet=0 if not hairnet_ok else 1,
            gloves=0 if not gloves_ok else 1,
        )
        self._pending_ids.append(alert_id)
        return alert_id

    @property
    def pending_count(self) -> int:
        return len(self._pending_ids)

    # ------------------------------------------------------------------
    # Step 2 — called from POST /api/v1/alerts/{id}/recheck
    # ------------------------------------------------------------------

    def recheck_alert(self, alert_id: int) -> dict:
        """
        Re-run the PPE detector on the stored violation snapshot.

        Returns a result dict:
        {
          "alert_id": int,
          "still_violating": bool,
          "violations": List[str],
          "score": float,
          "score_int": int,
          "status": "confirmed_violation" | "resolved"
        }
        """
        alert = get_alert_by_id(alert_id)
        if alert is None:
            raise ValueError(f"Alert {alert_id} not found")

        image_path = Path(alert["image_path"])
        if not image_path.exists():
            # If the snapshot image is gone, assume resolved
            resolve_violation(alert_id)
            self._pending_ids = [i for i in self._pending_ids if i != alert_id]
            return {
                "alert_id": alert_id,
                "still_violating": False,
                "violations": [],
                "score": self._scorer.score,
                "score_int": self._scorer.score_int,
                "status": "resolved",
            }

        frame = cv2.imread(str(image_path))
        if frame is None:
            resolve_violation(alert_id)
            self._pending_ids = [i for i in self._pending_ids if i != alert_id]
            return {
                "alert_id": alert_id,
                "still_violating": False,
                "violations": [],
                "score": self._scorer.score,
                "score_int": self._scorer.score_int,
                "status": "resolved",
            }

        analysis = self._detector.analyze_frame(frame)
        violations: List[str] = analysis.get("violations", [])
        still_violating = len(violations) > 0

        if still_violating:
            # Confirmed → apply the scoring penalty NOW
            self._scorer.apply_penalty(violations)
            confirm_violation(alert_id)
            status = "confirmed_violation"
        else:
            resolve_violation(alert_id)
            status = "resolved"

        # Remove from pending list
        self._pending_ids = [i for i in self._pending_ids if i != alert_id]

        return {
            "alert_id": alert_id,
            "still_violating": still_violating,
            "violations": violations,
            "score": self._scorer.score,
            "score_int": self._scorer.score_int,
            "status": status,
        }

    def resolve_alert(self, alert_id: int) -> bool:
        """Mark an alert as resolved and remove from pending list."""
        success = resolve_violation(alert_id)
        if success:
            self._pending_ids = [i for i in self._pending_ids if i != alert_id]
        return success

    def sync(self) -> None:
        """Force a fresh sync with the database."""
        self._sync_with_db()

    def clear_alerts(self) -> None:
        """Delete all alerts from DB and all image files from disk."""
        try:
            # 1. Clear database
            clear_all_violations()
            # 2. Delete all images in violations directory
            if VIOLATIONS_DIR.exists():
                for f in VIOLATIONS_DIR.glob("*.jpg"):
                    try:
                        f.unlink()
                    except Exception as e:
                        print(f"Error deleting file {f}: {e}")
            # 3. Reset scorer
            self._scorer.reset()
            # 4. Clear in-memory state
            self._pending_ids = []
            print("AlertManager: All alerts cleared and score reset.")
        except Exception as e:
            print(f"Error clearing alerts: {e}")
