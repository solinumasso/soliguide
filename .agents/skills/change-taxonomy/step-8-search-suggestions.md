# Step 8 — Search suggestions

Search suggestions power the autocomplete and are stored as JSON files in `packages/common/src/search-suggestions/data/`.
They are generated per `(category, lang, country)` combination using the Claude API.

The script lives in `packages/api` and operates on the JSON source files in `@soliguide/common`.

---

## Prerequisites

Check that `ANTHROPIC_API_KEY` is set in `packages/api/.env`.
If not, ask the developer to add it before continuing.

---

## Running the sync

A single command handles all three cases (add, remove, migrate):

```bash
yarn workspace @soliguide/api categories:sync
```

The script automatically:
1. Scans the `Categories` enum and the JSON source files to detect missing, obsolete, or untranslated entries
2. Creates missing entries for new categories (per country × language)
3. Translates new entries via the Claude API (`label`, `seoTitle`, `seoDescription`, `synonyms`)
4. Removes obsolete entries for deleted/renamed categories
5. Exports the updated JSON files to `packages/common/src/search-suggestions/data/{country}/{lang}.json`

To preview what will change without applying:
```bash
yarn workspace @soliguide/api categories:analyze
```

To remove only obsolete entries:
```bash
yarn workspace @soliguide/api categories:cleanup
```

---

## Output location

`packages/common/src/search-suggestions/data/`
```
es/ca.json   es/es.json   es/fr.json   es/en.json   es/ar.json   es/uk.json   es/pt.json
fr/fr.json   fr/ar.json   fr/en.json   ...
ad/ca.json   ...
```

The generated files are committed to the repository as part of the PR.
