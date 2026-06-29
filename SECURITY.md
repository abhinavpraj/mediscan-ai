# Security Policy

## Supported Version

Security fixes are accepted for the latest `main` branch.

## Reporting

Report vulnerabilities privately to the maintainers before public disclosure. Include affected files, reproduction steps, impact, and suggested mitigation when available.

## Security Model

- Patient data is stored locally in SQLite.
- The application does not call cloud inference APIs.
- Authentication is local and intended for single-site deployments.
- Production deployments must override `MEDISCAN_JWT_SECRET` and `MEDISCAN_ADMIN_PASSWORD`.
- Local model files are not committed because GGUF weights are large and license-specific.
