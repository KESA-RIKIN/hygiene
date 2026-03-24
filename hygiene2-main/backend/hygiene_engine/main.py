import argparse
from typing import Optional

from .config import ENGINE_CONFIG
from .engine import HygieneEngine
from .video_source import open_webcam, open_video_file


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Hygiene Compliance Auditor - CV Backend Engine"
    )
    parser.add_argument(
        "--source",
        type=str,
        choices=["webcam", "path"],
        required=True,
        help="Video source: 'webcam' for live camera, 'path' for video file.",
    )
    parser.add_argument(
        "--video-path",
        type=str,
        default="",
        help="Path to video file when --source=path.",
    )
    parser.add_argument(
        "--show",
        action="store_true",
        help="Show visualization window with frames.",
    )
    parser.add_argument(
        "--max-frames",
        type=int,
        default=0,
        help="Optional max number of frames to process (0 = unlimited).",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()

    config = ENGINE_CONFIG
    if args.show:
        config.show_visualization = True

    if args.source == "webcam":
        vs = open_webcam()
    else:
        if not args.video_path:
            raise SystemExit("--video-path is required when --source=path")
        vs = open_video_file(args.video_path)

    engine = HygieneEngine(config=config)
    stop_after: Optional[int] = args.max_frames if args.max_frames > 0 else None
    metrics = engine.run(video_source=vs, stop_after_frames=stop_after)

    print(
        f"Total frames: {metrics.total_frames}, "
        f"Compliant frames: {metrics.compliant_frames}, "
        f"Compliance score: {metrics.compliance_score:.3f}"
    )


if __name__ == "__main__":
    main()

