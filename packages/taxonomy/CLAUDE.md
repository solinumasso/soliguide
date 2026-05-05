# Taxonomy Package

## Purpose

This package tracks the **naming history** of Soliguide service categories. Category names appear in URLs (e.g. `/search/paris/psychiatry`), so when a category is renamed or migrated, old URLs must redirect to the new ones. This package is the single source of truth for those redirections.

## How It Works

### Source of Truth: `categories.dsl.yaml`

The entire package revolves around a YAML DSL file that describes every category and its slug history:

```yaml
TRANSPORTATION_MOBILITY:
  slug: transportation_mobility        # current slug (used in URLs today)
  countries: [FR, ES, AD]
  createdAt: "2025-12-31"
  history:
    - slug: covoiturage                # original French slug
      until: "2023-11-20"
    - slug: carpooling                 # English rename
      from: "2023-11-20"
      until: "2025-12-31"
    - slug: transportation_mobility    # current slug
      from: "2025-12-31"
```

Rules:

- Every key must match a value from the `Categories` enum in `@soliguide/common`
- `slug` is the current URL segment for this category
- `history` tracks all past slugs with `from`/`until` dates
- `countries` lists where this category is available (FR, ES, AD)
- A history entry with `until` = old slug that needs a redirect
- A history entry with `from` (no `until`) = the current active slug

### Validation: Zod Schemas

`src/dsl/schema.ts` defines strict validation with two key safety checks:

1. **Every enum key must be present** in the YAML — prevents forgetting a category
2. **No unknown keys allowed** — prevents typos or stale entries

The loader (`src/dsl/loadCategoriesDsl.ts`) parses the YAML and validates it against these schemas. If validation fails, it logs the exact errors and throws.

### Caddyfile Generation

`src/scripts/generate-caddy.ts` reads the DSL and produces redirect rules for the Caddy web server. The logic:

1. Iterate all categories and their history entries
2. For each entry with `until` (= old slug), create a redirect to the current `slug`
3. Skip self-redirects (old slug === current slug) to avoid infinite loops
4. Output goes to `packages/frontend/caddy/category-redirects.caddy`

Generated format (Caddy map syntax):

```text
map {http.request.orig_uri.path} {category_source} {category_target_path} {
    ~^(.*/search/.*)/(covoiturage)(/.*)?$ "${2}" "${1}/transportation_mobility${3}"
    ~^(.*/search/.*)/(carpooling)(/.*)?$ "${2}" "${1}/transportation_mobility${3}"
}
```

This means: any URL containing `/search/*/covoiturage` or `/search/*/carpooling` redirects to the same path but with `transportation_mobility`.

### Markdown Generation

`src/scripts/generate-md.ts` produces `src/generated/categories.md` — a documentation table of all categories with their countries, creation dates, current slugs, and migration history.

## Commands

```bash
# Run all tests
yarn workspace @soliguide/taxonomy test

# Validate the DSL file against schemas and the Categories enum
yarn workspace @soliguide/taxonomy validate:dsl

# Generate Caddy redirect rules (outputs to packages/frontend/caddy/)
yarn workspace @soliguide/taxonomy generate:caddy

# Generate markdown documentation (outputs to src/generated/categories.md)
yarn workspace @soliguide/taxonomy generate:md
```

## When to Update This Package

### Adding a new category

1. Add the enum value in `@soliguide/common` (`Categories.enum.ts`)
2. Add an entry in `categories.dsl.yaml` with the slug, countries, and an initial history entry with `from` date
3. Run `generate:caddy` and `generate:md`

### Renaming a category slug

1. Add `until` to the current history entry
2. Add a new history entry with the new slug and `from` date
3. Update `slug` to the new value
4. Run `generate:caddy` — this creates the redirect from old slug to new slug
5. Run `generate:md`

### Removing a category (rare)

The category is removed from the `Categories` enum and from the DSL. No redirect is generated — the old URL will 404.

## Architecture

```text
categories.dsl.yaml          <- source of truth (manually edited)
        |
        |-->  schema.ts        <- Zod validation (enum completeness + no unknowns)
        |
        |-->  generate-caddy   <- outputs frontend/caddy/category-redirects.caddy
        |
        '-->  generate-md      <- outputs src/generated/categories.md
```

## Dependencies

- **@soliguide/common**: Provides the `Categories` enum — the DSL must stay in sync with it
- **zod**: Schema validation
- **js-yaml**: YAML parsing
- **vitest**: Test runner

## Key Files

| File | Role |
| ---- | ---- |
| `src/categories.dsl.yaml` | Source of truth for all category slugs and their history |
| `src/dsl/schema.ts` | Zod schemas ensuring DSL and enum consistency |
| `src/dsl/loadCategoriesDsl.ts` | Loads, parses, and validates the YAML |
| `src/scripts/generate-caddy.ts` | Generates Caddy redirect rules from slug history |
| `src/scripts/generate-md.ts` | Generates markdown documentation |

## Taxonomy Change Process

Use the `change-taxonomy` skill (`.claude/skills/change-taxonomy.md`) to modify categories. It handles the 3 files that must stay in sync: the enum, the DAG graph, and the DSL YAML.
