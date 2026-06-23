# Step 1 — DSL YAML (`categories.dsl.yaml`)

File: `packages/taxonomy/scripts/caddy/categories.dsl.yaml`

This is the **single source of truth** for all category slugs and their URL history.
Every change here will later drive Caddy redirect generation (step 7).

---

## Adding a category

Append a new entry. Use today's date for `createdAt` and the first `from`:

```yaml
NEW_CATEGORY:
  slug: new_category
  countries: [FR, ES, AD]
  createdAt: "YYYY-MM-DD"
  history:
    - slug: new_category
      from: "YYYY-MM-DD"
```

If the category is country-restricted, only list those countries:
```yaml
  countries: [ES]
```

---

## Removing a category

**Simple removal (no redirect needed):** delete the entry entirely.
Old URLs will return 404 — this is intentional when there is no equivalent target.

**Removal with redirect (migration):** do not delete — add `until` to the last history entry instead (see Migration below). The entry stays so Caddy can generate the redirect.

---

## Migrating a category (slug rename or replacement)

Keep the old entry and add `until` to its current active history entry.
Update `slug` to the new value and add a new history entry with `from`:

```yaml
OLD_CATEGORY:
  slug: new_slug          # ← updated to the new current slug
  countries: [FR, ES, AD]
  createdAt: "2023-11-20"
  history:
    - slug: old_slug
      from: "2023-11-20"
      until: "YYYY-MM-DD"   # ← date of migration
    - slug: new_slug
      from: "YYYY-MM-DD"    # ← same date
```

If the old enum key is being fully removed (not just renamed), its entry can stay in the DSL **only** to preserve the Caddy redirect. In that case, note it with a comment.

---

## Validation

After editing, validate by running:
```bash
yarn workspace @soliguide/taxonomy generate:caddy
```

If the DSL is invalid (unknown category key, schema error), the script will print the exact error. Fix before continuing.

> The validator checks that every key in the YAML matches a value in `Categories` enum.
> This means step 2 (enum) must be done **before** this validation passes if you added a new key.
> Edit the YAML now, then come back to validate after step 2.
