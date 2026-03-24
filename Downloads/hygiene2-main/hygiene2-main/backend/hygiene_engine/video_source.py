from dataclasses import dataclass
from typing import Iterator, Optional

import cv2


@dataclass
class VideoFrame:
    frame: "cv2.Mat"
    index: int


class VideoSource:
    """
    Simple abstraction over OpenCV VideoCapture for webcam or file.
    """

    def __init__(self, source: int | str) -> None:
        self.source = source
        # On Windows, CAP_DSHOW is often much faster for webcam startup than the default MSMF
        if isinstance(source, int):
            self.cap = cv2.VideoCapture(source, cv2.CAP_DSHOW)
            self.cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
            self.cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
            self.cap.set(cv2.CAP_PROP_BUFFERSIZE, 2)
        else:
            self.cap = cv2.VideoCapture(source)
            
        if not self.cap.isOpened():
            # Fallback for devices where DSHOW fails
            if isinstance(source, int):
                self.cap = cv2.VideoCapture(source)
            if not self.cap.isOpened():
                raise RuntimeError(f"Unable to open video source: {source}")

    def frames(self) -> Iterator[VideoFrame]:
        idx = 0
        while True:
            ret, frame = self.cap.read()
            if not ret:
                break
            yield VideoFrame(frame=frame, index=idx)
            idx += 1

    def release(self) -> None:
        if self.cap is not None:
            self.cap.release()


def open_webcam(index: int = 0) -> VideoSource:
    return VideoSource(index)


def open_video_file(path: str) -> VideoSource:
    return VideoSource(path)

