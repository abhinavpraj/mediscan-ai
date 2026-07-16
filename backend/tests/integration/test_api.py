from pathlib import Path

from fastapi.testclient import TestClient

from app.core.config import settings
from app.main import app


def test_text_ingest_round_trip(tmp_path: Path) -> None:
    settings.database_path = tmp_path / "test.sqlite3"
    client = TestClient(app)

    response = client.post(
        "/api/reports/text",
        json={"text": "Patient: Asha Rao\nAge: 38\nGender: Female\nHemoglobin: 13.1", "source_filename": "sample.txt"},
    )

    assert response.status_code == 200
    assert response.json()["patient_name"] == "Asha Rao"

    list_response = client.get("/api/reports")
    assert list_response.status_code == 200
    assert len(list_response.json()["reports"]) == 1
