# Contributing

Thank you for improving MediScan AI.

## Development Setup

1. Install Python 3.11, Node 22, Tesseract OCR, and Docker.
2. Run `pip install -r backend/requirements.txt`.
3. Run `cd frontend && npm install`.
4. Install hooks with `pre-commit install`.

## Quality Bar

Every change must pass:

```bash
black --check backend
isort --check-only backend
ruff check backend
mypy backend/app
pytest backend/tests
cd frontend && npm run lint && npm run typecheck && npm run build
```

## Pull Requests

- Keep changes focused.
- Include tests for backend services and API behavior.
- Update docs when changing architecture, schema, API, or setup.
- Do not introduce cloud inference, telemetry, or external AI APIs.
