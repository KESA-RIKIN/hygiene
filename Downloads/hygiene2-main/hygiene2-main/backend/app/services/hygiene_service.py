import os
import sys
import threading
import time
import queue
import logging
from pathlib import Path
from typing import List, Optional

# We need to add backend/ to the Python path so hygiene_engine can be imported
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

import cv2
import numpy as np
from hygiene_engine.config import default_engine_config
from hygiene_engine.engine import HygieneEngine
from hygiene_engine.video_source import open_video_file, open_webcam, VideoSource

# Set up logging to console
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("HygieneService")

# ── Engine (models loaded once at startup) ──────────────────────────────────
config = default_engine_config()
config.show_visualization = False  # No popups in API mode

try:
    logger.info("Initializing HygieneEngine (Model Loading)...")
    engine = HygieneEngine(config=config)
    logger.info("HygieneEngine initialized successfully.")
except Exception as e:
    logger.error(f"Failed to initialize HygieneEngine: {e}")
    engine = None

# ── Thread-safe latest status ─────────────────────────────────────────────
_latest_status: dict = {
    "score": 80,
    "score_int": 80,
    "violations": [],
    "is_alert": False,
    "frame_count": 0,
    "hairnet_ok": True,
    "gloves_ok": True,
    "pending_alerts": 0,
}
_status_lock = threading.Lock()

def _update_latest_status(score_dict: dict) -> None:
    global _latest_status
    with _status_lock:
        _latest_status = score_dict

def get_latest_status() -> dict:
    with _status_lock:
        return dict(_latest_status)

def get_alert_manager():
    if engine is None:
        return None
    return engine.alert_manager

# ── Broadcaster ──────────────────────────────────────────────────────────────

class GlobalStreamer:
    def __init__(self):
        self.active_vs: Optional[VideoSource] = None
        self.latest_encoded_frame: bytes = b""
        self.subscribers: List[queue.Queue] = []
        self.lock = threading.Lock()
        self.is_running = False
        self.thread: Optional[threading.Thread] = None
        self.error_msg: Optional[str] = None

    def _create_info_frame(self, text: str, bg_color=(30, 30, 30)) -> bytes:
        """Helper to create a JPEG frame with text for status/errors."""
        frame = np.zeros((480, 640, 3), dtype=np.uint8)
        frame[:] = bg_color
        cv2.putText(
            frame, text, (80, 240),
            cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 255, 255), 2
        )
        _, buf = cv2.imencode(".jpg", frame, [cv2.IMWRITE_JPEG_QUALITY, 70])
        return buf.tobytes()

    def _worker(self, source: int):
        logger.info(f"Streamer background thread started for source {source}")
        try:
            self.active_vs = open_webcam(source)
            if not self.active_vs.cap.isOpened():
                raise RuntimeError(f"Could not open camera at source {source}")

            if engine is None:
                raise RuntimeError("Engine not ready")

            logger.info("Camera opened. Starting frame processing...")
            
            for annotated_frame, score_dict in engine.process_stream(self.active_vs):
                _update_latest_status(score_dict)

                ret, buffer = cv2.imencode(".jpg", annotated_frame, [cv2.IMWRITE_JPEG_QUALITY, 70])
                if not ret:
                    continue
                
                frame_bytes = buffer.tobytes()
                self.latest_encoded_frame = frame_bytes

                with self.lock:
                    for q in self.subscribers[:]:
                        try:
                            q.put_nowait(frame_bytes)
                        except queue.Full:
                            try: q.get_nowait() # drop oldest
                            except: pass
                            try: q.put_nowait(frame_bytes)
                            except: pass

                if not self.is_running:
                    break
        except Exception as e:
            msg = f"Camera Error: {str(e)}"
            logger.error(msg)
            self.error_msg = msg
            # Broadcast error frame once
            err_frame = self._create_info_frame(msg, bg_color=(0, 0, 50))
            with self.lock:
                for q in self.subscribers:
                    try: q.put_nowait(err_frame)
                    except: pass
        finally:
            logger.info("Streamer background thread shutting down")
            if self.active_vs:
                self.active_vs.release()
                self.active_vs = None
            self.is_running = False

    def start(self, source: int = 0):
        with self.lock:
            if not self.is_running:
                self.is_running = True
                self.error_msg = None
                self.thread = threading.Thread(target=self._worker, args=(source,), daemon=True)
                self.thread.start()

    def subscribe(self) -> queue.Queue:
        q = queue.Queue(maxsize=1) # Only keep most recent frame per client
        with self.lock:
            self.subscribers.append(q)
        return q

    def unsubscribe(self, q: queue.Queue):
        with self.lock:
            if q in self.subscribers:
                self.subscribers.remove(q)

_global_streamer = GlobalStreamer()

def generate_live_frames(source: int = 0):
    """
    Subscriber-based generator that yields MJPEG frames.
    - Yields a placeholder immediately.
    - Pulls frames from the persistent background streamer.
    """
    _global_streamer.start(source)
    q = _global_streamer.subscribe()
    
    # Send immediate feedback so browser doesn't time out
    initial = _global_streamer.latest_encoded_frame or _global_streamer._create_info_frame("Initializing Feed...")
    yield (b'--frame\r\n' b'Content-Type: image/jpeg\r\n\r\n' + initial + b'\r\n')

    try:
        while True:
            try:
                frame_bytes = q.get(timeout=2.0)
                yield (b'--frame\r\n' b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')
            except queue.Empty:
                if not _global_streamer.is_running:
                    msg = _global_streamer.error_msg or "Camera disconnected"
                    yield (b'--frame\r\n' b'Content-Type: image/jpeg\r\n\r\n' + 
                           _global_streamer._create_info_frame(msg) + b'\r\n')
                    break
                continue
    finally:
        _global_streamer.unsubscribe(q)

def process_video(video_path: str):
    if engine is None: return {"error": "Engine not initialized"}
    vs = open_video_file(video_path)
    metrics = engine.run(video_source=vs)
    # ... (rest of process_video remains the same)
    return {"metrics": {"total_frames": metrics.total_frames, "compliant_frames": metrics.compliant_frames, "compliance_score": metrics.compliance_score}, "violations": []}
