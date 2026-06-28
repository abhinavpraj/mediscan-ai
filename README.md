# MediScan AI

Offline-first, CPU-optimized AI for medical report structuring.

MediScan AI converts scanned medical reports into structured JSON and stores the result in a local SQLite database. It is designed for clinics and diagnostic centers that need private, reliable document processing without cloud inference.

## What It Does

- Upload PDF, JPG, or PNG medical documents.
- Run OCR locally with Tesseract and PyMuPDF.
- Clean noisy OCR text.
- Extract medical entities into structured records.
- Optionally use a local GGUF small language model through llama.cpp.
- Store reports in SQLite.
- Search and review extracted records in a responsive React dashboard.

## Offline Guarantee

The application does not call cloud AI APIs. All OCR, extraction, inference, storage, and UI features run locally on CPU. A local model can be placed at `models/phi-3-mini.gguf` or configured with `MEDISCAN_MODEL_PATH`.

## Quick Start

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`.

### Docker

```bash
docker compose up --build
```

Backend: `http://localhost:8000`  
Frontend: `http://localhost:5173`

## Default Local Login

The demo uses local password authentication only.

- Username: `admin`
- Password: `mediscan-local`

Change these with `MEDISCAN_ADMIN_USERNAME` and `MEDISCAN_ADMIN_PASSWORD`.

## Repository Layout

```text
backend/              FastAPI application, OCR, extraction, SQLite
frontend/             React, TypeScript, Vite, Tailwind dashboard
docs/                 Architecture, API, database, workflow, audit docs
models/               Local GGUF model directory
sample_reports/       Offline sample report text
sample_outputs/       Example structured JSON
scripts/              CI helper scripts
```

## Validation

```bash
cd backend
pytest
ruff check .
black --check .
mypy app

cd ../frontend
npm run lint
npm run typecheck
npm run build
```

## License

GNU Affero General Public License v3.0. See [LICENSE](LICENSE).
