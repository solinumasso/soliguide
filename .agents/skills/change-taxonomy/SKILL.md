---
name: change-taxonomy
description: Guides through a Soliguide taxonomy change — adding, removing, or migrating categories. Handles all 3 scenarios and orchestrates the full sequence of files to touch. Use when the user wants to add a new category, remove an existing one, or migrate/rename categories.
---

# Change Taxonomy

This skill orchestrates taxonomy changes across the Soliguide monorepo.
A taxonomy change can be one or a combination of three types:

- **Add** — one or more new categories
- **Remove** — retire one or more existing categories
- **Migrate** — replace old categories with new ones (implies data migration + redirects)

## How to use this skill

Execute the sub-skills below **in order**. Each step is independent — mark it done before moving to the next.
Some steps are conditional (only for migrations, or only when icons are needed).

---

## Execution order

| # | Sub-skill file | Required for |
|---|---|---|
| 0 | [step-0-identify.md](step-0-identify.md) | Always — collect all info before touching any file |
| 1 | [step-1-dsl-yaml.md](step-1-dsl-yaml.md) | Always — source of truth for slugs and history |
| 2 | [step-2-enum.md](step-2-enum.md) | Always — enum must stay in sync with DSL |
| 3 | [step-3-graph.md](step-3-graph.md) | Always — wires the category into the UI tree |
| 4 | [step-4-description.md](step-4-description.md) | Always — `Record<Categories, string>` must be exhaustive |
| 5 | [step-5-icons.md](step-5-icons.md) | Add / Migrate — new slug needs SVG icons |
| 6 | [step-6-weblate.md](step-6-weblate.md) | Add / Migrate — new slug needs translation keys |
| 7 | [step-7-caddy.md](step-7-caddy.md) | Always — regenerate redirect rules and docs |
| 8 | [step-8-search-suggestions.md](step-8-search-suggestions.md) | Add / Migrate — generate DB entries for autocomplete |
| 9 | [step-9-data-migration.md](step-9-data-migration.md) | Migrate only — requalify existing place services in MongoDB |

---

## Key files reference

| File | Role |
|---|---|
| `packages/taxonomy/scripts/caddy/categories.dsl.yaml` | Source of truth — slug history, countries, dates |
| `packages/common/src/categories/enums/Categories.enum.ts` | TypeScript enum |
| `packages/common/src/categories/constants/CATEGORIES.const.ts` | DAG graph per country theme |
| `packages/common/src/categories/constants/CATEGORIES_DESCRIPTION.const.ts` | Description per category |
| `packages/taxonomy/icons/svg/` | SVG source icons |
| `packages/frontend/caddy/category-redirects.caddy` | Generated Caddy redirects (do not edit manually) |
| `packages/api/migrations/` | MongoDB migration scripts |

---

## After all steps

Run a final build to catch any missed type errors:
```bash
yarn build --scope @soliguide/common
```

Then open a PR with all changes. Remind the user to pull the Weblate commit once translation keys are created.
