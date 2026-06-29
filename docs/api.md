# API

Base path: `/api`

## `GET /health`

Returns service status.

## `POST /auth/login`

Request:

```json
{ "username": "admin", "password": "mediscan-local" }
```

Response:

```json
{ "access_token": "...", "token_type": "bearer" }
```

## `POST /reports/upload`

Bearer-authenticated multipart upload. Field name: `file`. Supported extensions: PDF, JPG, JPEG, PNG.

## `POST /reports/text`

Bearer-authenticated text ingest for offline validation.

```json
{ "text": "Patient: John Doe\nHemoglobin: 11.2", "source_filename": "sample.txt" }
```

## `GET /reports?q=term`

Bearer-authenticated history and search endpoint.

## `GET /reports/{id}`

Bearer-authenticated report detail endpoint.

## `DELETE /reports/{id}`

Bearer-authenticated local deletion endpoint.
