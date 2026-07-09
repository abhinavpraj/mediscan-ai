from datetime import UTC, datetime
from pathlib import Path

from fastapi import UploadFile

from app.core.config import settings
from app.models.report import Report
from app.repositories.report_repository import ReportRepository
from app.schemas.report import StructuredReport
from app.services.clinical_summary import ClinicalSummaryGenerator
from app.services.extractor import MedicalExtractor
from app.services.llm import LocalLLMExtractor
from app.services.ocr import OCRService
from app.services.report_parser import MedicalReportParser
from app.services.risk_engine import ClinicalRiskEngine
from app.services.text_cleaner import TextCleaner


class ReportService:
    allowed_suffixes = {".pdf", ".jpg", ".jpeg", ".png"}

    def __init__(self) -> None:
        self.repository = ReportRepository()
        self.ocr = OCRService()
        self.cleaner = TextCleaner()
        self.extractor = MedicalExtractor()
        self.llm = LocalLLMExtractor()
        self.parser = MedicalReportParser()
        self.risk_engine = ClinicalRiskEngine()
        self.summary_generator = ClinicalSummaryGenerator()

    async def process_upload(self, file: UploadFile) -> Report:
        suffix = Path(file.filename or "").suffix.lower()
        if suffix not in self.allowed_suffixes:
            raise ValueError("Only PDF, JPG, JPEG, and PNG files are supported")
        destination = settings.upload_dir / Path(file.filename or "report").name
        settings.upload_dir.mkdir(parents=True, exist_ok=True)
        destination.write_bytes(await file.read())
        raw_text = self.cleaner.clean(self.ocr.extract_text(destination))
        structured = self._extract(raw_text)

        # Clinical Risk Engine and Summary
        parsed_vals = self.parser.parse(raw_text)
        evaluation = self.risk_engine.evaluate_all(
            parsed_vals["hemoglobin"], parsed_vals["glucose"], parsed_vals["cholesterol"], parsed_vals["blood_pressure"]
        )
        summary_data = self.summary_generator.generate(evaluation, raw_text)

        # Merge results into structured_json
        structured_dict = structured.model_dump()
        structured_dict.update(
            {
                "overall_risk": summary_data["overall_risk"],
                "clinical_summary": summary_data["clinical_summary"],
                "recommendations": summary_data["recommendations"],
                "parameters": evaluation["parameters"],
                "abnormal_parameters": evaluation["abnormal_parameters"],
            }
        )

        return self.repository.create(
            patient_name=structured.patient_name,
            age=structured.age,
            gender=structured.gender,
            report_type=structured.report_type,
            raw_text=raw_text,
            structured_json=structured_dict,
            source_filename=destination.name,
            overall_risk=summary_data["overall_risk"],
            clinical_summary=summary_data["clinical_summary"],
            recommendations=summary_data["recommendations"],
            parameters=evaluation["parameters"],
            abnormal_parameters=evaluation["abnormal_parameters"],
            processed_at=datetime.now(UTC),
        )

    def process_text(self, text: str, source_filename: str = "manual.txt") -> Report:
        raw_text = self.cleaner.clean(text)
        structured = self._extract(raw_text)

        # Clinical Risk Engine and Summary
        parsed_vals = self.parser.parse(raw_text)
        evaluation = self.risk_engine.evaluate_all(
            parsed_vals["hemoglobin"], parsed_vals["glucose"], parsed_vals["cholesterol"], parsed_vals["blood_pressure"]
        )
        summary_data = self.summary_generator.generate(evaluation, raw_text)

        # Merge results into structured_json
        structured_dict = structured.model_dump()
        structured_dict.update(
            {
                "overall_risk": summary_data["overall_risk"],
                "clinical_summary": summary_data["clinical_summary"],
                "recommendations": summary_data["recommendations"],
                "parameters": evaluation["parameters"],
                "abnormal_parameters": evaluation["abnormal_parameters"],
            }
        )

        return self.repository.create(
            patient_name=structured.patient_name,
            age=structured.age,
            gender=structured.gender,
            report_type=structured.report_type,
            raw_text=raw_text,
            structured_json=structured_dict,
            source_filename=source_filename,
            overall_risk=summary_data["overall_risk"],
            clinical_summary=summary_data["clinical_summary"],
            recommendations=summary_data["recommendations"],
            parameters=evaluation["parameters"],
            abnormal_parameters=evaluation["abnormal_parameters"],
            processed_at=datetime.now(UTC),
        )

    def _extract(self, text: str) -> StructuredReport:
        deterministic = self.extractor.extract(text)
        llm_json = self.llm.extract_json(text)
        if not llm_json:
            return deterministic
        merged = deterministic.model_dump()
        merged.update({key: value for key, value in llm_json.items() if value not in (None, "", [])})
        return StructuredReport.model_validate(merged)
