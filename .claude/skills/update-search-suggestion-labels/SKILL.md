---
name: update-search-suggestion-labels
description: Updates the label field in search-suggestion JSON files to match the latest CAT_* translation key. Use when a category's translation has changed (via Weblate or manually) and the search suggestion labels need to be kept in sync.
---

# Update Search Suggestion Labels

When a `CAT_*` translation key is updated in `packages/common/src/translations/locales/*.json`, the `label` field in the corresponding search suggestion JSON files must be updated to match.

Labels live in:
```
packages/common/src/search-suggestions/data/{country}/{lang}.json
```

Each entry looks like:
```json
{
  "label": "Regularización extraordinaria",
  "categoryId": "regularization",
  "slug": "regularization",
  "synonyms": [...],
  "type": "CATEGORY",
  "lang": "es",
  "country": "es",
  "seoTitle": "...",
  "seoDescription": "..."
}
```

The `label` must equal the value of the `CAT_<categoryId>` key in the locale file for the same language.

---

## Execution steps

Follow [step-1-identify.md](step-1-identify.md) then [step-2-update.md](step-2-update.md).
