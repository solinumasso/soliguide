# Plan de Migration - Catégories de Transport dans search_suggestions

## 📋 Vue d'ensemble

Cette migration vise à mettre à jour la collection `search_suggestions` avec les nouvelles catégories de transport pour la France (FR), l'Espagne (ES) et l'Andorre (AD).

### Objectifs

1. **Supprimer** les anciennes catégories de mobilité obsolètes
2. **Ajouter** les nouvelles catégories de transport
3. **Générer automatiquement** les traductions (seoTitle, seoDescription, synonyms) avec `translateCategory`

---

## 🗑️ Catégories à SUPPRIMER

Ces anciennes catégories seront supprimées de `search_suggestions` :

| Ancienne Catégorie           | Remplacée par             |
| ---------------------------- | ------------------------- |
| `carpooling`                 | `TRANSPORTATION_MOBILITY` |
| `provision_of_vehicles`      | `PERSONAL_VEHICLE_ACCESS` |
| `chauffeur_driven_transport` | `TRANSPORTATION_MOBILITY` |
| `mobility_assistance`        | `MOBILITY_FINANCING`      |

---

## ✨ Nouvelles Catégories à AJOUTER

D'après `categories.md`, voici les nouvelles catégories de transport :

| Catégorie                   | Slug                      | Pays       | Créée le       |
| --------------------------- | ------------------------- | ---------- | -------------- |
| **TRANSPORTATION_MOBILITY** | `transportation_mobility` | FR, ES, AD | 2025-12-31     |
| **PERSONAL_VEHICLE_ACCESS** | `personal_vehicle_access` | FR         | 2025-12-31     |
| **VEHICLE_MAINTENANCE**     | `vehicle_maintenance`     | FR         | N/A (nouvelle) |
| **MOBILITY_SUPPORT**        | `mobility_support`        | FR, ES, AD | N/A (nouvelle) |
| **DRIVING_LICENSE**         | `driving_license`         | FR         | N/A (nouvelle) |
| **MOBILITY_FINANCING**      | `mobility_financing`      | FR, ES, AD | 2025-12-31     |

**Note :** La catégorie parente `MOBILITY` existe déjà et ne doit pas être modifiée.

---

## 🔧 ÉTAPE 1 : Créer la Migration

### 1.1 Créer le fichier de migration

```bash
# Créer un nouveau fichier de migration avec timestamp
touch migrations/$(date +%Y%m%d%H%M%S)-add-new-transport-categories-to-search-suggestions.ts
```

Ou manuellement : `migrations/20260129001500-add-new-transport-categories-to-search-suggestions.ts`

### 1.2 Structure de la migration

```typescript
/*
 * SPDX-FileCopyrightText: © 2026 Solinum
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { Db } from "mongodb";
import { logger } from "../src/general/logger";
import { Categories, AutoCompleteType, SoliguideCountries } from "@soliguide/common";

const message = "Add new transport categories to search_suggestions";

// Mapping des nouvelles catégories avec leurs pays
const newCategories = [
  {
    category: Categories.TRANSPORTATION_MOBILITY,
    slug: "transportation_mobility",
    countries: ["FR", "ES", "AD"],
  },
  {
    category: Categories.PERSONAL_VEHICLE_ACCESS,
    slug: "personal_vehicle_access",
    countries: ["FR"],
  },
  {
    category: Categories.VEHICLE_MAINTENANCE,
    slug: "vehicle_maintenance",
    countries: ["FR"],
  },
  {
    category: Categories.MOBILITY_SUPPORT,
    slug: "mobility_support",
    countries: ["FR", "ES", "AD"],
  },
  {
    category: Categories.DRIVING_LICENSE,
    slug: "driving_license",
    countries: ["FR"],
  },
  {
    category: Categories.MOBILITY_FINANCING,
    slug: "mobility_financing",
    countries: ["FR", "ES", "AD"],
  },
];

// Anciennes catégories à supprimer
const oldCategoriesToRemove = ["carpooling", "provision_of_vehicles", "chauffeur_driven_transport", "mobility_assistance"];

export const up = async (db: Db) => {
  logger.info(`[MIGRATION] - ${message}`);

  // 1. Supprimer les anciennes catégories
  logger.info("🗑️  Removing old mobility categories from search_suggestions...");

  const deleteResult = await db.collection("search_suggestions").deleteMany({
    categoryId: { $in: oldCategoriesToRemove },
  });

  logger.info(`✅ Deleted ${deleteResult.deletedCount} old category suggestions`);

  // 2. Ajouter les nouvelles catégories de base (sans traductions)
  logger.info("✨ Adding new transport categories to search_suggestions...");

  const suggestions = [];

  for (const { category, slug, countries } of newCategories) {
    for (const country of countries) {
      // On crée une suggestion par pays, mais seulement pour la langue source
      // Les autres langues seront générées par le script translateCategory

      // Déterminer la langue source selon le pays
      let sourceLang = "fr"; // Par défaut FR
      if (country === "ES" || country === "AD") {
        // Pour ES et AD, on peut choisir la langue source
        // On va créer en FR d'abord, puis le script traduira
        sourceLang = "fr";
      }

      suggestions.push({
        sourceId: `${category}_${country}_${sourceLang}`,
        lang: sourceLang,
        label: category, // Le label sera celui de l'enum
        categoryId: category,
        slug: slug,
        synonyms: [],
        type: AutoCompleteType.CATEGORY,
        country: country,
        content: "",
        seoTitle: "", // Vide, sera rempli par translateCategory
        seoDescription: "", // Vide, sera rempli par translateCategory
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
  }

  if (suggestions.length > 0) {
    const insertResult = await db.collection("search_suggestions").insertMany(suggestions);
    logger.info(`✅ Inserted ${insertResult.insertedCount} new category suggestions (base)`);
  }

  logger.info("⚠️  IMPORTANT: You must now run the translateCategory script to generate translations");
  logger.info("   See PLAN_MIGRATION_CATEGORIES_TRANSPORT.md for instructions");
};

export const down = async (db: Db) => {
  logger.info(`[ROLLBACK] - ${message}`);

  // Supprimer les nouvelles catégories ajoutées
  const categoryIds = newCategories.map((c) => c.category);

  const deleteResult = await db.collection("search_suggestions").deleteMany({
    categoryId: { $in: categoryIds },
  });

  logger.info(`Removed ${deleteResult.deletedCount} new category suggestions`);

  // Note: On ne recrée pas les anciennes catégories en rollback
  // car elles sont obsolètes
  logger.info("⚠️  Old categories NOT restored (they are obsolete)");
};
```

---

## 🌍 ÉTAPE 2 : Exécuter la Migration

### 2.1 Vérifier que la migration est prête

```bash
# Lister les migrations en attente
npm run migrate:status
```

### 2.2 Exécuter la migration

```bash
# Exécuter toutes les migrations en attente
npm run migrate:up
```

Cela va :

- ✅ Supprimer les 4 anciennes catégories
- ✅ Ajouter les 6 nouvelles catégories (version de base en français)

---

## 🤖 ÉTAPE 3 : Générer les Traductions avec translateCategory

Le script `src/search/scripts/generate-categories-autocomplete.ts` utilise l'API Claude pour générer automatiquement :

- `seoTitle` : Titre SEO optimisé
- `seoDescription` : Description (150-160 caractères)
- `synonyms` : Liste de synonymes pertinents

### 3.1 Structure du script translateCategory

Le script prend en paramètres :

- `--country` ou `-c` : Code pays (FR, ES, AD, ou "all")
- `--lang` ou `-l` : Code langue (fr, es, ca, en, etc. ou "all")
- `--type` ou `-t` : Type (categories, establishments, organizations, ou "all")
- `--clean` : (optionnel) Nettoyer les traductions existantes avant de recommencer

### 3.2 Langues par pays

D'après la structure du projet :

**France (FR)** :

- Source : `fr` (français)
- Autres langues : `en`, `ar`, `fa`, `ps`, `ru`, `uk`, `ro`, `ka`

**Espagne (ES)** :

- Source : `ca` (catalan)
- Autres langues : `es`, `en`, `ar`, `fa`, `ps`, `ru`, `uk`, `ro`, `ka`

**Andorre (AD)** :

- Source : `ca` (catalan)
- Autres langues : `fr`, `es`, `en`, `ar`, `fa`, `ps`, `ru`, `uk`, `ro`, `ka`

### 3.3 Commandes de traduction

#### Option 1 : Traduire TOUTES les langues pour TOUS les pays de transport

```bash
# Traduire toutes les catégories pour tous les pays et toutes les langues
tsx src/search/scripts/generate-categories-autocomplete.ts \
  --country all \
  --lang all \
  --type categories
```

⚠️ **Attention** : Cela traduira TOUTES les catégories (pas seulement transport). Si vous voulez uniquement les catégories de transport, utilisez l'option 2.

#### Option 2 : Traduire pays par pays (RECOMMANDÉ)

##### France (FR)

```bash
# Traduire les catégories FR en français (langue source)
tsx src/search/scripts/generate-categories-autocomplete.ts \
  --country FR \
  --lang fr \
  --type categories

# Traduire les catégories FR en anglais
tsx src/search/scripts/generate-categories-autocomplete.ts \
  --country FR \
  --lang en \
  --type categories

# Traduire les catégories FR en arabe
tsx src/search/scripts/generate-categories-autocomplete.ts \
  --country FR \
  --lang ar \
  --type categories

# ... et ainsi de suite pour chaque langue (fa, ps, ru, uk, ro, ka)
```

##### Espagne (ES)

```bash
# Traduire les catégories ES en catalan (langue source)
tsx src/search/scripts/generate-categories-autocomplete.ts \
  --country ES \
  --lang ca \
  --type categories

# Traduire les catégories ES en espagnol
tsx src/search/scripts/generate-categories-autocomplete.ts \
  --country ES \
  --lang es \
  --type categories

# Traduire les catégories ES en anglais
tsx src/search/scripts/generate-categories-autocomplete.ts \
  --country ES \
  --lang en \
  --type categories

# ... et ainsi de suite pour les autres langues
```

##### Andorre (AD)

```bash
# Traduire les catégories AD en catalan (langue source)
tsx src/search/scripts/generate-categories-autocomplete.ts \
  --country AD \
  --lang ca \
  --type categories

# Traduire les catégories AD en français
tsx src/search/scripts/generate-categories-autocomplete.ts \
  --country AD \
  --lang fr \
  --type categories

# Traduire les catégories AD en espagnol
tsx src/search/scripts/generate-categories-autocomplete.ts \
  --country AD \
  --lang es \
  --type categories

# ... et ainsi de suite pour les autres langues
```

#### Option 3 : Script bash automatisé (pour tout faire d'un coup)

```bash
#!/bin/bash
# translate-all-transport-categories.sh

echo "🚀 Starting translation of transport categories for all countries and languages"

# France - Toutes les langues
for LANG in fr en ar fa ps ru uk ro ka; do
  echo "🇫🇷 Translating FR categories to $LANG..."
  tsx src/search/scripts/generate-categories-autocomplete.ts \
    --country FR \
    --lang $LANG \
    --type categories
  sleep 2 # Éviter le rate limiting
done

# Espagne - Toutes les langues
for LANG in ca es en ar fa ps ru uk ro ka; do
  echo "🇪🇸 Translating ES categories to $LANG..."
  tsx src/search/scripts/generate-categories-autocomplete.ts \
    --country ES \
    --lang $LANG \
    --type categories
  sleep 2
done

# Andorre - Toutes les langues
for LANG in ca fr es en ar fa ps ru uk ro ka; do
  echo "🇦🇩 Translating AD categories to $LANG..."
  tsx src/search/scripts/generate-categories-autocomplete.ts \
    --country AD \
    --lang $LANG \
    --type categories
  sleep 2
done

echo "✅ All translations completed!"
```

### 3.4 Configuration requise

⚠️ **Prérequis** : Vous devez avoir la variable d'environnement `ANTHROPIC_API_KEY` configurée :

```bash
# Vérifier que la clé API est configurée
echo $ANTHROPIC_API_KEY

# Si non configuré, l'ajouter dans .env
# ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxxxxxxx
```

---

## ✅ ÉTAPE 4 : Validation

### 4.1 Vérifier les données dans MongoDB

```javascript
// Dans MongoDB shell ou Compass

// 1. Vérifier que les anciennes catégories sont supprimées
db.search_suggestions
  .find({
    categoryId: {
      $in: ["carpooling", "provision_of_vehicles", "chauffeur_driven_transport", "mobility_assistance"],
    },
  })
  .count();
// Devrait retourner : 0

// 2. Vérifier que les nouvelles catégories sont présentes
db.search_suggestions
  .find({
    categoryId: {
      $in: ["TRANSPORTATION_MOBILITY", "PERSONAL_VEHICLE_ACCESS", "VEHICLE_MAINTENANCE", "MOBILITY_SUPPORT", "DRIVING_LICENSE", "MOBILITY_FINANCING"],
    },
  })
  .count();
// Devrait retourner un nombre > 0

// 3. Vérifier qu'elles ont des traductions (seoTitle non vide)
db.search_suggestions.find({
  categoryId: "TRANSPORTATION_MOBILITY",
  seoTitle: { $ne: "" },
});

// 4. Vérifier par pays
db.search_suggestions.find({
  categoryId: "TRANSPORTATION_MOBILITY",
  country: "FR",
});

// 5. Compter les suggestions par catégorie
db.search_suggestions.aggregate([
  {
    $match: {
      categoryId: {
        $in: ["TRANSPORTATION_MOBILITY", "PERSONAL_VEHICLE_ACCESS", "VEHICLE_MAINTENANCE", "MOBILITY_SUPPORT", "DRIVING_LICENSE", "MOBILITY_FINANCING"],
      },
    },
  },
  {
    $group: {
      _id: { category: "$categoryId", country: "$country" },
      count: { $sum: 1 },
      languages: { $addToSet: "$lang" },
    },
  },
  {
    $sort: { "_id.category": 1, "_id.country": 1 },
  },
]);
```

### 4.2 Résultats attendus

Pour **TRANSPORTATION_MOBILITY**, **MOBILITY_SUPPORT**, **MOBILITY_FINANCING** :

- **FR** : 9 langues (fr, en, ar, fa, ps, ru, uk, ro, ka)
- **ES** : 10 langues (ca, es, en, ar, fa, ps, ru, uk, ro, ka)
- **AD** : 11 langues (ca, fr, es, en, ar, fa, ps, ru, uk, ro, ka)

Pour **PERSONAL_VEHICLE_ACCESS**, **VEHICLE_MAINTENANCE**, **DRIVING_LICENSE** :

- **FR uniquement** : 9 langues (fr, en, ar, fa, ps, ru, uk, ro, ka)

**Total attendu** : ~117 entrées dans search_suggestions

### 4.3 Vérifier l'API

```bash
# Tester l'autocomplete en français
curl "http://localhost:3000/api/search/suggestions?country=FR&lang=fr&q=transport"

# Tester l'autocomplete en espagnol
curl "http://localhost:3000/api/search/suggestions?country=ES&lang=es&q=movilidad"

# Tester l'autocomplete en catalan
curl "http://localhost:3000/api/search/suggestions?country=AD&lang=ca&q=mobilitat"
```

---

## 🔄 Rollback (en cas de problème)

Si quelque chose ne va pas, vous pouvez faire un rollback :

```bash
# Annuler la dernière migration
npm run migrate:down

# Ou revenir à une migration spécifique
npx migrate-mongo down -f migrate-mongo-config.ts
```

Cela supprimera les nouvelles catégories ajoutées (mais ne restaurera PAS les anciennes car elles sont obsolètes).

---

## 📊 Résumé des Commandes

```bash
# 1. Créer la migration
touch migrations/$(date +%Y%m%d%H%M%S)-add-new-transport-categories-to-search-suggestions.ts

# 2. Exécuter la migration
npm run migrate:up

# 3a. Traduire TOUT en une commande (recommandé si vous voulez tout faire d'un coup)
tsx src/search/scripts/generate-categories-autocomplete.ts \
  --country all \
  --lang all \
  --type categories

# 3b. OU utiliser le script bash pour plus de contrôle
chmod +x translate-all-transport-categories.sh
./translate-all-transport-categories.sh

# 4. Valider dans MongoDB
mongo
> use soliguide
> db.search_suggestions.find({ categoryId: "TRANSPORTATION_MOBILITY" }).count()

# 5. Tester l'API
curl "http://localhost:3000/api/search/suggestions?country=FR&lang=fr&q=transport"
```

---

## 📝 Notes Importantes

1. **Ne PAS modifier manuellement** les traductions générées par Claude - elles sont optimisées pour le SEO et le langage clair (ISO 24495-1:2023)

2. **Rate limiting** : L'API Claude a des limites. Le script inclut des délais de 1 seconde entre chaque appel. Si vous avez des erreurs, augmentez le délai dans le script.

3. **Coût API** : Chaque traduction consomme des tokens Claude. Pour ~117 traductions, comptez environ 200k-300k tokens (~$0.60-$0.90 avec Claude Sonnet).

4. **Backup** : Avant de lancer la migration en production, faites un backup de la collection `search_suggestions` :

   ```bash
   mongodump --db soliguide --collection search_suggestions --out backup/
   ```

5. **Environnements** : Testez d'abord en développement/staging avant la production.

---

## 🎯 Checklist Finale

- [ ] Fichier de migration créé
- [ ] Migration testée en développement
- [ ] Variable `ANTHROPIC_API_KEY` configurée
- [ ] Script translateCategory testé manuellement sur 1 langue
- [ ] Toutes les traductions générées (117 entrées)
- [ ] Validations MongoDB effectuées
- [ ] Tests API effectués
- [ ] Backup de production fait
- [ ] Migration déployée en production
- [ ] Vérification post-déploiement effectuée

---

**Date de création** : 29 janvier 2026  
**Version** : 1.0
