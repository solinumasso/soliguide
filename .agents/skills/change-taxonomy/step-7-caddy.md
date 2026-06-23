# Step 7 — Generate Caddy redirects and documentation

Run these two commands after **all DSL edits** (step 1) are complete:

```bash
yarn workspace @soliguide/taxonomy generate:caddy
yarn workspace @soliguide/taxonomy generate:md
```

---

## What gets generated

**`generate:caddy`** → `packages/frontend/caddy/category-redirects.caddy`

Reads `categories.dsl.yaml` and emits Caddy `map` rules for every history entry that has an `until` date.
Format:
```
~^(.*/search/.*)/({old_slug})(/.*)?$ "${2}" "${1}/{current_slug}${3}"
```

**`generate:md`** → `packages/taxonomy/src/generated/categories.md`

Produces a documentation table of all categories: countries, creation dates, current slugs, migration history.

---

## Retrocompatibility rules

| DSL entry | Caddy behavior |
|---|---|
| History entry with `until` | Redirect from old slug → current `slug` |
| History entry with only `from` (no `until`) | No redirect (this is the current active slug) |
| `slug` === old history slug | Self-redirect skipped automatically (no infinite loop) |
| Category removed from DSL entirely | No redirect — old URLs return 404 |

**Rule:** only add `until` when there is a valid redirect target. If a category is deleted with no replacement, remove the entry entirely and accept the 404.

---

## Validation

The `generate:caddy` script validates the DSL before generating.
If it fails with `Unknown categories found`, the enum (step 2) is out of sync with the DSL — rebuild common first.
