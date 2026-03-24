import os
import sys

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", "..")))

from fastapi import APIRouter, HTTPException

from hygiene_engine.database import fetch_recent_violations, resolve_violation
from app.services.hygiene_service import get_alert_manager

router = APIRouter()


@router.get("/alerts")
async def get_alerts(limit: int = 20):
    """
    Returns recent violation alerts from the database.
    Includes image_url for each alert so the frontend can display the snapshot.
    """
    try:
        violations = fetch_recent_violations(limit=limit)
        # Attach image URL based on stored image_path filename
        for v in violations:
            img_path = v.get("image_path", "")
            filename = img_path.split("\\")[-1].split("/")[-1] if img_path else ""
            v["image_url"] = f"/api/v1/images/{filename}" if filename else None
        return {"status": "ok", "alerts": violations}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/alerts/{alert_id}/recheck")
async def recheck_alert(alert_id: int):
    """
    Re-runs the PPE detector on the stored violation snapshot.
    If the violation is confirmed, applies the scoring penalty and returns the new score.
    If corrected, marks the alert as resolved without any score change.
    """
    alert_mgr = get_alert_manager()
    if alert_mgr is None:
        raise HTTPException(status_code=503, detail="Engine not available")
    try:
        result = alert_mgr.recheck_alert(alert_id)
        return {"status": "ok", **result}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/alerts/{alert_id}/resolve")
async def resolve_alert(alert_id: int):
    """
    Marks a violation as 'resolved' without applying any penalty.
    Ensures the notification count is updated.
    """
    alert_mgr = get_alert_manager()
    if alert_mgr:
        alert_mgr.resolve_alert(alert_id)
        return {"status": "ok", "message": f"Alert {alert_id} resolved"}
    
    # Fallback if mgr not available
    try:
        resolve_violation(alert_id)
        return {"status": "ok", "message": f"Alert {alert_id} resolved"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/alerts")
async def delete_all_alerts():
    """
    Deletes all alerts from the database and disk.
    Resets the notification count to 0.
    """
    alert_mgr = get_alert_manager()
    if alert_mgr is None:
        raise HTTPException(status_code=503, detail="Engine not available")
    try:
        alert_mgr.clear_alerts()
        return {"status": "ok", "message": "All alerts cleared"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
