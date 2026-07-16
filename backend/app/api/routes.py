from typing import Annotated

from fastapi import APIRouter, File, HTTPException, UploadFile
from pydantic import BaseModel

from app.models.report import Report
from app.repositories.report_repository import ReportRepository
from app.schemas.report import ReportListResponse, ReportResponse
from app.services.report_service import ReportService

router = APIRouter()


class TextIngestRequest(BaseModel):
    text: str
    source_filename: str = "manual.txt"


UploadReportFile = Annotated[UploadFile, File(...)]


def to_response(report: Report) -> ReportResponse:
    return ReportResponse(
        id=report.id,
        patient_name=report.patient_name,
        age=report.age,
        gender=report.gender,
        report_type=report.report_type,
        raw_text=report.raw_text,
        structured_json=report.structured_json,
        source_filename=report.source_filename,
        created_at=report.created_at,
        overall_risk=report.overall_risk,
        clinical_summary=report.clinical_summary,
        recommendations=report.recommendations,
        parameters=report.parameters,
        abnormal_parameters=report.abnormal_parameters,
        processed_at=report.processed_at,
    )


@router.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "mode": "offline-cpu"}


@router.post("/reports/upload", response_model=ReportResponse)
async def upload_report(file: UploadReportFile) -> ReportResponse:
    try:
        report = await ReportService().process_upload(file)
        return to_response(report)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.post("/reports/text", response_model=ReportResponse)
def ingest_text(payload: TextIngestRequest) -> ReportResponse:
    return to_response(ReportService().process_text(payload.text, payload.source_filename))


@router.get("/reports", response_model=ReportListResponse)
def list_reports(q: str | None = None) -> ReportListResponse:
    reports = [to_response(report) for report in ReportRepository().list(q)]
    return ReportListResponse(reports=reports)


@router.get("/reports/{report_id}", response_model=ReportResponse)
def get_report(report_id: int) -> ReportResponse:
    report = ReportRepository().get(report_id)
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    return to_response(report)


@router.delete("/reports/{report_id}", status_code=204)
def delete_report(report_id: int) -> None:
    if not ReportRepository().delete(report_id):
        raise HTTPException(status_code=404, detail="Report not found")
