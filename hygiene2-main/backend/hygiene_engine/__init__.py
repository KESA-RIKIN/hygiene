"""
Hygiene Compliance Auditor - core backend engine package.

This package provides:
- Video frame acquisition (webcam or file)
- YOLOv8-based PPE detection
- Violation logging to SQLite with image evidence
- Basic hygiene compliance metrics

API and UI layers can import and orchestrate the engine from here.
"""

__all__ = [
    "config",
    "database",
    "detector",
    "video_source",
    "engine",
]

