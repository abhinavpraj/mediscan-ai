import json
from datetime import datetime
from typing import Any

from app.db.database import get_connection
from app.models.report import Report


class ReportRepository:
    def create(
        self,
        *,
        patient_name: str,
        age: int | None,
        gender: str | None,
        report_type: str,
        raw_text: str,
        structured_json: dict[str, Any],
        source_filename: str,
    ) -> Report:
        with get_connection() as connection:
            cursor = connection.execute(
                """
                INSERT INTO reports (
                    patient_name, age, gender, report_type, raw_text, structured_json, source_filename
                ) VALUES (?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    patient_name,
                    age,
                    gender,
                    report_type,
                    raw_text,
                    json.dumps(structured_json, sort_keys=True),
                    source_filename,
                ),
            )
            row = connection.execute("SELECT * FROM reports WHERE id = ?", (cursor.lastrowid,)).fetchone()
            return self._to_report(row)

    def list(self, query: str | None = None) -> list[Report]:
        sql = "SELECT * FROM reports"
        params: tuple[str, ...] = ()
        if query:
            sql += " WHERE patient_name LIKE ? OR report_type LIKE ? OR raw_text LIKE ?"
            like = f"%{query}%"
            params = (like, like, like)
        sql += " ORDER BY created_at DESC, id DESC"
        with get_connection() as connection:
            return [self._to_report(row) for row in connection.execute(sql, params).fetchall()]

    def get(self, report_id: int) -> Report | None:
        with get_connection() as connection:
            row = connection.execute("SELECT * FROM reports WHERE id = ?", (report_id,)).fetchone()
            return self._to_report(row) if row else None

    def delete(self, report_id: int) -> bool:
        with get_connection() as connection:
            cursor = connection.execute("DELETE FROM reports WHERE id = ?", (report_id,))
            return cursor.rowcount > 0

    def _to_report(self, row: Any) -> Report:
        return Report(
            id=int(row["id"]),
            patient_name=str(row["patient_name"]),
            age=row["age"],
            gender=row["gender"],
            report_type=str(row["report_type"]),
            raw_text=str(row["raw_text"]),
            structured_json=json.loads(str(row["structured_json"])),
            source_filename=str(row["source_filename"]),
            created_at=datetime.fromisoformat(str(row["created_at"])),
        )
