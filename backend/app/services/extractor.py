import re

from app.schemas.report import StructuredReport


class MedicalExtractor:
    def extract(self, text: str) -> StructuredReport:
        patient_name = self._match(text, r"(?:patient|name)\s*[:\-]\s*([A-Za-z][A-Za-z .'-]{1,80})")
        age_value = self._match(text, r"\bage\s*[:\-]?\s*(\d{1,3})")
        gender = self._match(text, r"\b(?:gender|sex)\s*[:\-]\s*(male|female|other|m|f)\b")
        hemoglobin = self._number(text, r"\b(?:hb|hemoglobin)\s*[:\-]?\s*(\d+(?:\.\d+)?)")
        glucose = self._number(text, r"\b(?:glucose|blood sugar|fbs|rbs)\s*[:\-]?\s*(\d+(?:\.\d+)?)")
        bp = self._match(text, r"\b(?:bp|blood pressure)\s*[:\-]?\s*(\d{2,3}\s*/\s*\d{2,3})")
        cholesterol_value = self._number(text, r"\b(?:cholesterol|ldl)\s*[:\-]?\s*(\d+(?:\.\d+)?)")

        report_type = self._classify_report(text)
        risk_flags: list[str] = []
        if hemoglobin is not None and hemoglobin < 12:
            risk_flags.append("Possible Anemia")
        if glucose is not None and glucose >= 126:
            risk_flags.append("High Glucose")
        if cholesterol_value is not None and cholesterol_value >= 200:
            risk_flags.append("High Cholesterol")
        if bp and self._is_high_bp(bp):
            risk_flags.append("Elevated Blood Pressure")

        medications = sorted(
            set(re.findall(r"\b(?:Rx\s+)?(?:Tab(?:let)?|Cap(?:sule)?)\.?\s+([A-Za-z][A-Za-z0-9 -]{2,40})", text))
        )
        recommendation = "Consult physician" if risk_flags else "No urgent risk flags detected; review with clinician."

        return StructuredReport(
            patient_name=self._title(patient_name) or "Unknown Patient",
            age=int(age_value) if age_value else None,
            gender=self._normalize_gender(gender),
            report_type=report_type,
            hemoglobin=hemoglobin,
            glucose=glucose,
            cholesterol=self._cholesterol_status(cholesterol_value),
            blood_pressure=bp.replace(" ", "") if bp else None,
            medications=medications,
            risk_flags=risk_flags,
            recommendation=recommendation,
        )

    def _classify_report(self, text: str) -> str:
        lowered = text.lower()
        if any(term in lowered for term in ["ecg", "electrocardiogram", "sinus rhythm"]):
            return "ECG Report"
        if any(term in lowered for term in ["rx", "tablet", "capsule", "prescription"]):
            return "Prescription"
        return "Blood Report"

    def _match(self, text: str, pattern: str) -> str | None:
        match = re.search(pattern, text, re.IGNORECASE)
        return match.group(1).strip() if match else None

    def _number(self, text: str, pattern: str) -> float | None:
        value = self._match(text, pattern)
        return float(value) if value else None

    def _title(self, value: str | None) -> str | None:
        return " ".join(part.capitalize() for part in value.split()) if value else None

    def _normalize_gender(self, value: str | None) -> str | None:
        if not value:
            return None
        lowered = value.lower()
        if lowered in {"m", "male"}:
            return "Male"
        if lowered in {"f", "female"}:
            return "Female"
        return "Other"

    def _cholesterol_status(self, value: float | None) -> str | None:
        if value is None:
            return None
        return "High" if value >= 200 else "Normal"

    def _is_high_bp(self, value: str) -> bool:
        systolic, diastolic = [int(part.strip()) for part in value.split("/")]
        return systolic >= 140 or diastolic >= 90
