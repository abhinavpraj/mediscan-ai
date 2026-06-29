# 🏥 MediScan AI

> **Offline-First, CPU-Optimized AI for Medical Report Structuring**

![License](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)
![Python](https://img.shields.io/badge/Python-3.11+-green.svg)
![React](https://img.shields.io/badge/React-19-blue.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-Latest-success.svg)
![SQLite](https://img.shields.io/badge/Database-SQLite-lightgrey.svg)
![Offline](https://img.shields.io/badge/Works-Offline-brightgreen.svg)
![CPU](https://img.shields.io/badge/CPU-Optimized-orange.svg)

---

# 📖 Overview

MediScan AI is an **offline-first medical document intelligence system** that converts unstructured medical reports into structured healthcare records using **CPU-optimized AI models**.

The application processes **blood reports, prescriptions, and ECG reports** entirely on the user's device without requiring an internet connection or cloud-based APIs.

Designed for **rural hospitals, clinics, diagnostic centers, and medical camps**, MediScan AI enables healthcare professionals to digitize patient records while preserving privacy and ensuring reliable offline operation.

---

# ❗ Problem Statement

Medical reports are often shared as scanned PDFs or images.

Healthcare professionals spend valuable time manually reading reports and entering patient data into digital systems.

Most AI-powered medical document solutions require cloud services, making them unsuitable for locations with unreliable internet connectivity.

There is a need for an offline AI solution capable of automatically extracting structured medical information while maintaining complete patient privacy.

---

# 💡 Solution

MediScan AI uses:

- **Tesseract OCR** for text extraction
- **CPU-optimized Small Language Models (SLMs)** running locally via **llama.cpp**
- **SQLite** for local storage

The application converts medical reports into structured JSON that can be searched, analyzed, and stored locally.

No internet connection is required.

---

# ✨ Features

- 📄 Upload Blood Reports
- 💊 Upload Prescriptions
- ❤️ Upload ECG Reports
- 🔍 Offline OCR Processing
- 🤖 Local AI Medical Information Extraction
- 📊 Automatic JSON Generation
- 💾 SQLite Local Database
- 🔎 Search Patient Records
- 🔒 Privacy-First Design
- ⚡ CPU-Only Inference
- 🌐 Fully Offline Operation

---

# 🧠 AI Workflow

```
Medical Report
(Image / PDF)

        │

        ▼

Tesseract OCR

        │

        ▼

Text Cleaning & Normalization

        │

        ▼

Local Small Language Model
(Phi-3 Mini / Qwen2.5)

        │

        ▼

Medical Entity Extraction

        │

        ▼

Structured JSON

        │

        ▼

SQLite Database

        │

        ▼

Offline Search Dashboard
```

---

# 🏗️ Tech Stack

| Component | Technology |
|------------|------------|
| Frontend | React + TypeScript + Vite |
| Backend | FastAPI(Python) |
| Database | SQLite |
| OCR | Tesseract OCR |
| AI Runtime | llama.cpp |
| Language Model | Qwen2.5-3B-Instruct GGUF |
| AI Inference Runtime | llama.cpp (CPU-only) |
| PDF Processing | PyMuPDF |
| Image Processing | OpenCV |
| Containerization | Docker |

---

# 📁 Project Structure

```
mediscan-ai/
│
├── backend/
│   ├── app/
│   ├── database/
│   ├── models/
│   ├── services/
│   └── main.py
│
├── frontend/
│   ├── src/
│   ├── pages/
│   ├── components/
│   └── assets/
│
├── docs/
├── models/
├── sample_reports/
│
├── README.md
├── LICENSE
├── CONTRIBUTING.md
├── CHANGELOG.md
└── .gitlab-ci.yml
```

---

# 📊 Example Output

```json
{
  "patient_name": "John Doe",
  "age": 45,
  "gender": "Male",
  "report_type": "Blood Report",
  "hemoglobin": {
    "value": 11.2,
    "unit": "g/dL",
    "status": "Low"
  },
  "glucose": {
    "value": 105,
    "status": "Normal"
  },
  "cholesterol": {
    "ldl": 165,
    "hdl": 36,
    "status": "High"
  },
  "blood_pressure": "140/90",
  "risk_flags": [
    "Possible Anemia",
    "High Cholesterol"
  ],
  "recommendation": "Consult a physician for further evaluation."
}
```

---

# 🎯 Hackathon Requirements

✅ CPU-First AI

- Runs entirely on CPU
- No GPU or CUDA required

✅ Offline-First

- No internet connection required
- No cloud inference
- No external AI APIs

✅ Local AI Processing

- OCR runs locally
- AI inference runs locally
- Patient data never leaves the device

✅ Structured Data Extraction

Converts unstructured medical documents into structured JSON.

---

# 🚀 Getting Started

## Clone Repository

```bash
git clone https://code.swecha.org/venika_2537/mediscan-ai

cd mediscan-ai
```

---

## Running the Application

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

- Backend: `http://localhost:8000`
- Frontend: `http://localhost:5173`

---

## Default Local Login

The demo uses local password authentication only.

- **Username:** `admin`
- **Password:** `mediscan-local`

Change these with `MEDISCAN_ADMIN_USERNAME` and `MEDISCAN_ADMIN_PASSWORD`.

---

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

---

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

---

# 👥 Team

| Name | Role |
|------|------|
| Venika Popuri | Member |
| Abhinav Prajapati | Member |

---

# 📜 License

This project is licensed under the **GNU Affero General Public License v3.0 (AGPL-3.0)**.

---

## ⭐ Built for the CPU-First Hackathon

**"Making Medical AI Accessible Anywhere — Even Without the Internet."**
