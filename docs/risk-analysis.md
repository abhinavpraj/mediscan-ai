# Risk Analysis

| Risk | Impact | Mitigation |
| --- | --- | --- |
| OCR quality varies by scan | Missed values | Preserve raw text and show extracted JSON for review |
| Local model unavailable | Reduced extraction nuance | Deterministic extractor remains active |
| Misinterpreted clinical values | Patient safety risk | Label outputs as decision support and require clinician review |
| Weak local password | Unauthorized access | Require production password and JWT secret override |
| Large PDFs are slow on CPU | Poor UX | Process page text first and OCR only image-only pages |
