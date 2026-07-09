from typing import Any


class ClinicalRiskEngine:
    def evaluate_hemoglobin(self, value: float | None) -> dict[str, Any] | None:
        if value is None:
            return None
        unit = "g/dL"
        ref = "12.0-17.5"
        if value < 8.0:
            return {
                "name": "Hemoglobin",
                "value": value,
                "unit": unit,
                "reference_range": ref,
                "status": "Critical",
                "severity": "High",
                "risk_reason": "Severe anemia detected",
            }
        elif value < 12.0:
            return {
                "name": "Hemoglobin",
                "value": value,
                "unit": unit,
                "reference_range": ref,
                "status": "Low",
                "severity": "Moderate",
                "risk_reason": "Possible anemia",
            }
        elif value > 17.5:
            return {
                "name": "Hemoglobin",
                "value": value,
                "unit": unit,
                "reference_range": ref,
                "status": "High",
                "severity": "Moderate",
                "risk_reason": "Possible erythrocytosis",
            }
        else:
            return {
                "name": "Hemoglobin",
                "value": value,
                "unit": unit,
                "reference_range": ref,
                "status": "Normal",
                "severity": "Low",
                "risk_reason": "Normal hemoglobin levels",
            }

    def evaluate_glucose(self, value: float | None) -> dict[str, Any] | None:
        if value is None:
            return None
        unit = "mg/dL"
        ref = "70-99"
        if value < 70.0:
            return {
                "name": "Glucose",
                "value": value,
                "unit": unit,
                "reference_range": ref,
                "status": "Low",
                "severity": "High",
                "risk_reason": "Hypoglycemia detected",
            }
        elif value <= 99.0:
            return {
                "name": "Glucose",
                "value": value,
                "unit": unit,
                "reference_range": ref,
                "status": "Normal",
                "severity": "Low",
                "risk_reason": "Normal fasting glucose levels",
            }
        elif value <= 125.0:
            return {
                "name": "Glucose",
                "value": value,
                "unit": unit,
                "reference_range": ref,
                "status": "High",
                "severity": "Moderate",
                "risk_reason": "Impaired fasting glucose (prediabetes)",
            }
        else:
            return {
                "name": "Glucose",
                "value": value,
                "unit": unit,
                "reference_range": ref,
                "status": "Critical",
                "severity": "High",
                "risk_reason": "Possible hyperglycemia/diabetes threshold met",
            }

    def evaluate_cholesterol(self, value: float | None) -> dict[str, Any] | None:
        if value is None:
            return None
        unit = "mg/dL"
        ref = "0-199"
        if value < 200:
            return {
                "name": "Cholesterol",
                "value": value,
                "unit": unit,
                "reference_range": ref,
                "status": "Normal",
                "severity": "Low",
                "risk_reason": "Desirable cholesterol levels",
            }
        elif value < 240:
            return {
                "name": "Cholesterol",
                "value": value,
                "unit": unit,
                "reference_range": ref,
                "status": "High",
                "severity": "Moderate",
                "risk_reason": "Borderline high cholesterol",
            }
        else:
            return {
                "name": "Cholesterol",
                "value": value,
                "unit": unit,
                "reference_range": ref,
                "status": "Critical",
                "severity": "High",
                "risk_reason": "High cholesterol detected",
            }

    def evaluate_blood_pressure(self, value: str | None) -> dict[str, Any] | None:
        if not value:
            return None
        unit = "mmHg"
        ref = "120/80"
        try:
            parts = value.split("/")
            systolic = int(parts[0].strip())
            diastolic = int(parts[1].strip())
        except Exception:
            return None

        if systolic >= 140 or diastolic >= 90:
            return {
                "name": "Blood Pressure",
                "value": value,
                "unit": unit,
                "reference_range": ref,
                "status": "Critical",
                "severity": "High",
                "risk_reason": "Hypertension (high blood pressure) detected",
            }
        elif systolic >= 120 or diastolic >= 80:
            return {
                "name": "Blood Pressure",
                "value": value,
                "unit": unit,
                "reference_range": ref,
                "status": "High",
                "severity": "Moderate",
                "risk_reason": "Elevated blood pressure (prehypertension)",
            }
        else:
            return {
                "name": "Blood Pressure",
                "value": value,
                "unit": unit,
                "reference_range": ref,
                "status": "Normal",
                "severity": "Low",
                "risk_reason": "Normal blood pressure levels",
            }

    def evaluate_all(
        self, hb: float | None, glucose: float | None, cholesterol: float | None, bp: str | None
    ) -> dict[str, Any]:
        parameters = []
        for evaluator, val in [
            (self.evaluate_hemoglobin, hb),
            (self.evaluate_glucose, glucose),
            (self.evaluate_cholesterol, cholesterol),
            (self.evaluate_blood_pressure, bp),
        ]:
            res = evaluator(val)  # type: ignore
            if res:
                parameters.append(res)

        abnormal_parameters = [p for p in parameters if p["status"] != "Normal"]

        statuses = [p["status"] for p in abnormal_parameters]
        if "Critical" in statuses:
            overall_risk = "Critical"
        elif "High" in statuses:
            overall_risk = "High"
        elif "Low" in statuses:
            overall_risk = "Moderate"
        else:
            overall_risk = "Low"

        confidence = 0.95 if abnormal_parameters else 0.99

        return {
            "parameters": parameters,
            "abnormal_parameters": abnormal_parameters,
            "overall_risk": overall_risk,
            "confidence": confidence,
        }
