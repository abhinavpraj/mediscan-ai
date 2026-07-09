import logging
from typing import Any
from app.services.llm import LocalLLMExtractor

logger = logging.getLogger(__name__)


class ClinicalSummaryGenerator:
    def __init__(self) -> None:
        self.llm = LocalLLMExtractor()

    def generate(self, evaluation: dict[str, Any], raw_text: str) -> dict[str, Any]:
        abnormal = evaluation["abnormal_parameters"]
        overall_risk = evaluation["overall_risk"]

        # 1. Try generating with local LLM if available
        summary_bullets = None
        if self.llm.is_available():
            summary_bullets = self._generate_with_llm(abnormal)

        # 2. Fall back to deterministic summary
        if not summary_bullets:
            summary_bullets = self._generate_deterministic(abnormal)

        # 3. Generate follow-up recommendations
        recommendations = self._generate_recommendations(abnormal)

        return {
            "overall_risk": overall_risk,
            "clinical_summary": summary_bullets[:5],
            "recommendations": recommendations,
        }

    def _generate_with_llm(self, abnormal: list[dict[str, Any]]) -> list[str] | None:
        if not abnormal:
            return ["All evaluated parameters are within normal reference ranges."]

        results_str = ", ".join([f"{p['name']}: {p['value']} ({p['status']})" for p in abnormal])
        prompt = (
            "You are a medical assistant summarizing clinical lab results.\n"
            f"Generate a concise clinical summary as 2-4 short bullet points for these abnormal findings: {results_str}.\n"
            "Format the output strictly as a list of bullet points, one per line. Do not include any greeting or conversational text.\n"
            "Summary:"
        )

        try:
            # Reusing the local LLM client logic
            from llama_cpp import Llama
            llm = Llama(model_path=str(self.llm.model_path), n_ctx=2048, n_threads=4, verbose=False)
            output = llm(prompt, max_tokens=256, temperature=0.1, stop=["\n\n"])
            text = output["choices"][0]["text"].strip()  # type: ignore
            bullets = [
                line.lstrip("-*• ").strip()
                for line in text.split("\n")
                if line.strip()
            ]
            return [b for b in bullets if b]
        except Exception as exc:
            logger.warning(f"Failed to generate summary with local LLM: {exc}")
            return None

    def _generate_deterministic(self, abnormal: list[dict[str, Any]]) -> list[str]:
        if not abnormal:
            return [
                "All evaluated laboratory parameters are within normal reference ranges.",
                "No urgent clinical risk flags detected.",
            ]

        bullets = []
        for param in abnormal:
            name = param["name"]
            status = param["status"]
            val = param["value"]

            if name == "Hemoglobin":
                if status == "Critical":
                    bullets.append("Critical low hemoglobin level detected, indicating severe anemia.")
                elif status == "Low":
                    bullets.append(f"Mild to moderate anemia detected (Hemoglobin: {val} g/dL).")
                elif status == "High":
                    bullets.append(f"Elevated hemoglobin levels observed (Hemoglobin: {val} g/dL).")
            elif name == "Glucose":
                if status == "Critical":
                    bullets.append(f"Critical high fasting blood glucose levels detected (Glucose: {val} mg/dL).")
                elif status == "High":
                    bullets.append(f"Elevated blood glucose level in the prediabetic range (Glucose: {val} mg/dL).")
                elif status == "Low":
                    bullets.append(f"Low blood glucose level detected (Glucose: {val} mg/dL).")
            elif name == "Cholesterol":
                if status == "Critical":
                    bullets.append(f"High total cholesterol level detected (Cholesterol: {val} mg/dL).")
                elif status == "High":
                    bullets.append(f"Borderline high cholesterol level detected (Cholesterol: {val} mg/dL).")
            elif name == "Blood Pressure":
                if status == "Critical":
                    bullets.append(f"Hypertensive range blood pressure readings detected (BP: {val} mmHg).")
                elif status == "High":
                    bullets.append(f"Elevated/prehypertensive range blood pressure readings detected (BP: {val} mmHg).")

        bullets.append("Recommend physician review for comprehensive clinical diagnosis.")
        return bullets

    def _generate_recommendations(self, abnormal: list[dict[str, Any]]) -> list[str]:
        if not abnormal:
            return ["Routine health checkup as scheduled."]

        recs = ["Consult physician for diagnostic evaluation and review."]
        names = {p["name"] for p in abnormal}

        if "Hemoglobin" in names:
            recs.append("Consider Complete Blood Count (CBC) follow-up in 2-4 weeks.")
        if "Glucose" in names:
            recs.append("Monitor fasting blood glucose levels regularly.")
            recs.append("Consider diagnostic HbA1c testing.")
        if "Cholesterol" in names:
            recs.append("Review dietary lipid intake and consider a fasting lipid panel check.")
        if "Blood Pressure" in names:
            recs.append("Monitor blood pressure daily.")
            recs.append("Consider sodium intake reduction and lifestyle review.")

        return recs
