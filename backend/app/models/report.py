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
