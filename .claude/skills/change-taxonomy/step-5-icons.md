# Step 5 — Icons

Directory: `packages/taxonomy/icons/svg/`

Each category needs **two** SVG files named after its slug:
- `{slug}.svg` — filled version
- `{slug}_outlined.svg` — outlined version

---

## Adding icons

Ask the user to add the two SVG files in `packages/taxonomy/icons/svg/`.
Wait for confirmation before running the pipeline.

Once confirmed, run:
```bash
yarn workspace @soliguide/taxonomy icons-full-process
```

This single command:
1. Cleans and validates all SVG filenames
2. Generates PNG files from SVGs
3. Generates icon fonts (SVG, TTF, WOFF, WOFF2, SCSS)
4. Copies PNGs to `packages/api/resources/auto-export/pictos/`
5. Copies fonts to `packages/frontend/src/assets/fonts/icons/`
6. Copies fonts to `packages/web-app/src/assets/fonts/icons/`

Check the output summary — it must show `✗ Missing: 0` under `CATEGORY COVERAGE`.

---

## Removing icons

Delete the two SVG files:
```bash
rm packages/taxonomy/icons/svg/{slug}.svg
rm packages/taxonomy/icons/svg/{slug}_outlined.svg
```

Then regenerate:
```bash
yarn workspace @soliguide/taxonomy icons-full-process
```

---

## Migrating (slug rename)

If the slug changed, the SVG filenames must also change.
Ask the user to rename the files, or rename them directly:
```bash
mv packages/taxonomy/icons/svg/old_slug.svg packages/taxonomy/icons/svg/new_slug.svg
mv packages/taxonomy/icons/svg/old_slug_outlined.svg packages/taxonomy/icons/svg/new_slug_outlined.svg
```

Then regenerate:
```bash
yarn workspace @soliguide/taxonomy icons-full-process
```

---

## Checklist

- [ ] `{slug}.svg` and `{slug}_outlined.svg` present in `icons/svg/`
- [ ] `icons-full-process` completed with `✗ Missing: 0`
