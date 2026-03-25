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
    Configuration for YOLOv8 models.

    ⚡ Using lightweight default YOLOv8n model for deployment
    (No custom best.pt required)
    """

    # Use same lightweight model for both
    person_weights_path: str = "yolov8n.pt"
    ppe_weights_path: str = "yolov8n.pt"

    # Labels kept for compatibility (not actively used now)
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
    enable_hairnet_check: bool = False  # Disabled (no custom model)


def ensure_directories() -> None:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    VIOLATIONS_DIR.mkdir(parents=True, exist_ok=True)


def default_engine_config() -> EngineConfig:
    ensure_directories()
    return EngineConfig()


ENGINE_CONFIG = default_engine_config()
