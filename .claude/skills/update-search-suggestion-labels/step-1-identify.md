# Step 1 — Identify the scope

## Inputs needed

Ask the user (or derive from context):
1. **Category ID** — e.g. `regularization` (snake_case, matches `categoryId` in JSON files)
2. **Country or countries** — which `data/` subdirectories to update: `fr`, `es`, `ad`

## Find all affected language files

Run for each country (example for `es`):

```bash
for f in packages/common/src/search-suggestions/data/es/*.json; do
  lang=$(basename "$f" .json)
  echo "=== $lang ==="
  grep -n '"categoryId": "regularization"' "$f" || echo "(not found)"
done
```

Note which languages have an entry for this category — only those need updating.

## Collect the new label for each language

For each language that has an entry, read the current translation from:

```
packages/common/src/translations/locales/{lang}.json
```

Key format: `CAT_{CATEGORY_ID_UPPERCASE}` — e.g. `CAT_REGULARIZATION`

```bash
grep "CAT_REGULARIZATION" packages/common/src/translations/locales/*.json
```

Build a mapping: `lang → new label value`.

> If a locale file does not have the key yet (Weblate not synced), stop and ask the user to wait for the Weblate PR to be merged first.
