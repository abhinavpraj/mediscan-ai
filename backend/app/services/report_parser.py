import re
from typing import Any


class MedicalReportParser:
    def parse(self, text: str) -> dict[str, Any]:
        hemoglobin = self._number(text, r"\b(?:hb|hemoglobin)\s*[:\-]?\s*(\d+(?:\.\d+)?)")
        glucose = self._number(text, r"\b(?:glucose|blood sugar|fbs|rbs)\s*[:\-]?\s*(\d+(?:\.\d+)?)")
        cholesterol = self._number(text, r"\b(?:cholesterol|ldl)\s*[:\-]?\s*(\d+(?:\.\d+)?)")
        bp = self._match(text, r"\b(?:bp|blood pressure)\s*[:\-]?\s*(\d{2,3}\s*/\s*\d{2,3})")

        return {
            "hemoglobin": hemoglobin,
            "glucose": glucose,
            "cholesterol": cholesterol,
            "blood_pressure": bp.replace(" ", "") if bp else None,
        }

    def _match(self, text: str, pattern: str) -> str | None:
        match = re.search(pattern, text, re.IGNORECASE)
        return match.group(1).strip() if match else None

    def _number(self, text: str, pattern: str) -> float | None:
        value = self._match(text, pattern)
        return float(value) if value else None
