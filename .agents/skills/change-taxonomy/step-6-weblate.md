# Step 6 — Weblate translation keys

Translation keys are managed externally on Weblate and auto-merged into the repo via PR.
This step is a **manual action** by the developer — nothing to code here.

---

## What to communicate to the developer

For each **new** category slug, notify the developer:

> **Action manuelle requise — Weblate**
>
> Crée la/les clés de traduction suivantes sur Weblate :
>
> | Clé | Format |
> |---|---|
> | `{ENUM_KEY}` | `UPPER_SNAKE_CASE` |
>
> Exemple : `REGULARIZATION`
>
> Une fois les clés créées et le commit Weblate disponible, récupère-le sur cette branche.
> Les traductions seront ainsi incluses dans la PR et prêtes pour la mise en production.

---

## Key format rule

Translation keys **always** use `UPPER_SNAKE_CASE` — the enum key exactly as written in `Categories.enum.ts`.

Examples:
- `REGULARIZATION` ✅
- `categories.regularization` ❌
- `regularization` ❌

---

## For removals

No action needed on Weblate. Orphaned keys are cleaned up separately by the i18n process.

---

## For migrations

If the old enum key is removed, its translation key becomes orphaned on Weblate.
If the new key has a different name, it needs to be created.
Notify the developer of both the key to create and the key to archive/remove.
