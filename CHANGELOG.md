# Changelog

## 1.0.0 - 2026-07-09

- **Clinical Risk Assessment & Abnormality Detection**:
  - Implemented Clinical Risk Engine to deterministically classify parameters (Hemoglobin, Glucose, Cholesterol, Blood Pressure) and compute overall risk severity.
  - Implemented Clinical Summary Generator to write natural-language medical insights (using local GGUF model if active, otherwise programmatic).
  - Enhanced React dashboard with stats cards (Processed, Patients, High Risk, Critical) and Risk Distribution pie chart.
  - Updated React report viewer to highlight values with colored status indicators (🟢, 🟡, 🟠, 🔴) and present dedicated Clinical Summary cards.
- **Offline-First Medical Extraction**:
  - Integrated local Tesseract OCR for text extraction.
  - Built local SLM/LLM inference pipeline using `llama.cpp` and Qwen2.5/Phi-3 models.
  - Implemented SQLite local database storage and offline patient search.
  - Set up pre-commit hooks, Docker containers, pytest validation, and linting pipeline.

