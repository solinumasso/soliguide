# Category Management Scripts

## Main Tool: `sync-categories.ts`

Un seul fichier pour gérer toutes les catégories.

### Commandes

#### 1. **sync** - Synchronisation complète

```bash
yarn workspace @soliguide/api categories:sync
```

**Ce que ça fait :**

1. Parcourt toutes les catégories de l'enum `Categories`
2. Crée les entrées manquantes dans les fichiers JSON (tous pays x toutes langues)
3. Trouve toutes les entrées sans `seoTitle` ou `seoDescription`
4. Utilise `translateCategory` (avec les vrais prompts détaillés) pour générer les traductions
5. Exporte les fichiers JSON avec `generateAutocompleteFiles`

**Résultat :**

- Nouvelles catégories créées
- Traductions générées avec Claude (ISO 24495-1:2023)
- Fichiers JSON exportés pour le frontend

#### 2. **analyze** - Analyser l'état actuel

```bash
yarn workspace @soliguide/api categories:analyze
```

**Ce que ça fait :**

- Analyse les fichiers JSON et la taxonomie sans modification
- Affiche les catégories manquantes, obsolètes, et la qualité du contenu

#### 3. **cleanup** - Supprimer les obsolètes

```bash
yarn workspace @soliguide/api categories:cleanup
```

**Ce que ça fait :**

- Supprime les catégories obsolètes des fichiers JSON
- Régénère les fichiers JSON

## Workflow Complet

### Ajouter une nouvelle catégorie

**1. Ajouter dans l'enum**

```typescript
// packages/common/src/categories/enums/Categories.enum.ts
export enum Categories {
  // ... catégories existantes
  MY_NEW_CATEGORY = "my_new_category",
}
```

**2. Synchroniser**

```bash
yarn workspace @soliguide/api categories:sync
```

**C'est tout !**

## Détails Techniques

### La fonction `translateCategory`

Définie dans `categories-translation.ts` :

- Norme ISO 24495-1:2023 (langage clair et simple)
- Phrases courtes (max 22 mots)
- Ton bienveillant, sans jargon
- Exemples concrets par pays
- 15 synonymes pertinents
- SEO optimisé avec "Soliguide"

### Fichiers JSON

Les données vivent dans `packages/common/src/search-suggestions/data/` :

```
packages/common/src/search-suggestions/data/
├── fr/
│   ├── fr.json
│   ├── en.json
│   ├── ar.json
│   └── ...
├── es/
│   ├── es.json
│   ├── ca.json
│   └── ...
└── ad/
    ├── ca.json
    └── ...
```

### Service `SearchSuggestionsService`

Toutes les opérations passent par `searchSuggestionsService` (`search-suggestions.service.ts`) :

- **Runtime** : `initialize()`, `findBySlugAndLang()`, `findBySynonym()`, `findById()` - lecture en mémoire depuis `resources/`
- **Source** : `readSourceFile()`, `writeSourceFile()`, `getAllSourceCategories()`, `addSourceEntry()`, `updateSourceEntry()`, `removeSourceEntries()` - lecture/écriture des JSON dans `common/`

## Configuration

**Variable d'environnement requise :**

- `ANTHROPIC_API_KEY` - Pour la génération avec Claude

**Modèle utilisé :**

- `claude-haiku-4-5-20251001`
- Temperature: 0.3
- Max tokens: 1024
- Rate limit: 1 seconde entre chaque appel

## Fichiers

```
scripts/
├── sync-categories.ts           # CLI principal (sync, cleanup, analyze)
├── categories-translation.ts    # Fonctions de traduction
├── analyze-categories.ts        # Analyse et debug des catégories
├── constants.ts                 # Mapping noms de langues
└── README.md
```

## Exemple complet

```bash
# Tout en une commande
yarn workspace @soliguide/api categories:sync
```

C'est tout !
