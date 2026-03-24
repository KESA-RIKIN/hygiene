import asyncio
from concurrent.futures import ThreadPoolExecutor

from fastapi import APIRouter
from fastapi.responses import StreamingResponse

from app.services.hygiene_service import generate_live_frames, get_latest_status

router = APIRouter()

# Thread pool dedicated to the blocking camera/CV loop so it never stalls
# FastAPI's async event loop.
_stream_executor = ThreadPoolExecutor(max_workers=2, thread_name_prefix="mjpeg")


async def _async_frame_gen(source: int = 0):
    """
    Wraps the synchronous `generate_live_frames` generator so it runs inside
    a thread-pool worker.  Each frame is sent as soon as it is ready, while
    the asyncio event loop stays free to handle all other requests.
    """
    loop = asyncio.get_event_loop()
    gen = generate_live_frames(source)

    while True:
        try:
            # Run the blocking next() inside the thread-pool
            chunk = await loop.run_in_executor(_stream_executor, next, gen)
            yield chunk
        except StopIteration:
            break
        except Exception as exc:
            print(f"[live/video] stream error: {exc}")
            break


@router.get("/live/video")
async def live_video_feed():
    """
    Streams the live webcam feed with YOLO hygiene compliance annotations.
    Uses multipart/x-mixed-replace (MJPEG) so a plain <img src=...> works.
    """
    return StreamingResponse(
        _async_frame_gen(),
        media_type="multipart/x-mixed-replace; boundary=frame",
        headers={
            # Disable all intermediate caching / buffering
            "Cache-Control": "no-cache, no-store, must-revalidate",
            "Pragma": "no-cache",
            "Expires": "0",
            "X-Accel-Buffering": "no",   # disable nginx buffering if behind a proxy
        },
    )


@router.get("/live/status")
async def live_status():
    """
    Returns the current live compliance score and active violations.
    Intended to be polled every 1-2 seconds by the frontend.
    """
    return get_latest_status()
