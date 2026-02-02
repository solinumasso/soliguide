 # Migration: Import Search Suggestions depuis JSON

## 📋 Vue d'ensemble

**Fichier:** `20260129010730-import-search-suggestions-from-json.ts`

Cette migration importe les données de suggestions de recherche depuis les fichiers JSON statiques du frontend vers la collection MongoDB `search_suggestions`.

## 🎯 Objectif

Les fichiers JSON dans `packages/frontend/src/assets/files/` sont plus à jour que la base de données. Cette migration synchronise la base de données avec ces fichiers JSON.

## 📂 Structure des fichiers JSON

```
packages/frontend/src/assets/files/
├── fr/              # France
│   ├── fr.json
│   ├── en.json
│   ├── ar.json
│   └── ...
├── es/              # Espagne
│   ├── ca.json
│   ├── es.json
│   └── ...
└── ad/              # Andorre
    ├── ca.json
    ├── fr.json
    └── ...
```

- **Dossier** = Code pays (fr, es, ad)
- **Fichier** = Code langue (fr.json, en.json, etc.)
- **Contenu** = Tableau de suggestions avec `categoryId`, `label`, `slug`, `synonyms`, `type`, `seoTitle`, `seoDescription`

## 🔄 Fonctionnement

### 1. Lecture des fichiers

- Parcourt tous les dossiers de pays
- Lit tous les fichiers `.json` dans chaque dossier

### 2. Transformation des données

Pour chaque suggestion dans les JSON :

- **Génère `sourceId`** :
  - Si `categoryId` existe : `${categoryId}_${country}_${lang}`
  - Sinon : `${label_normalisé}_${country}_${lang}`
- **Normalise le pays** : Conversion en majuscules (FR, ES, AD)
- **Ajoute les champs manquants** :
  - `content: ""`
  - `createdAt` / `updatedAt`

### 3. Import en base de données

- **Stratégie UPSERT** : Met à jour si existe, insère sinon
- **Clé unique** : `{ sourceId, lang }`
- **Préservation** : `createdAt` est conservé pour les documents existants

## 📊 Statistiques affichées

À la fin de la migration, un résumé affiche :

- 📝 **Total processed** : Nombre total de suggestions traitées
- ✨ **New insertions** : Nouvelles suggestions créées
- 🔄 **Updated** : Suggestions mises à jour
- ❌ **Errors** : Erreurs rencontrées

## 🚀 Exécution

### Lancer la migration

```bash
# Exécuter la migration
npm run migrate:up

# Ou avec migrate-mongo directement
npx migrate-mongo up -f migrate-mongo-config.ts
```

### Vérifier le statut

```bash
npm run migrate:status
```

## 🔙 Rollback

⚠️ **Attention** : Le rollback n'est PAS implémenté pour cette migration.

Les données sont précieuses et ne doivent pas être supprimées automatiquement.

**Si vous devez annuler la migration :**

1. Restaurez depuis un backup MongoDB fait AVANT la migration
2. Ou utilisez MongoDB Compass pour supprimer/modifier manuellement les données

## 🧪 Tests recommandés

### Avant la migration

```bash
# Compter les suggestions actuelles
mongosh
> use soliguide
> db.search_suggestions.countDocuments()
```

### Après la migration

```bash
# Vérifier le nombre total
> db.search_suggestions.countDocuments()

# Vérifier une suggestion spécifique
> db.search_suggestions.findOne({ categoryId: "welcome", country: "FR", lang: "fr" })

# Vérifier les pays
> db.search_suggestions.distinct("country")
# Devrait retourner: ["FR", "ES", "AD"]

# Vérifier les langues par pays
> db.search_suggestions.aggregate([
  { $group: { _id: "$country", languages: { $addToSet: "$lang" }, count: { $sum: 1 } } }
])
```

## 📝 Notes importantes

### Pays traités

- **FR** (France) : 11 langues
- **ES** (Espagne) : 6 langues
- **AD** (Andorre) : 6 langues

### Champs requis dans JSON

Les fichiers JSON doivent contenir au minimum :

- `label` (requis)
- `type` (requis)
- `slug`
- `categoryId` (peut être `null`)
- `synonyms` (tableau)
- `seoTitle`
- `seoDescription`

### Génération du sourceId

Le `sourceId` est essentiel car il n'existe pas dans les JSON :

- **Avec categoryId** : `welcome_fr_fr`
- **Sans categoryId** : `restos_du_coeur_fr_fr`

### Performance

Pour ~4000+ suggestions :

- Temps estimé : 1-2 minutes
- Opération non bloquante pour les lectures pendant l'import

## 🐛 Dépannage

### Erreur "Cannot find module"

```bash
# Vérifier que les fichiers JSON existent
ls -la ../frontend/src/assets/files/
```

### Erreur "Duplicate key"

Les upserts utilisent `{ sourceId, lang }` comme clé unique. Si erreur :

1. Vérifier l'index : `db.search_suggestions.getIndexes()`
2. Recréer l'index si nécessaire

### Pays en minuscule au lieu de majuscule

Le code normalise automatiquement en majuscules. Si vous voyez des minuscules :

- Vérifier que la migration s'est bien exécutée
- Relancer la migration (les upserts corrigeront les valeurs)

## 📚 Ressources

- Modèle MongoDB : `src/search/models/search-suggestion.model.ts`
- Script génération JSON : `src/search/scripts/generate-categories-json.ts`
- Types communs : `@soliguide/common` package

---

**Date de création** : 29 janvier 2026  
**Auteur** : Équipe Soliguide  
**Version** : 1.0
