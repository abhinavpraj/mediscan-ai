from datetime import datetime
from typing import Any

from pydantic import BaseModel, Field


class StructuredReport(BaseModel):
    patient_name: str = "Unknown Patient"
    age: int | None = Field(default=None, ge=0, le=130)
    gender: str | None = None
    report_type: str
    hemoglobin: float | None = None
    glucose: float | None = None
    cholesterol: str | None = None
    blood_pressure: str | None = None
    medications: list[str] = []
    risk_flags: list[str] = []
    recommendation: str


class ReportResponse(BaseModel):
    id: int
    patient_name: str
    age: int | None
    gender: str | None
    report_type: str
    raw_text: str
    structured_json: dict[str, Any]
    source_filename: str
    created_at: datetime
    overall_risk: str | None = None
    clinical_summary: list[str] = []
    recommendations: list[str] = []
    parameters: list[dict[str, Any]] = []
    abnormal_parameters: list[dict[str, Any]] = []
    processed_at: datetime | None = None


class ReportListResponse(BaseModel):
    reports: list[ReportResponse]
