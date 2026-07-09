import sqlite3
from collections.abc import Iterator
from contextlib import contextmanager

from app.core.config import settings

SCHEMA = """
CREATE TABLE IF NOT EXISTS reports (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_name TEXT NOT NULL,
    age INTEGER,
    gender TEXT,
    report_type TEXT NOT NULL,
    raw_text TEXT NOT NULL,
    structured_json TEXT NOT NULL,
    source_filename TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    overall_risk TEXT,
    clinical_summary TEXT,
    recommendations TEXT,
    parameters TEXT,
    abnormal_parameters TEXT,
    processed_at TEXT
);
CREATE INDEX IF NOT EXISTS idx_reports_patient_name ON reports(patient_name);
CREATE INDEX IF NOT EXISTS idx_reports_type ON reports(report_type);
"""


def initialize_database() -> None:
    settings.database_path.parent.mkdir(parents=True, exist_ok=True)
    settings.upload_dir.mkdir(parents=True, exist_ok=True)
    with sqlite3.connect(settings.database_path) as connection:
        connection.executescript(SCHEMA)
        # Migrate existing databases to add columns if they are missing
        new_cols = [
            ("overall_risk", "TEXT"),
            ("clinical_summary", "TEXT"),
            ("recommendations", "TEXT"),
            ("parameters", "TEXT"),
            ("abnormal_parameters", "TEXT"),
            ("processed_at", "TEXT"),
        ]
        for name, col_type in new_cols:
            try:
                connection.execute(f"ALTER TABLE reports ADD COLUMN {name} {col_type}")
            except sqlite3.OperationalError:
                # Column already exists
                pass


@contextmanager
def get_connection() -> Iterator[sqlite3.Connection]:
    initialize_database()
    connection = sqlite3.connect(settings.database_path)
    connection.row_factory = sqlite3.Row
    try:
        yield connection
        connection.commit()
    finally:
        connection.close()
