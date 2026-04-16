# Public API Compatibility E2E

End-to-end parity tests between legacy `@soliguide/api` and new `@soliguide/public-api`.

## Coverage (v1)

- Active:
  - `POST /new-search/:lang?` (legacy) vs `POST /search` (public-api)
- Scaffolded (skipped):
  - `GET /place/:lieu_id/:lang?`

## How it works

- Boots a seeded MongoDB replica set through Testcontainers.
- Restores `data/soliguide_db_test.gzip`.
- Seeds persona users directly in MongoDB.
- Starts legacy API and public-api through CLI execution (`yarn workspace ... ts-node ...`).
- Runs the same request matrix against both APIs and compares responses.

## Run

```bash
yarn workspace @soliguide/public-api-compat-e2e test:e2e
```

Docker (or another supported container runtime) must be available because the suite uses Testcontainers.
