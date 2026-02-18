# Category Management Scripts

## 🎯 Main Tool: `sync-categories.ts`

Un seul fichier pour gérer toutes les catégories.

### Commandes

#### 1. **sync** - Synchronisation complète

```bash
yarn workspace @soliguide/api categories:sync
```

**Ce que ça fait :**

1. Parcourt toutes les catégories de l'enum `Categories`
2. Crée les entrées manquantes en BDD (tous pays × toutes langues)
3. Trouve toutes les entrées sans `seoTitle` ou `seoDescription`
4. Utilise `translateCategory` (avec les vrais prompts détaillés) pour générer les traductions
5. Exporte les fichiers JSON avec `generateAutocompleteFiles`

**Résultat :**

- Nouvelles catégories créées ✅
- Traductions générées avec Claude (ISO 24495-1:2023) ✅
- Fichiers JSON exportés pour le frontend ✅

#### 2. **clean** - Nettoyer les traductions

```bash
yarn workspace @soliguide/api categories:clean
```

**Ce que ça fait :**

- Vide `seoTitle`, `seoDescription`, `synonyms` pour toutes les catégories
- Utile pour régénérer toutes les traductions from scratch

**Usage typique :**

```bash
# Nettoyer + Régénérer tout
yarn workspace @soliguide/api categories:clean
yarn workspace @soliguide/api categories:sync
```

## 📋 Workflow Complet

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

**3. Créer le dump**

```bash
./packages/api/db.sh dump
```

**C'est tout !** ✅

### Régénérer toutes les traductions

Si vous voulez améliorer les prompts et tout régénérer :

```bash
# 1. Nettoyer
yarn workspace @soliguide/api categories:clean

# 2. Régénérer (utilise les nouveaux prompts)
yarn workspace @soliguide/api categories:sync

# 3. Dump
./packages/api/db.sh dump
```

## 🛠️ Détails Techniques

### La fonction `translateCategory`

Utilise les prompts détaillés de `generate-categories-autocomplete.ts` :

- ✅ Norme ISO 24495-1:2023 (langage clair et simple)
- ✅ Phrases courtes (max 22 mots)
- ✅ Ton bienveillant, sans jargon
- ✅ Exemples concrets par pays
- ✅ 15 synonymes pertinents
- ✅ SEO optimisé avec "Soliguide"

### Structure créée automatiquement

Pour chaque catégorie de l'enum :

```
HEALTH (enum)
  → health-FR-fr (BDD)
  → health-FR-en (BDD)
  → health-FR-ar (BDD)
  → health-ES-es (BDD)
  → health-ES-ca (BDD)
  → health-AD-ca (BDD)
  ... (tous les pays × toutes les langues)
```

### Fichiers exportés

```
packages/frontend/src/assets/files/
├── FR/
│   ├── fr.json
│   ├── en.json
│   ├── ar.json
│   └── ...
├── ES/
│   ├── es.json
│   ├── ca.json
│   └── ...
└── AD/
    ├── ca.json
    └── ...
```

## ⚙️ Configuration

**Variable d'environnement requise :**

- `ANTHROPIC_API_KEY` - Pour la génération avec Claude

**Modèle utilisé :**

- `claude-opus-4-20250514` (meilleure qualité de traduction)
- Temperature: 0.3
- Max tokens: 1024
- Rate limit: 1 seconde entre chaque appel

## 📁 Fichiers

```
scripts/
├── sync-categories.ts                    # 🎯 Outil principal
├── generate-categories-json.ts           # Export JSON (utilisé par sync)
├── generate-categories-autocomplete.ts   # Logique de traduction (référence)
└── README.md                            # Ce fichier
```

## 💡 Pourquoi c'est simple maintenant ?

**Avant :**

- Plusieurs scripts
- Options pays/langue
- Compliqué

**Maintenant :**

- Un seul script : `sync-categories.ts`
- Pas d'options : fait tout automatiquement
- Réutilise les vraies fonctions existantes
- Clean séparé et indépendant

**Exemple complet :**

```bash
# Tout en 2 commandes
yarn workspace @soliguide/api categories:sync
./packages/api/db.sh dump
```

C'est tout ! 🎉
