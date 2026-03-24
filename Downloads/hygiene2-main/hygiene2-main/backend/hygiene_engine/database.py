import sqlite3
from contextlib import contextmanager
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path
from typing import Iterator, Optional, List

from .config import DB_PATH, ensure_directories


@dataclass
class ViolationRecord:
    id: Optional[int]
    violation_type: str
    timestamp: datetime
    image_path: str
    status: str = "pending_review"
    hairnet: int = 0
    gloves: int = 0


def _get_connection() -> sqlite3.Connection:
    ensure_directories()
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


@contextmanager
def db_session() -> Iterator[sqlite3.Connection]:
    conn = _get_connection()
    try:
        yield conn
        conn.commit()
    finally:
        conn.close()


def init_db() -> None:
    """
    Initialize the SQLite database with required tables.
    Idempotent: safe to call on every startup.
    """
    with db_session() as conn:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS violations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                violation_type TEXT NOT NULL,
                timestamp TEXT NOT NULL,
                image_path TEXT NOT NULL,
                status TEXT NOT NULL DEFAULT 'pending_review',
                hairnet INTEGER NOT NULL DEFAULT 0,
                gloves INTEGER NOT NULL DEFAULT 0
            )
            """
        )
        # Idempotent column migrations
        for col_sql in [
            "ALTER TABLE violations ADD COLUMN status TEXT NOT NULL DEFAULT 'pending_review'",
            "ALTER TABLE violations ADD COLUMN hairnet INTEGER NOT NULL DEFAULT 0",
            "ALTER TABLE violations ADD COLUMN gloves INTEGER NOT NULL DEFAULT 0",
        ]:
            try:
                conn.execute(col_sql)
            except Exception:
                pass  # Column already exists


# ---------------------------------------------------------------------------
# Alert lifecycle  (two-step verification)
# ---------------------------------------------------------------------------

def create_alert(
    violation_type: str,
    image_path: Path,
    hairnet: int = 0,
    gloves: int = 0,
) -> int:
    """
    Insert a new alert row with status 'pending_review'.
    Returns the new row's id.
    """
    timestamp = datetime.utcnow().isoformat()
    with db_session() as conn:
        cursor = conn.execute(
            """
            INSERT INTO violations (violation_type, timestamp, image_path, status, hairnet, gloves)
            VALUES (?, ?, ?, 'pending_review', ?, ?)
            """,
            (violation_type, timestamp, str(image_path), hairnet, gloves),
        )
        return cursor.lastrowid  # type: ignore[return-value]


def get_alert_by_id(alert_id: int) -> Optional[dict]:
    """Fetch a single alert row as a dict."""
    with db_session() as conn:
        cursor = conn.execute(
            "SELECT id, violation_type, timestamp, image_path, status, hairnet, gloves FROM violations WHERE id = ?",
            (alert_id,),
        )
        row = cursor.fetchone()
    if row is None:
        return None
    return dict(row)


def get_pending_alerts(limit: int = 20) -> List[dict]:
    """Return all alerts with status 'pending_review'."""
    with db_session() as conn:
        cursor = conn.execute(
            """
            SELECT id, violation_type, timestamp, image_path, status, hairnet, gloves
            FROM violations
            WHERE status = 'pending_review'
            ORDER BY id DESC
            LIMIT ?
            """,
            (limit,),
        )
        rows = cursor.fetchall()
    return [dict(r) for r in rows]


def confirm_violation(violation_id: int) -> bool:
    """Set status to 'confirmed_violation' after re-check confirms the issue."""
    with db_session() as conn:
        conn.execute(
            "UPDATE violations SET status = 'confirmed_violation' WHERE id = ?",
            (violation_id,),
        )
    return True


def resolve_violation(violation_id: int) -> bool:
    """Set status to 'resolved' (user corrected / no penalty)."""
    with db_session() as conn:
        conn.execute(
            "UPDATE violations SET status = 'resolved' WHERE id = ?",
            (violation_id,),
        )
    return True


# ---------------------------------------------------------------------------
# Legacy / general helpers kept for backwards compatibility
# ---------------------------------------------------------------------------

def log_violation(violation_type: str, image_path: Path) -> None:
    """
    Insert a new violation record into the database (legacy path, used by engine.run()).
    """
    create_alert(violation_type=violation_type, image_path=image_path)


def fetch_violations(limit: int = 100) -> List[ViolationRecord]:
    """Fetch the most recent violations from the database."""
    with db_session() as conn:
        cursor = conn.execute(
            """
            SELECT id, violation_type, timestamp, image_path, status, hairnet, gloves
            FROM violations
            ORDER BY id DESC
            LIMIT ?
            """,
            (limit,),
        )
        rows = cursor.fetchall()

    return [
        ViolationRecord(
            id=row["id"],
            violation_type=row["violation_type"],
            timestamp=datetime.fromisoformat(row["timestamp"]),
            image_path=row["image_path"],
            status=row["status"],
            hairnet=row["hairnet"],
            gloves=row["gloves"],
        )
        for row in rows
    ]


def fetch_recent_violations(limit: int = 20) -> List[dict]:
    """Fetch recent violations as dicts for JSON API serialization."""
    with db_session() as conn:
        cursor = conn.execute(
            """
            SELECT id, violation_type, timestamp, image_path, status, hairnet, gloves
            FROM violations
            ORDER BY id DESC
            LIMIT ?
            """,
            (limit,),
        )
        rows = cursor.fetchall()
    return [dict(r) for r in rows]


    return True


def clear_all_violations() -> bool:
    """Delete all records from the violations table."""
    with db_session() as conn:
        conn.execute("DELETE FROM violations")
    return True
