# 🏥 MediScan AI

> **Offline-First, CPU-Optimized AI for Medical Report Structuring & Clinical Risk Analysis**

![License](https://img.shields.io/badge/License-MIT-blue.svg)
![Python](https://img.shields.io/badge/Python-3.11+-green.svg)
![React](https://img.shields.io/badge/React-19-blue.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-Latest-success.svg)
![SQLite](https://img.shields.io/badge/Database-SQLite-lightgrey.svg)
![Offline](https://img.shields.io/badge/Works-Offline-brightgreen.svg)
![CPU](https://img.shields.io/badge/CPU-Optimized-orange.svg)

---

## 📖 Overview

MediScan AI is an **offline-first medical document intelligence system** that converts unstructured medical reports into structured healthcare records and automatically assesses patient clinical risk using **CPU-optimized AI models**.

The application processes **blood reports, prescriptions, and ECG reports** entirely on the user's device without requiring an internet connection or cloud-based APIs.

Designed for **rural hospitals, clinics, diagnostic centers, and medical camps**, MediScan AI enables healthcare professionals to digitize patient records while preserving absolute patient privacy and ensuring reliable offline operations.

---

## 📸 Screenshots

| Dashboard Page | Report Viewer |
|----------------|---------------|
| ![Dashboard Placehoder](https://via.placeholder.com/600x350.png?text=MediScan+AI+Dashboard+Mockup) | ![Report Viewer Placeholder](https://via.placeholder.com/600x350.png?text=MediScan+AI+Report+Viewer+Mockup) |

---

## ✨ Features

- **📄 Document Upload**: Easily upload blood reports, prescriptions, and ECG images/PDFs.
- **🔍 Offline OCR**: Extract raw text locally using Tesseract OCR.
- **🛡️ Clinical Risk Engine**: Automatically evaluate key metrics (Hemoglobin, Glucose, Cholesterol, Blood Pressure) against age/gender-adjusted reference ranges to flag Low, Moderate, High, or Critical statuses.
- **🧠 Clinical Summary Generator**: Generate concise natural-language overviews (max 5 bullet points) and suggested follow-ups (using a local llama.cpp GGUF model if available, otherwise falling back programmatically).
- **💾 Local SQLite Database**: Save and fetch structured history and patient search queries.
- **🔒 Privacy-First Design**: Patient records never leave the local machine.
- **⚡ CPU-Only Inference**: Run advanced SLM (Small Language Models) locally without requiring dedicated GPUs.

---

## 🏗️ Architecture

```
┌─────────────────┐       ┌───────────────┐       ┌────────────────────────┐
│ Medical Report  │ ─────>│ Tesseract OCR │ ─────>│   Text Normalization   │
│  (Image/PDF)    │       └───────────────┘       └────────────────────────┘
└─────────────────┘                                           │
                                                              ▼
┌─────────────────┐       ┌───────────────┐       ┌────────────────────────┐
│ SQLite Database │ <─────│  Risk Engine  │ <─────│ Local Small Lang Model │
│   (Local DB)    │       │  & Summarizer │       │ (llama.cpp / Fallback) │
└─────────────────┘       └───────────────┘       └────────────────────────┘
        │
        ▼
┌─────────────────┐
│ React Dashboard │
└─────────────────┘
```

The pipeline ingests files, converts them to text via OCR, executes a local rule engine alongside local AI model text completion, parses structured properties, writes them to SQLite, and updates the React dashboard with real-time risk distribution metrics.

---

## 🛠️ Tech Stack

| Component | Technology |
|------------|------------|
| Frontend | React + TypeScript + Vite + TailwindCSS |
| Backend | FastAPI (Python 3.11+) |
| Database | SQLite |
| OCR | Tesseract OCR |
| AI Runtime | llama.cpp (CPU-only) |
| Language Model | Qwen2.5-3B-Instruct GGUF / Phi-3 Mini |
| Containerization | Docker |

---

## 📁 Project Structure

```text
mediscan-ai/
│
├── backend/              FastAPI application, database schemas, and AI controllers
│   ├── app/
│   │   ├── api/          FastAPI routers and API endpoints
│   │   ├── core/         System environment and configurations
│   │   ├── db/           SQLite database scripts and schema definitions
│   │   ├── models/       Dataclasses for reports
│   │   ├── repositories/ Data access layers for SQLite
│   │   ├── schemas/      Pydantic request/response validation schemas
│   │   └── services/     OCR, Risk Engine, Summary, and LLM services
│   └── tests/            Unit and integration Pytest cases
│
├── frontend/             React SPA Dashboard and Report Viewer
│   ├── src/
│   │   ├── components/   Shared UI widgets, card components, and layouts
│   │   ├── pages/        Dashboard, History, and Report Viewer pages
│   │   └── types/        TypeScript type definitions
│   └── vercel.json       Routing fallback config for Vercel deployment
│
├── docs/                 API specification, workflow charts, and audit files
├── models/               GGUF AI model target path
├── README.md             Getting started and deployment instructions
├── LICENSE               MIT License
└── docker-compose.yml    Multi-container local deployment configuration
```

---

## ⚙️ Environment Variables

Copy `.env.example` in the root folder to configure local environments:

| Variable | Description | Default |
|----------|-------------|---------|
| `MEDISCAN_APP_NAME` | Display name of the application | `MediScan AI` |
| `MEDISCAN_DATABASE_PATH` | Path to SQLite db file | `backend/database/mediscan.sqlite3` |
| `MEDISCAN_UPLOAD_DIR` | Directory for uploaded report uploads | `backend/database/uploads` |
| `MEDISCAN_MODEL_PATH` | Path to GGUF model file | `models/phi-3-mini.gguf` |
| `MEDISCAN_JWT_SECRET` | Secret key for JWT session tokens | `change-this-local-secret` |
| `MEDISCAN_ADMIN_USERNAME` | Login username | `admin` |
| `MEDISCAN_ADMIN_PASSWORD` | Login password | `mediscan-local` |
| `MEDISCAN_CORS_ORIGINS` | Allowed CORS endpoints (comma-separated) | `http://localhost:5173` |
| `VITE_API_BASE` | Frontend API base connection URL | `http://localhost:8000/api` |

---

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/abhinavpraj/mediscan-ai.git
cd mediscan-ai
```

### 2. Run Locally (Development)

#### Backend Setup
```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```
*The FastAPI swagger docs will be available at `http://localhost:8000/docs`.*

#### Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```
*Open `http://localhost:5173` in your browser.*

### 3. Run with Docker
```bash
docker compose up --build
```
- Backend API: `http://localhost:8000`
- Frontend Dashboard: `http://localhost:5173`

---

## ☁️ Deployment Guide

### Backend: Render (Docker Container Web Service)
Since Tesseract OCR requires system packages, deploying the backend as a Docker Container is recommended.
1. Sign in to [Render](https://render.com) and create a **New Web Service**.
2. Connect your GitHub repository.
3. Choose the **Docker** runtime environment.
4. Add the following Environment Variables in the Render Dashboard:
   - `MEDISCAN_JWT_SECRET`: (Secure random key)
   - `MEDISCAN_CORS_ORIGINS`: `https://your-frontend-vercel-url.vercel.app`
   - `MEDISCAN_ADMIN_PASSWORD`: (Production login password)
5. Deploy. Render will automatically build the `Dockerfile` and expose the API.

### Frontend: Vercel
Vercel is ideal for static React assets.
1. Sign in to [Vercel](https://vercel.com) and click **Add New Project**.
2. Import the `mediscan-ai` repository.
3. Configure the directory settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
4. Add the Environment Variable:
   - `VITE_API_BASE`: `https://your-backend-render-url.onrender.com/api`
5. Click **Deploy**. Vercel will build the frontend assets and host them with SPA routing configured by [vercel.json](file:///Users/abhinavprajapati/Swecha/mediscan-ai/frontend/vercel.json).

---

## 🔮 Future Improvements

- [ ] **Multi-Language OCR**: Support OCR parsing for Telugu, Hindi, and regional languages.
- [ ] **PDF Export**: Generate structured, printable PDF summary cards for patients to carry.
- [ ] **Interactive Chat**: Let medical practitioners ask questions about report history.
- [ ] **Offline PWA support**: Install the dashboard as a progressive web app on smartphones.

---

## 👥 Team Members

- **Venika Popuri** - Venika Popuri
- **Abhinav Prajapati** - Abhinav Prajapati

---

## 📜 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.
