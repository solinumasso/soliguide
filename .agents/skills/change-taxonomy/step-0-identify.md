# Step 0 — Identify the change and collect all information

Run this step **before touching any file**. Its output is the specification the other steps will execute against.

---

## 0.1 — Determine the change type

Ask the user:

> Quel type de changement de taxonomie veux-tu effectuer ?
> 1. **Ajout** — une ou plusieurs nouvelles catégories
> 2. **Suppression** — retirer une ou plusieurs catégories existantes
> 3. **Migration** — remplacer une ou plusieurs catégories par de nouvelles (redirect URL + migration des données en base)
>
> Tu peux combiner plusieurs types dans la même opération (ex: supprimer A, ajouter B, migrer C→D).

---

## 0.2 — Collect per-category information

For each category involved, ask for the following. Collect everything in one go — don't ask field by field.

### For each **new** category (add or migration target)

| Field | Format | Example |
|---|---|---|
| Enum key | `UPPER_SNAKE_CASE` | `REGULARIZATION` |
| Slug (URL segment) | `lower_snake_case` | `regularization` |
| Countries | subset of `[FR, ES, AD]` | `[ES]` |
| Parent category enum key | existing `UPPER_SNAKE_CASE` | `COUNSELING` |
| Country graph | which theme(s) | `CATEGORIES_GRAPH_SOLIGUIA_ES` |
| Rank under parent | integer, multiples of 100 | `850` |
| Creation date | `YYYY-MM-DD` (default: today) | `2026-05-05` |
| Description | free text or empty | `""` |

**Country graph selection:**

| Countries | Graph constant |
|---|---|
| FR + ES + AD (all) | `CATEGORIES_GRAPH` (base) |
| FR only | `CATEGORIES_GRAPH_SOLIGUIDE_FR` |
| ES only | `CATEGORIES_GRAPH_SOLIGUIA_ES` |
| AD only | `CATEGORIES_GRAPH_SOLIGUIA_AD` |
| ES + AD | both `CATEGORIES_GRAPH_SOLIGUIA_ES` and `CATEGORIES_GRAPH_SOLIGUIA_AD` |

### For each **removed** category

| Field | Format |
|---|---|
| Enum key | `UPPER_SNAKE_CASE` |
| Slug | `lower_snake_case` |
| Redirect needed? | Yes (if migrating to another slug) / No (404 is acceptable) |

### For each **migration** (old → new)

In addition to the fields above, ask:

- Old slug(s) → new slug(s) mapping
- Migration strategy:
  - **Simple 1-to-1** — all services with old category get the new category (rename / consolidation)
  - **Smart requalification** — services are split across multiple targets based on keywords in name/description (provide keyword rules and fallback category)

---

## 0.3 — Summarize before proceeding

Before starting step 1, write a concise summary of the planned changes for the user to validate:

```
## Résumé du changement de taxonomie

**Ajouts :**
- REGULARIZATION (regularization) — enfant de COUNSELING — ES uniquement

**Suppressions :**
- (aucune)

**Migrations :**
- (aucune)

**Étapes requises :** 0 ✅ 1 2 3 4 5 6 7 8
```

Wait for the user's confirmation before continuing to step 1.
