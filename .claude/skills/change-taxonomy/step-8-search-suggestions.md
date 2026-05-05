# Step 8 — Search suggestions

Search suggestions are `SearchSuggestion` documents stored in MongoDB.
They power the autocomplete and are generated per `(category, lang, country)` combination.

This step requires the Claude API (Anthropic) to generate multilingual content.

---

## Prerequisites

Check that `ANTHROPIC_API_KEY` is set in `packages/api/.env`.
If not, ask the developer to add it before continuing.

---

## Adding suggestions for new categories

Create a migration:
```bash
yarn workspace @soliguide/api migrate-create generate-search-suggestions-{slug}
```

The migration must:
1. Insert one `SearchSuggestion` per `(category, lang, country)` combination
2. Use the Claude API to generate `label`, `seoTitle`, `seoDescription`, `synonyms` in each supported language
3. Set `sourceId` as `CATEGORY_{SLUG_UPPERCASE}` (e.g. `CATEGORY_REGULARIZATION`)
4. Set `type: "CATEGORY"`
5. Set `slug` to the category slug
6. Set `categoryId` to the `Categories` enum value

Reference for Claude API integration pattern:
`packages/api/migrations/templates/xxxxxx-claude-verify-search-suggestions-language.ts`

The `down` function should delete the inserted documents:
```ts
await db.collection("search_suggestions").deleteMany({ sourceId: "CATEGORY_NEW_SLUG" });
```

---

## Removing suggestions for deleted categories

Create a migration:
```bash
yarn workspace @soliguide/api migrate-create remove-search-suggestions-{slug}
```

```ts
export const up = async (db: Db) => {
  await db.collection("search_suggestions").deleteMany({
    sourceId: "CATEGORY_OLD_SLUG_UPPERCASE",
  });
};

export const down = async () => {
  // Suggestions must be regenerated manually if needed
  logger.info("[ROLLBACK] - No rollback: regenerate suggestions manually");
};
```

---

## Migrating suggestions (slug rename)

Delete old suggestions and generate new ones for the new slug:
- One migration to `deleteMany({ sourceId: "CATEGORY_OLD_SLUG" })`
- One migration (or same) to insert new suggestions for the new `sourceId`

---

## Running migrations

```bash
yarn workspace @soliguide/api migrate-up

# Update test database dump
./packages/api/db.sh dump -t
```
