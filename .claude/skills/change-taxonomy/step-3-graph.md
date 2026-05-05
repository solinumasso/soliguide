# Step 3 — Categories graph (`CATEGORIES.const.ts`)

File: `packages/common/src/categories/constants/CATEGORIES.const.ts`

This file defines the DAG (Directed Acyclic Graph) that drives the UI category tree.
Four graph constants exist — choose the right one based on the category's countries.

---

## Graph constants

| Constant | When to use |
|---|---|
| `CATEGORIES_GRAPH` | Category available in FR + ES + AD (base, shared by all themes) |
| `CATEGORIES_GRAPH_SOLIGUIDE_FR` | FR only |
| `CATEGORIES_GRAPH_SOLIGUIA_ES` | ES only |
| `CATEGORIES_GRAPH_SOLIGUIA_AD` | AD only |

If a category is ES + AD but not FR, add it to **both** `CATEGORIES_GRAPH_SOLIGUIA_ES` and `CATEGORIES_GRAPH_SOLIGUIA_AD`.

Theme-specific graphs are **merged on top of** `CATEGORIES_GRAPH` at runtime — they only need to list what differs from the base.

---

## Adding a category

Find the parent category's entry in the correct graph and add a child:

```ts
[Categories.COUNSELING]: [{ id: Categories.REGULARIZATION, rank: 850 }],
```

If the parent already has children in that graph, append to the array:
```ts
[Categories.COUNSELING]: [
  { id: Categories.EXISTING_CHILD, rank: 100 },
  { id: Categories.NEW_CATEGORY, rank: 850 },   // ← add here
],
```

Ranks are integers in multiples of 100. Leave gaps between existing ranks to allow future insertions without renumbering.

If the new category **is itself a parent** (has children), also add its own entry:
```ts
[Categories.NEW_CATEGORY]: [
  { id: Categories.CHILD_A, rank: 100 },
  { id: Categories.CHILD_B, rank: 200 },
],
```

**Multi-parental categories** (a child appearing under multiple parents) are valid — just add the same `{ id: Categories.X }` entry under each parent. Add a comment noting the multi-parental relationship:
```ts
{ id: Categories.CHILD_A, rank: 300 }, // multi-parental: also under PARENT_B
```

---

## Removing a category

Remove the `{ id: Categories.OLD_CATEGORY, ... }` line from every parent array where it appears.

If the category was itself a parent, also remove its own key from the graph object.

Search for all occurrences:
```bash
grep -n "Categories\.OLD_CATEGORY" packages/common/src/categories/constants/CATEGORIES.const.ts
```

---

## Migrating a category

Remove the old entry, add the new one in the appropriate graph(s) under the correct parent.
