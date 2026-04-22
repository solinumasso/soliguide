# 📚 @soliguide/taxonomy

Central package for managing Soliguide's **category taxonomy**: icons, fonts, Caddy redirect rules, and documentation generation.

> Formerly `@soliguide/icons-generator` — renamed to better reflect its expanded scope.

---

## 📁 Structure

```
packages/taxonomy/
├── 🎨 icons/
│   ├── svg/                  # Source SVG icons (one per category)
│   └── png/                  # Generated PNG icons (filled + outlined)
├── 🔤 fonts/                 # Generated icon font files (.woff, .woff2, .scss, etc.)
├── 📄 generated/
│   └── categories.md         # Auto-generated categories documentation table
├── 📜 scripts/
│   ├── icons-generator/      # Icon font + PNG generation
│   │   ├── index.ts          # Main generation script
│   │   ├── check-icons.ts    # Validates each category has an icon
│   │   └── svg-cleaner.ts    # Cleans SVG filenames
│   └── caddy/                # Caddy redirect rules generation
│       ├── categories.dsl.yaml   # 🧠 Source of truth (category DSL)
│       ├── generate-caddy.ts     # Generates Caddy redirect config
│       ├── generate-md.ts        # Generates categories.md doc
│       └── dsl/                  # DSL loader & Zod schema
└── package.json
```

---

## 🚀 Quick start

```bash
# Install dependencies
yarn install

# Generate everything (icons + fonts + copy to projects)
yarn workspace @soliguide/taxonomy icons-full-process
```

---

## 🛠️ Available scripts

### 🎨 Icons & fonts

| Script                 | Command                                                 | Description                                                                             |
| ---------------------- | ------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| **generate-icons**     | `yarn workspace @soliguide/taxonomy generate-icons`     | 🔄 Generates icon fonts (.woff, .woff2, .scss…) and PNG files from SVGs in `icons/svg/` |
| **check-icons**        | `yarn workspace @soliguide/taxonomy check-icons`        | ✅ Checks that every category in `@soliguide/common` has a matching SVG icon            |
| **icons-full-process** | `yarn workspace @soliguide/taxonomy icons-full-process` | 🏗️ Full pipeline: generate icons + copy to all target projects                          |

### 📋 Copy assets to other packages

| Script                     | Command                                                     | Description                                                                           |
| -------------------------- | ----------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| **copy-png-to-api**        | `yarn workspace @soliguide/taxonomy copy-png-to-api`        | 📦 Copies PNG icons to `packages/api/resources/auto-export/pictos/`                   |
| **copy-fonts-to-frontend** | `yarn workspace @soliguide/taxonomy copy-fonts-to-frontend` | 📦 Copies fonts (.woff, .woff2, .scss) to `packages/frontend/src/assets/fonts/icons/` |
| **copy-fonts-to-webapp**   | `yarn workspace @soliguide/taxonomy copy-fonts-to-webapp`   | 📦 Copies fonts (.woff, .woff2) to `packages/web-app/src/assets/fonts/icons/`         |
| **copy-all**               | `yarn workspace @soliguide/taxonomy copy-all`               | 📦 Runs all three copy commands above                                                 |

### 🔀 Caddy redirects & documentation

| Script             | Command                                             | Description                                                                                          |
| ------------------ | --------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| **generate:caddy** | `yarn workspace @soliguide/taxonomy generate:caddy` | 🔀 Generates Caddy redirect rules from `categories.dsl.yaml` → outputs to `packages/frontend/caddy/` |
| **generate:md**    | `yarn workspace @soliguide/taxonomy generate:md`    | 📝 Generates `generated/categories.md` documentation from `categories.dsl.yaml`                      |

### 🧪 Quality

| Script         | Command                                         | Description                                     |
| -------------- | ----------------------------------------------- | ----------------------------------------------- |
| **test**       | `yarn workspace @soliguide/taxonomy test`       | 🧪 Runs tests (Vitest)                          |
| **test:watch** | `yarn workspace @soliguide/taxonomy test:watch` | 👀 Runs tests in watch mode                     |
| **lint**       | `yarn workspace @soliguide/taxonomy lint`       | 🔍 Type-checks with TypeScript (`tsc --noEmit`) |

---

## 🔄 Typical workflows

### ➕ Adding a new category icon

1. Add your SVG file in `icons/svg/` named after the category slug (e.g. `my_category.svg`)
2. Add an outlined version: `my_category_outlined.svg`
3. Run the full pipeline:
   ```bash
   yarn workspace @soliguide/taxonomy icons-full-process
   ```
4. Verify the generated fonts and PNGs in `fonts/` and `icons/png/`

### ✏️ Updating category slugs or redirects

1. Edit `scripts/caddy/categories.dsl.yaml` — this is the **single source of truth** for category metadata
2. Generate the updated Caddy config and documentation:
   ```bash
   yarn workspace @soliguide/taxonomy generate:caddy
   yarn workspace @soliguide/taxonomy generate:md
   ```
3. The Caddy redirect file is output to `packages/frontend/caddy/category-redirects.caddy`

### 🔍 Checking icon coverage

```bash
yarn workspace @soliguide/taxonomy check-icons
```

This will report any category from `@soliguide/common` that is missing an SVG icon.

---

## 📖 Categories DSL

The file `scripts/caddy/categories.dsl.yaml` defines all categories with:

- **slug**: current URL slug
- **countries**: where the category is active (`FR`, `ES`, `AD`)
- **createdAt**: creation date
- **history**: slug history with `from`/`until` dates (used for redirect generation)

See the generated documentation: [`generated/categories.md`](./generated/categories.md)
