from pathlib import Path
from dataclasses import dataclass, field
from typing import List


PROJECT_ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = PROJECT_ROOT / "data"
VIOLATIONS_DIR = DATA_DIR / "violations"
DB_PATH = DATA_DIR / "violations.db"


@dataclass
class ModelConfig:
    """
    Configuration for YOLOv8 models and PPE labels.

    Dual-model setup:
    - Person detector (yolov8n.pt)
    - PPE detector (custom trained best.pt)
    """

    # Pretrained COCO person detector
    person_weights_path: str = "yolov8n.pt"

    # Custom PPE model
    ppe_weights_path: str = str(
        PROJECT_ROOT
        / "runs"
        / "detect"
        / "runs"
        / "detect"
        / "ppe_yolov82"
        / "weights"
        / "best.pt"
    )

    # Only these classes are used from PPE model
    glove_labels: List[str] = field(default_factory=lambda: [
    "gloves",
    "Glove Hand and Bare Hand - v3 V2"
                                  ])
    hairnet_labels: List[str] = field(default_factory=lambda: ["hairnet"])


@dataclass
class CooldownConfig:
    """
    Prevent duplicate logging of same violation.
    """
    violation_cooldown_seconds: float = 5.0


@dataclass
class EngineConfig:
    """
    Overall engine configuration.
    """

    model: ModelConfig = field(default_factory=ModelConfig)
    cooldown: CooldownConfig = field(default_factory=CooldownConfig)

    # Detection threshold
    min_confidence: float = 0.25

    # Visualization settings
    show_visualization: bool = True
    draw_annotations: bool = True

    # Optional checks
    # Disabled by default for stable demo runs; toggle to True for full system.
    enable_hairnet_check: bool = True


def ensure_directories() -> None:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    VIOLATIONS_DIR.mkdir(parents=True, exist_ok=True)


def default_engine_config() -> EngineConfig:
    ensure_directories()
    return EngineConfig()


ENGINE_CONFIG = default_engine_config()