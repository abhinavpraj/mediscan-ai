# Specification

## Goal

Build an offline CPU-first application that transforms unstructured medical documents into structured JSON and stores results locally.

## Inputs

- Blood reports
- Prescriptions
- ECG reports
- PDF, JPG, PNG

## Output

Structured JSON persisted in SQLite with report history and search.

## Acceptance Criteria

- Runs without internet after dependencies and model assets are installed.
- Does not call OpenAI, Anthropic, Google AI, or any cloud inference API.
- Supports CPU-only OCR and extraction.
- Stores data locally.
- Provides upload, dashboard, history, search, JSON viewer, report viewer, settings through configuration, and responsive UI.
