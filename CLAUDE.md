<!--
Soliguide: Useful information for those who need it

SPDX-FileCopyrightText: © 2024 Solinum

SPDX-License-Identifier: AGPL-3.0-only

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published
by the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
-->

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Soliguide is a social impact platform that references all services, initiatives and resources for people in need. It's a monorepo managed by Lerna 8 and Nx 19, using Yarn 4 workspaces.

**License**: AGPL-3.0-only with REUSE compliance required for all files.

## Common Commands

### Development Setup

```bash
# Install dependencies
yarn install --refresh-lockfile

# Start MongoDB (required for API)
docker compose up -d

# Import test database
./packages/api/db.sh restore -t

# Build shared dependencies (required before starting apps)
yarn build --scope @soliguide/common-angular

# Start API in watch mode
yarn workspace @soliguide/api watch

# Start frontend (French version, opens browser)
yarn workspace @soliguide/frontend start

# Start frontend for other locales
yarn workspace @soliguide/frontend start:es  # Spanish
yarn workspace @soliguide/frontend start:ad  # Andorran
```

### Testing

```bash
# Run all tests across packages
yarn test

# Run tests for specific package
yarn workspace @soliguide/api test
yarn workspace @soliguide/frontend test
yarn workspace @soliguide/web-app test

# API tests use test database
# Set: MONGODB_URI=mongodb://127.0.0.1:27017/soliguide_test?replicaSet=rs0
```

### Building

```bash
# Build all packages
yarn build

# Build specific package
yarn build --scope @soliguide/api
yarn build --scope @soliguide/common-angular

# Build and analyze frontend bundle
yarn workspace @soliguide/frontend analyze
```

### Linting & Formatting

```bash
# Lint all packages
yarn lint

# Format all packages
yarn format:fix

# Package-specific lint
yarn workspace @soliguide/api lint:fix
```

### Database Migrations

```bash
# Create new migration (from packages/api/)
yarn workspace @soliguide/api migrate-create migration-name

# Run migrations (TS mode for dev)
yarn workspace @soliguide/api migrate-up

# Run migrations (JS mode like production)
yarn workspace @soliguide/api build-and-migrate-up

# Check migration status
yarn workspace @soliguide/api migrate-status

# After creating migration, update test database dump
./packages/api/db.sh dump -t
```

## Architecture

### Monorepo Structure

```
packages/
├── api/              - Express REST API (MongoDB, Typesense)
├── location-api/     - NestJS location microservice (Redis)
├── soligare/         - NestJS duplicate detection service (PostgreSQL)
├── frontend/         - Angular 17 admin interface
├── widget/           - Angular 17 embeddable widget
├── web-app/          - SvelteKit public interface (SSR)
├── design-system/    - Svelte component library with Storybook
├── common/           - Shared TypeScript types and utilities (dual build: CJS + ESM)
└── common-angular/   - Shared Angular services
```

### Dependency Graph

```
common (base types & utilities)
    ↓
    ├── common-angular → frontend, widget
    ├── design-system → web-app
    └── api, location-api, soligare
```

**Critical**: Always build `@soliguide/common` before building packages that depend on it. Use `yarn build --scope @soliguide/common-angular` which automatically builds common first via Nx dependency graph.

### Key Technologies

- **API**: Express, MongoDB (Mongoose), Typesense, RabbitMQ, Airtable sync, S3, Redis caching
- **Location API**: NestJS, Fastify, Redis
- **Soligare**: NestJS, PostgreSQL
- **Frontend/Widget**: Angular 17, Bootstrap 5, Leaflet, Algolia, ngx-translate
- **Web-app**: SvelteKit, i18next, Playwright E2E, Vitest
- **Design System**: Svelte 4, Storybook, SASS

### Database Architecture

- **MongoDB 7.0** (main): Places, Users, Organizations, with replica set
- **Migrations**: TypeScript migrations in `packages/api/migrations/` using migrate-mongo
- **Test DB**: `soliguide_test` with dump in `data/soliguide_db_test.gzip`
- **PostgreSQL**: Soligare duplicate detection only
- **Redis**: Location API caching layer
- **Typesense 27.1**: Search engine for places

### Multi-Language Support

- **Locales**: French (default), Spanish, Andorran
- **Translation files**: JSON in `packages/common/src/translations/locales/`
- **Frameworks**:
  - API: i18next with fs-backend
  - Frontend/Widget: ngx-translate
  - Web-app: i18next
- **External**: Weblate for translation management (auto-creates PRs)

### External Integrations

- **Airtable**: Two-way sync for place data (collaborative editing)
- **S3/MinIO**: Document and image storage
- **Typesense**: Full-text search for places
- **Google Cloud Translate**: Translation services
- **Mailgun**: Email delivery
- **Sentry**: Error tracking across all apps
- **PostHog**: Product analytics
- **RabbitMQ**: Message queuing for async tasks

## Development Workflow

### Git Workflow (from CONTRIBUTING.md)

- **Main branch**: `main` (but you're currently on `develop`)
- **Feature branches**: `type-name` format where type is: `bug`, `feat`, `tech`, `data`, `hotfix`, `test`
- **Commits**: Must follow [Conventional Commits](https://www.conventionalcommits.org/)
  - Types: `build`, `ci`, `docs`, `feat`, `fix`, `perf`, `refactor`, `style`, `test`
  - Scope: Optional package name (e.g., `api`, `frontend`)
  - Format: `type(scope): description`
- **Merging**: Rebase feature branches from destination before merging. NEVER rebase main.
- **PRs**: Always required, link to GitHub issue, status to "To Review"

### Commit Message Examples

```
feat(api): add search filtering by opening hours
fix(frontend): resolve map marker clustering issue
refactor(common): extract phone validation to utility
test(location-api): add tests for geocoding service
```

### Pre-commit Hooks

- Husky + lint-staged runs on every commit
- Prettier formatting
- ESLint with auto-fix
- Commitlint validates commit message format

### Environments

- **Local**: Dev environment with Docker Compose
- **Staging**: Clever Cloud staging (`*.staging.soliguide.dev`)
- **Demo**: Qovery test environment (`*.demo.soliguide.dev`) - deployed from develop branch
- **Production**: Clever Cloud prod (`soliguide.fr`, `soliguia.es`, `soliguia.cat`, `soliguia.ad`)

#### Accessing PR Environment URLs

After deployment, environment URLs are available in the PR via **GitHub Deployments** (not public comments):
- Go to your PR
- Scroll to the "Deployments" section
- Click on the environment to see all URLs

## Important Development Notes

### Build Order

Due to package dependencies, always build in this order:

1. `@soliguide/common` (builds both CJS and ESM)
2. `@soliguide/common-angular` (depends on common)
3. Other packages (api, frontend, widget, web-app)

Nx handles this automatically when using `yarn build`.

### Common Module Dual Build

`@soliguide/common` builds twice:

- **CommonJS** (`dist/cjs/`) for Node.js backend (api, location-api, soligare)
- **ESM** (`dist/esm/`) for frontend (frontend, widget, web-app)

Both are defined in `package.json` exports field.

### Translation Files

Translation files from `@soliguide/common` are copied during build:

- API: Copies to `packages/api/resources/locales/`
- Frontend: Copies to `packages/frontend/src/assets/locales/`

This happens in prebuild/postbuild scripts. If translations are missing, rebuild common first.

### Environment Variables

Each package has its own `.env` file:

- API: `packages/api/.env` (copy from `.env.example`)
- Location API: `packages/location-api/.env`
- Frontend: Uses `src/environments/` files

Root `.env.example` is for Docker builds only.

### Testing Database

API tests require MongoDB test database:

- Start MongoDB: `docker compose up -d`
- Restore test data: `./packages/api/db.sh restore -t`
- Connection: `mongodb://127.0.0.1:27017/soliguide_test?replicaSet=rs0`

### Running Single Test

```bash
# API (Jest)
yarn workspace @soliguide/api test -- path/to/test.spec.ts

# Frontend (Jest)
yarn workspace @soliguide/frontend test -- path/to/test.spec.ts

# Web-app (Vitest)
yarn workspace @soliguide/web-app test -- path/to/test.spec.ts
```

### Docker Development

Full local stack with Docker Compose includes:

- MongoDB 7.0 (replica set)
- Typesense 27.1
- Redis
- RabbitMQ
- All can be started with: `docker compose up -d`

### PDF Export Feature

Requires LibreOffice installed locally:

- macOS: `brew install --cask libreoffice`
- Linux: `apt-get install libreoffice`
- Used by `libreoffice-convert` package in API

Also requires Lato fonts: https://www.latofonts.com/

### Code Quality Tools

- **Linting**: ESLint with TypeScript support
- **Formatting**: Prettier (2-space indent, no semicolons in some packages)
- **Type Checking**: TypeScript strict mode
- **Bundle Analysis**: `yarn workspace @soliguide/frontend analyze`

### Semantic Versioning

- Lerna handles versioning automatically
- Based on conventional commit messages
- Breaking changes (with `!` or `BREAKING CHANGE`) bump major
- `feat:` commits bump minor
- `fix:` and others bump patch
- Tags: `vA.b.c` format

### Node Version

Required: Node.js 22+ (specified in package.json engines)

## Package-Specific Notes

### API (@soliguide/api)

- **Architecture**: Express with routes → controllers → services → models (Mongoose)
- **Key directories**:
  - `src/routes/`: API endpoints
  - `src/controllers/`: Request handlers
  - `src/services/`: Business logic
  - `src/models/`: Mongoose schemas
  - `src/middlewares/`: Auth, logging, error handling
  - `src/jobs/`: Cron jobs (using Bree)
  - `migrations/`: Database migrations
- **Dev mode**: `yarn workspace @soliguide/api watch` (uses nodemon + pino-pretty)
- **Production**: Build transpiles TS to JS, migrations run from dist/

### Frontend (@soliguide/frontend)

- **Architecture**: Angular 17 with modular structure, lazy loading
- **Key directories**:
  - `src/app/modules/`: Feature modules
  - `src/app/services/`: Shared services
  - `src/app/guards/`: Route guards (auth)
  - `src/app/interceptors/`: HTTP interceptors (JWT, error)
  - `src/app/models/`: TypeScript interfaces
  - `src/environments/`: Environment configs per locale
- **Configurations**: Multiple environments in angular.json for FR/ES/AD
- **Dev server**: Port 4200 (FR), different ports for ES/AD

### Location API (@soliguide/location-api)

- **Architecture**: NestJS modular with dependency injection
- **Purpose**: Geocoding, address search, transport info, holiday calculations
- **Redis**: Used for caching with decorators
- **Swagger**: API docs at `/api`

### Web-app (@soliguide/web-app)

- **Architecture**: SvelteKit with file-based routing
- **Key directories**:
  - `src/routes/`: SvelteKit pages and layouts
  - `src/lib/`: Reusable components and utilities
- **SSR**: Server-side rendering enabled
- **Tests**: Playwright for E2E, Vitest for unit

### Design System (@soliguide/design-system)

- **Storybook**: Run with `yarn workspace @soliguide/design-system storybook`
- **Components**: Reusable Svelte components with i18next support
- **Build**: Outputs library consumable by web-app

### Common (@soliguide/common)

- **Purpose**: Single source of truth for types, constants, utilities
- **Key exports**:
  - Type definitions (Place, User, Organization, etc.)
  - Validation functions
  - Date utilities
  - Translation keys
  - Phone number utilities
- **Adding types**: Add to appropriate domain folder, export from index.ts
- **After changes**: Rebuild all dependent packages
