"""
Trust-based non-linear compliance scoring module.

Model:
    S(0)   = 80  (initial score)
    alpha  = 0.05  (recovery rate)
    beta   = 0.25  (penalty rate)
    gamma  = 5     (severity amplifier)
    V      = number of violations (0, 1, or 2, ...)

    If V == 0:  S(t+1) = S(t) + alpha * (100 - S(t))
    If V  > 0:  S(t+1) = S(t) - beta * S(t) - gamma * V^2

    Score is always clamped to [0, 100].
"""
from __future__ import annotations

from dataclasses import dataclass, field
from typing import List


@dataclass
class ScoringConfig:
    """Tunable constants for the scoring model."""
    initial_score: float = 100.0
    alpha: float = 0.05   # recovery rate
    beta: float = 0.25    # penalty rate
    gamma: float = 5.0    # severity amplifier

    # Alert threshold: score drops below this => raise alert
    alert_threshold: float = 60.0


class HygieneScorer:
    """
    Stateful, frame-by-frame compliance scorer.

    Maintains a running trust score that:
    - Increases slowly when the worker is compliant.
    - Decreases aggressively (quadratic) when violations occur.

    Add new hygiene parameters by simply counting extra violations
    and passing them into `update()`.
    """

    def __init__(self, config: ScoringConfig | None = None) -> None:
        self.config = config or ScoringConfig()
        self._score: float = self.config.initial_score
        self._last_violations: List[str] = []
        self._frame_count: int = 0

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------

    @property
    def score(self) -> float:
        """Current compliance score in [0, 100]."""
        return self._score

    @property
    def score_int(self) -> int:
        return int(round(self._score))

    @property
    def last_violations(self) -> List[str]:
        return list(self._last_violations)

    @property
    def is_alert(self) -> bool:
        return self._score < self.config.alert_threshold

    def recover(self) -> float:
        """
        Apply one recovery step (called per-frame when compliant).
        Score moves slowly toward 100.
        """
        self._frame_count += 1
        self._last_violations = []
        cfg = self.config
        s = self._score + cfg.alpha * (100.0 - self._score)
        self._score = max(0.0, min(100.0, s))
        return self._score

    def apply_penalty(self, violations: List[str]) -> float:
        """
        Apply the quadratic penalty for confirmed violations.
        Called ONLY from the re-check API after human confirmation.
        NOT called during live stream detection.

        Args:
            violations: list of PPEViolationType strings (must be non-empty)

        Returns:
            Updated score value.
        """
        self._last_violations = list(violations)
        cfg = self.config
        v = len(violations)
        s = self._score - cfg.beta * self._score - cfg.gamma * (v ** 2)
        self._score = max(0.0, min(100.0, s))
        return self._score

    def update(self, violations: List[str]) -> float:
        """
        Legacy compatibility shim.
        During live streaming, only drive recovery (ignore violations path).
        Penalty is applied exclusively via apply_penalty() from the recheck API.
        """
        if not violations:
            return self.recover()
        # Violation detected in live stream — do NOT penalise.
        # Just tick the frame counter and record last seen violations for status display.
        self._frame_count += 1
        self._last_violations = list(violations)
        return self._score

    def reset(self) -> None:
        """Reset scorer to initial state (e.g., start of new shift)."""
        self._score = self.config.initial_score
        self._last_violations = []
        self._frame_count = 0

    def to_dict(self) -> dict:
        """Serialize for JSON API responses."""
        return {
            "score": round(self._score, 2),
            "score_int": self.score_int,
            "violations": self._last_violations,
            "is_alert": self.is_alert,
            "frame_count": self._frame_count,
        }
