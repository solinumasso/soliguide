# Step 2 — Categories enum (`Categories.enum.ts`)

File: `packages/common/src/categories/enums/Categories.enum.ts`

---

## Adding a value

Append at the **end** of the enum (before the closing `}`):

```ts
  NEW_CATEGORY = "new_category",
```

Convention: enum key is `UPPER_SNAKE_CASE`, value is the slug in `lower_snake_case`.

## Removing a value

Delete the line. Then search for all usages across the codebase and remove or update them:
```bash
grep -r "Categories\.OLD_CATEGORY" packages/ --include="*.ts" -l
```

## After any edit — rebuild common

```bash
yarn build --scope @soliguide/common
```

The build will fail with TypeScript errors if any `Record<Categories, ...>` is missing the new key.
Fix every error reported before continuing — the most common ones are in:
- `packages/common/src/categories/constants/CATEGORIES_DESCRIPTION.const.ts` (step 4)
- Any other exhaustive map over `Categories`

Run the build again after each fix until it passes cleanly.

---

## Checklist

- [ ] Enum value added / removed
- [ ] `yarn build --scope @soliguide/common` passes with no errors
