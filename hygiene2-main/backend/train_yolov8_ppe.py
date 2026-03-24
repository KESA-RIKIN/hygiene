"""
YOLOv8 PPE Training Script (Ultralytics)

## Install

Create/activate a virtual environment, then install Ultralytics:

```bash
pip install ultralytics
```

Ultralytics will install PyTorch automatically in many setups. If you run into CUDA/GPU issues,
install the correct PyTorch build for your system from the official PyTorch instructions.

## Dataset structure (YOLO format)

This script expects a standard YOLO dataset layout:

```
dataset/
  images/
    train/
      *.jpg|*.png
    val/
      *.jpg|*.png
  labels/
    train/
      *.txt          # YOLO annotations: class x_center y_center width height (normalized)
    val/
      *.txt
  data.yaml
```

Your `data.yaml` should define 3 classes exactly in this order:

```yaml
path: dataset
train: images/train
val: images/val
names:
  0: person
  1: gloves
  2: hairnet
```

## Run

From the project root:

```bash
python train_yolov8_ppe.py --data dataset/data.yaml
```

Defaults follow your requirements:
- base weights: yolov8n.pt
- epochs: 50
- imgsz: 640
- batch: 16
- device: GPU if available else CPU

Outputs are saved under `runs/detect/`.
"""

from __future__ import annotations

import argparse
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Optional, Tuple

from ultralytics import YOLO


@dataclass(frozen=True)
class TrainConfig:
    data_yaml: Path
    base_weights: str = "yolov8n.pt"
    epochs: int = 50
    imgsz: int = 640
    batch: int = 16
    project: str = "runs/detect"
    name: str = "ppe_yolov8"


def parse_args() -> TrainConfig:
    parser = argparse.ArgumentParser(description="Train a custom YOLOv8 PPE detector.")
    parser.add_argument(
        "--data",
        required=True,
        type=str,
        help="Path to data.yaml (YOLO format dataset config).",
    )
    parser.add_argument(
        "--weights",
        default="yolov8n.pt",
        type=str,
        help="Base pretrained weights (default: yolov8n.pt).",
    )
    parser.add_argument("--epochs", default=50, type=int, help="Training epochs.")
    parser.add_argument("--imgsz", default=640, type=int, help="Image size.")
    parser.add_argument("--batch", default=16, type=int, help="Batch size.")
    parser.add_argument(
        "--project",
        default="runs/detect",
        type=str,
        help="Root directory for training runs.",
    )
    parser.add_argument(
        "--name",
        default="ppe_yolov8",
        type=str,
        help="Run name (subfolder under --project).",
    )
    args = parser.parse_args()

    return TrainConfig(
        data_yaml=Path(args.data),
        base_weights=args.weights,
        epochs=args.epochs,
        imgsz=args.imgsz,
        batch=args.batch,
        project=args.project,
        name=args.name,
    )


def select_device() -> str:
    """
    Returns a device string accepted by Ultralytics:
    - "0" for the first CUDA GPU when available
    - "cpu" otherwise
    """
    try:
        import torch  # type: ignore

        if torch.cuda.is_available():
            return "0"
    except Exception:
        pass
    return "cpu"


def resolve_best_weights_path(
    model: YOLO, train_return: Any, fallback_save_dir: Optional[Path]
) -> Optional[Path]:
    """
    Ultralytics has changed train() return types across versions.
    This resolver tries multiple ways to find the best.pt produced by training.
    """
    # 1) Model's trainer object (most reliable)
    trainer = getattr(model, "trainer", None)
    if trainer is not None:
        best = getattr(trainer, "best", None)
        if best:
            p = Path(str(best))
            if p.exists():
                return p
        save_dir = getattr(trainer, "save_dir", None)
        if save_dir:
            p = Path(str(save_dir)) / "weights" / "best.pt"
            if p.exists():
                return p

    # 2) Train return object may contain save_dir
    save_dir = getattr(train_return, "save_dir", None)
    if save_dir:
        p = Path(str(save_dir)) / "weights" / "best.pt"
        if p.exists():
            return p

    # 3) Fallback to expected location under save_dir
    if fallback_save_dir is not None:
        p = fallback_save_dir / "weights" / "best.pt"
        if p.exists():
            return p

    return None


def print_val_metrics(val_return: Any) -> None:
    """
    Attempt to print common validation metrics in a stable way.
    """
    # Common metrics are available as attributes in many Ultralytics versions.
    # We keep this defensive to avoid breaking across versions.
    box = getattr(val_return, "box", None)
    if box is not None:
        mp = getattr(box, "mp", None)  # mean precision
        mr = getattr(box, "mr", None)  # mean recall
        map50 = getattr(box, "map50", None)
        map = getattr(box, "map", None)  # mAP50-95
        print("Validation metrics (box):")
        print(f"- Precision (mean): {mp}")
        print(f"- Recall (mean):    {mr}")
        print(f"- mAP@0.5:          {map50}")
        print(f"- mAP@0.5:0.95:     {map}")
        return

    # Alternate structure: metrics as dict-like
    metrics = getattr(val_return, "results_dict", None)
    if isinstance(metrics, dict):
        print("Validation metrics:")
        for k, v in metrics.items():
            print(f"- {k}: {v}")
        return

    print("Validation completed. (Metrics object format not recognized for printing.)")


def train_and_validate(cfg: TrainConfig) -> Tuple[Optional[Path], Optional[Path]]:
    if not cfg.data_yaml.exists():
        raise SystemExit(f"data.yaml not found: {cfg.data_yaml}")

    device = select_device()
    print(f"Using device: {device}")

    model = YOLO(cfg.base_weights)

    print("Starting training...")
    train_return = model.train(
        data=str(cfg.data_yaml),
        epochs=cfg.epochs,
        imgsz=cfg.imgsz,
        batch=cfg.batch,
        device=device,
        project=cfg.project,
        name=cfg.name,
        save=True,  # ensures weights are saved
    )

    # Determine save_dir for printing and best-path resolution.
    trainer = getattr(model, "trainer", None)
    save_dir = None
    if trainer is not None:
        save_dir = getattr(trainer, "save_dir", None)
    if save_dir is None:
        save_dir = getattr(train_return, "save_dir", None)
    save_dir_path = Path(str(save_dir)) if save_dir else None

    if save_dir_path is not None:
        print(f"Training artifacts saved to: {save_dir_path}")
        results_csv = save_dir_path / "results.csv"
        if results_csv.exists():
            print(f"Training metrics CSV: {results_csv}")

    best_path = resolve_best_weights_path(
        model=model, train_return=train_return, fallback_save_dir=save_dir_path
    )
    if best_path is not None:
        print(f"Best weights: {best_path}")
    else:
        print("Best weights not found automatically (expected best.pt).")

    print("Running validation...")
    val_return = model.val(
        data=str(cfg.data_yaml),
        imgsz=cfg.imgsz,
        batch=cfg.batch,
        device=device,
    )

    print_val_metrics(val_return)

    return best_path, save_dir_path


def main() -> None:
    cfg = parse_args()
    best_path, save_dir = train_and_validate(cfg)

    print("\n=== Export ===")
    if best_path is not None:
        print(f"EXPORT_BEST_MODEL_PATH={best_path}")
    else:
        print("EXPORT_BEST_MODEL_PATH=NOT_FOUND")
        if save_dir is not None:
            print(f"(Check under: {save_dir / 'weights'})")


if __name__ == "__main__":
    main()

