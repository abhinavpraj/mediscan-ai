import json
import logging
from pathlib import Path
from typing import Any, cast

from app.core.config import settings

logger = logging.getLogger(__name__)


class LocalLLMExtractor:
    def __init__(self, model_path: Path | None = None) -> None:
        self.model_path = model_path or settings.model_path

    def is_available(self) -> bool:
        return self.model_path.exists()

    def extract_json(self, text: str) -> dict[str, Any] | None:
        if not self.is_available():
            return None
        try:
            from llama_cpp import Llama
        except Exception:
            logger.warning("llama-cpp-python is not installed; using deterministic extractor")
            return None

        prompt = (
            "Extract a medical report as compact JSON with keys patient_name, age, gender, "
            "report_type, hemoglobin, glucose, cholesterol, blood_pressure, risk_flags, recommendation.\n\n"
            f"TEXT:\n{text[:6000]}\nJSON:"
        )
        llm = Llama(model_path=str(self.model_path), n_ctx=4096, n_threads=4, verbose=False)
        output = llm(prompt, max_tokens=512, temperature=0.0, stop=["\n\n"])
        choices = cast(list[dict[str, Any]], output["choices"])
        raw = str(choices[0]["text"]).strip()
        try:
            parsed = json.loads(raw)
            return cast(dict[str, Any], parsed) if isinstance(parsed, dict) else None
        except json.JSONDecodeError:
            logger.warning("Local model returned non-JSON output; using deterministic extractor")
            return None
