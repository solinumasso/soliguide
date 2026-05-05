# Step 9 — Data migration (migrations only)

Only required when **existing place services** in MongoDB need their `category` field requalified.
Skip this step for pure additions or removals with no data to reclassify.

---

## Create the migration

```bash
yarn workspace @soliguide/api migrate-create migrate-{old-slug}-to-{new-slug}
```

Migration file location: `packages/api/migrations/`

The migration targets the `lieux` collection, field: `services_all[].category` (string).

---

## Pattern A — Simple 1-to-1 mapping

Use when all services with the old category unambiguously map to one new category (rename or consolidation).

```ts
import { Db } from "mongodb";
import { Categories } from "@soliguide/common";
import { logger } from "../src/general/logger";

const message = "Migrate {old_slug} to {new_slug}";

const categoryMapping: Record<string, Categories> = {
  old_slug: Categories.NEW_CATEGORY,
};

export const up = async (db: Db) => {
  logger.info(`[MIGRATION] - ${message}`);

  for (const [oldCategory, newCategory] of Object.entries(categoryMapping)) {
    const result = await db.collection("lieux").updateMany(
      { "services_all.category": oldCategory },
      { $set: { "services_all.$[elem].category": newCategory } },
      { arrayFilters: [{ "elem.category": oldCategory }] }
    );
    logger.info(
      `Updated ${result.modifiedCount} documents: '${oldCategory}' → '${newCategory}'`
    );
  }
};

export const down = async (db: Db) => {
  logger.info(`[ROLLBACK] - ${message}`);
  // Reverse the mapping
  for (const [oldCategory, newCategory] of Object.entries(categoryMapping)) {
    await db.collection("lieux").updateMany(
      { "services_all.category": newCategory },
      { $set: { "services_all.$[elem].category": oldCategory } },
      { arrayFilters: [{ "elem.category": newCategory }] }
    );
  }
};
```

Reference: `packages/api/migrations/templates/categories/xxxx-convert-old-category-from-mobility.ts`

---

## Pattern B — Smart requalification

Use when one category splits into multiple targets and the right target depends on the service content (name, description keywords).

Ask the user for:
- Keyword rules per target category (regex patterns, priority order)
- Fallback category (for services that match no rule)

Structure:
1. Match rule #1 → assign to category A (most specific)
2. Match rule #2 → assign to category B
3. Remaining → assign to fallback category C

```ts
export const up = async (db: Db) => {
  // 1. Rule-based assignment (most specific first)
  await db.collection("lieux").updateMany(
    {
      services_all: {
        $elemMatch: {
          category: "old_slug",
          description: { $regex: "keyword1|keyword2", $options: "i" },
        },
      },
    },
    [{ $set: { services_all: { $map: { /* conditional map */ } } } }]
  );

  // 2. Fallback — remaining services with old_slug
  await db.collection("lieux").updateMany(
    { "services_all.category": "old_slug" },
    { $set: { "services_all.$[elem].category": Categories.FALLBACK_CATEGORY } },
    { arrayFilters: [{ "elem.category": "old_slug" }] }
  );
};
```

Reference: `packages/api/migrations/20260420122937-migrate-addiction-categorie.ts`

---

## Important: `down` function

- If the migration is reversible (1-to-1), implement a proper rollback.
- If not reversible (split to multiple targets), log a clear message:
  ```ts
  export const down = async () => {
    logger.info("[ROLLBACK] - No rollback possible for split migration");
  };
  ```

---

## Running the migration

```bash
yarn workspace @soliguide/api migrate-up

# Update test database dump after migration
./packages/api/db.sh dump -t
```

Verify the result by checking document counts before/after:
```bash
# Count remaining services with old slug (should be 0)
db.lieux.countDocuments({ "services_all.category": "old_slug" })
```
