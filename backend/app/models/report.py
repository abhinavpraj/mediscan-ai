from dataclasses import dataclass
from datetime import datetime
from typing import Any


@dataclass(frozen=True)
class Report:
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
    clinical_summary: list[str] | None = None
    recommendations: list[str] | None = None
    parameters: list[dict[str, Any]] | None = None
    abnormal_parameters: list[dict[str, Any]] | None = None
    processed_at: datetime | None = None
