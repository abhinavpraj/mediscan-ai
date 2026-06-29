from typing import Annotated

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pydantic import BaseModel

from app.core.config import settings
from app.core.security import create_access_token, decode_access_token, verify_password
from app.models.report import Report
from app.repositories.report_repository import ReportRepository
from app.schemas.auth import LoginRequest, TokenResponse
from app.schemas.report import ReportListResponse, ReportResponse
from app.services.report_service import ReportService

router = APIRouter()
security = HTTPBearer()


class TextIngestRequest(BaseModel):
    text: str
    source_filename: str = "manual.txt"


AuthCredentials = Annotated[HTTPAuthorizationCredentials, Depends(security)]


def require_user(credentials: AuthCredentials) -> str:
    subject = decode_access_token(credentials.credentials)
    if subject != settings.admin_username:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    return subject


CurrentUser = Annotated[str, Depends(require_user)]
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
    )


@router.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "mode": "offline-cpu"}


@router.post("/auth/login", response_model=TokenResponse)
def login(payload: LoginRequest) -> TokenResponse:
    if payload.username != settings.admin_username or not verify_password(payload.password, settings.admin_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid username or password")
    return TokenResponse(access_token=create_access_token(payload.username))


@router.post("/reports/upload", response_model=ReportResponse)
async def upload_report(file: UploadReportFile, _: CurrentUser) -> ReportResponse:
    try:
        report = await ReportService().process_upload(file)
        return to_response(report)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.post("/reports/text", response_model=ReportResponse)
def ingest_text(payload: TextIngestRequest, _: CurrentUser) -> ReportResponse:
    return to_response(ReportService().process_text(payload.text, payload.source_filename))


@router.get("/reports", response_model=ReportListResponse)
def list_reports(_: CurrentUser, q: str | None = None) -> ReportListResponse:
    reports = [to_response(report) for report in ReportRepository().list(q)]
    return ReportListResponse(reports=reports)


@router.get("/reports/{report_id}", response_model=ReportResponse)
def get_report(report_id: int, _: CurrentUser) -> ReportResponse:
    report = ReportRepository().get(report_id)
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    return to_response(report)


@router.delete("/reports/{report_id}", status_code=204)
def delete_report(report_id: int, _: CurrentUser) -> None:
    if not ReportRepository().delete(report_id):
        raise HTTPException(status_code=404, detail="Report not found")
