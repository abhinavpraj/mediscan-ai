# AI Workflow

```mermaid
sequenceDiagram
  participant User
  participant UI
  participant API
  participant OCR
  participant Extractor
  participant SQLite
  User->>UI: Upload report
  UI->>API: Multipart file
  API->>OCR: Extract text locally
  OCR->>API: Raw text
  API->>Extractor: Clean and structure
  Extractor->>Extractor: Apply deterministic medical rules
  Extractor->>Extractor: Enrich with local GGUF model when available
  API->>SQLite: Persist JSON
  API->>UI: Structured record
```

## Risk Logic

- Hemoglobin below 12: `Possible Anemia`
- Glucose at or above 126: `High Glucose`
- Cholesterol at or above 200: `High Cholesterol`
- Blood pressure at or above 140/90: `Elevated Blood Pressure`

The recommendation is a triage message and is not a diagnosis.
