<!--
Soliguide: Useful information for those who need it

SPDX-FileCopyrightText: © 2024 Solinum

SPDX-License-Identifier: AGPL-3.0-only

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published
by the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
-->

# Documentation Soliguide

Documentation statique en HTML pour le projet Soliguide.

## 🎯 Objectif

Créer une documentation accessible et conviviale (non technique) présentant les ressources Soliguide, notamment la bibliothèque d'icônes de catégories et services.

## 📦 Structure

```
soliguide-docs/
├── assets/
│   ├── icons -> ../icons-generator/icons/svg (lien symbolique)
│   ├── icons-png -> ../icons-generator/icons/png (lien symbolique)
│   └── logo.svg
├── index.html          # Page d'accueil
├── icons.html          # Bibliothèque d'icônes
├── search.html         # Recherche (à venir)
├── generate-icons-list.js  # Script pour générer la liste des icônes
├── icons-list.json     # Liste des icônes (généré automatiquement)
└── package.json
```

## 🚀 Démarrage

### Installation

```bash
yarn install
```

### Développement

```bash
# Génère la liste des icônes et démarre le serveur local
yarn dev
```

Le site sera accessible à l'adresse : `http://localhost:3000`

### Scripts disponibles

- `yarn dev` - Génère la liste des icônes et démarre le serveur de développement
- `yarn start` - Alias pour `yarn dev`
- `yarn generate-icons-list` - Génère uniquement le fichier `icons-list.json`
- `yarn build` - Génère la liste et copie les icônes (pour la production)
- `yarn clean` - Nettoie les fichiers générés

## 🎨 Technologies

- **HTML5** - Structure
- **Tailwind CSS** - Styles via CDN
- **DaisyUI** - Composants UI avec les couleurs de Soliguide
- **JavaScript Vanilla** - Interactions

## 🖼️ Fonctionnalités des icônes

La page `icons.html` permet de :

- ✅ **Parcourir les icônes organisées par thèmes** (Santé, Alimentation, Logement, etc.)
- ✅ **Rechercher une icône** par nom
- ✅ **Filtrer par type** (contour / rempli)
- ✅ **Copier le nom** de l'icône
- ✅ **Copier le code SVG** dans le presse-papiers
- ✅ **Télécharger en SVG**
- ✅ **Télécharger en PNG**

### Organisation par thèmes

Les 209 icônes sont automatiquement organisées en 13 thèmes :

- **Santé** (34 icônes) - Médecine générale, spécialités, soins
- **Mobilité** (5 icônes) - Transport, covoiturage, assistance
- **Formation et emploi** (8 icônes) - Cours, coaching, insertion
- **Hygiène et bien-être** (8 icônes) - Douche, lessive, coiffeur
- **Accompagnement** (10 icônes) - Conseil, aide administrative, juridique
- **Technologie** (6 icônes) - WiFi, ordinateurs, prises électriques
- **Alimentation** (11 icônes) - Distribution, épicerie sociale, cuisine
- **Accueil** (6 icônes) - Hébergement de jour, espace famille
- **Activités** (5 icônes) - Sport, musées, bibliothèques
- **Équipement** (4 icônes) - Consigne, vêtements, magasin solidaire
- **Logement** (6 icônes) - Hébergement d'urgence, accès au logement
- **Animaux** (1 icône) - Assistance animale
- **Autres** - Icônes non catégorisées

## 🎨 Couleurs Soliguide

```css
Primary: #3e3a71    (Bleu violet)
Secondary: #e65a46  (Orange/rouge)
Accent: #635dac     (Violet)
Success: #007036    (Vert)
Warning: #ffc107    (Jaune)
Error: #da3849      (Rouge)
Background: #f2f5f9 (Gris clair)
```

## 📝 Notes techniques

### Icônes

- Les icônes sont **liées symboliquement** depuis `../icons-generator/icons/`
- **Pas de duplication** dans le repo (les icônes ne sont pas versionnées ici)
- Le fichier `icons-list.json` est **généré automatiquement** par `generate-icons-list-advanced.js`
- Organisation par **thèmes basée sur l'enum Categories** de `@soliguide/common`
- 209 icônes disponibles en format **SVG et PNG**
- Chaque icône existe en version **remplie** et **contour** (_outlined)

### Déploiement

Pour un déploiement en production :

1. Exécutez `yarn build` pour copier les icônes dans `assets/icons-copied/`
2. Déployez tous les fichiers HTML et le dossier `assets/`
3. Le serveur web doit servir les fichiers statiques

## 🔗 Liens

- [Soliguide.fr](https://soliguide.fr)
- [GitHub - Soliguide](https://github.com/SoliNum/soliguide)

## 📄 License

AGPL-3.0-only - © 2024 Solinum
