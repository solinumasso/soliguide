# Step 4 — Category descriptions (`CATEGORIES_DESCRIPTION.const.ts`)

File: `packages/common/src/categories/constants/CATEGORIES_DESCRIPTION.const.ts`

This file is a `Record<Categories, string>` — it must contain **every** value in the `Categories` enum.
A missing key will cause a TypeScript build error (caught in step 2's rebuild).

---

## Adding a category

Append near the end of the object (before the closing `}`):

```ts
  [Categories.NEW_CATEGORY]: "Description or empty string",
```

If the user provided a description in step 0, use it. Otherwise use `""`.

---

## Removing a category

Delete the corresponding line:
```ts
  [Categories.OLD_CATEGORY]: "...",   // ← delete this
```

---

## Migrating (rename)

Update the key to the new enum value. Update the description if relevant.

---

## Validation

Run the build to confirm no exhaustiveness errors remain:
```bash
yarn build --scope @soliguide/common
```

The build must pass before continuing to step 5.
