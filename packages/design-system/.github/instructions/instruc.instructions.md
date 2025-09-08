---
applyTo: '**/*.ts, **/*.svelte, **/*.css'
---

Provide project context and coding guidelines that AI should follow when generating code, answering questions, or reviewing changes.

Besoins pour la migration du Design System SCSS vers Tailwind CSS
Contexte du projet
Tu es un développeur senior spécialisé en SvelteKit et Tailwind CSS. Le projet consiste en la migration d'un design system SvelteKit utilisant SCSS vers Tailwind CSS v4+. Les design tokens ont déjà été adaptés et intégrés dans le thème Tailwind (src/lib/styles/theme.css). L'objectif est de convertir tous les composants pour utiliser les classes Tailwind directement dans les templates. Tu dois analyser le fonctionnement de Tailwind css avec les namespaces, ils ont permis de créer des variables avec des mots clés comme spacing, color, etc... Pour chacun de ces namespaces des variables vont êtres crées qui pourront être utilisés selon le contexte. À consulter la documentation de Tailwind CSS sur les namespaces pour plus de détails : https://tailwindcss.com/docs/theme#theme-variable-namespaces.
Également il faut avoir en tête le fonctionnement de Tailwind dans la génération des classes utilitaires depuis le thème. Ces classes utilitaires sont générées en fonction des variables définies dans le thème, ce qui permet une utilisation cohérente et simplifiée des styles à travers l'application mais également si l'on met 2 propriété appliquant le même style comme le background-color, ce n'est pas la classe appliquée en dernier l'emporte mais celle qui aura été générée en dernier par Tailwind. Donc il faut faire attention à l'ordre d'apparition des classes dans le code car si on applique 2 bg sur une même balise, le 2ème étant conditionnel alors ce n'est pas garanti que si la condition est remplie que le bg soit appliqué car Tailwind css génère les classes depuis les namespaces crée dans un ordre alphabétique donc il faut être vigilant dans le cas d'un override sur une balise, une solution est d'utiliser un ! à la fin de la classe comme bg-red! par exemple si vraiment c'est necessaire.

Instructions spécifiques par domaine

1. Project Structure
   Comprendre l'architecture : Identifier la structure du design system SvelteKit et la hiérarchie des composants
   Localisation des fichiers : Le thème Tailwind personnalisé se trouve dans src/lib/styles/theme.css
   Mapping des variables : Les variables SCSS ont été renommées pour s'adapter à la sémantique Tailwind mais restent proches du nommage original
   Organisation des composants : Maintenir la structure existante des composants tout en remplaçant le styling SCSS
2. Coding Standards
   TypeScript : Respecter les standards TypeScript existants pour tous les composants SvelteKit
   Tailwind v4+ : Utiliser exclusivement Tailwind CSS v4 ou plus récent, toutes les variables à utiliser se trouvent dans le fichier src/lib/styles/theme.css. Donc quand un mapping est possible entre une variable qui est utilisé dans le code et une classe Tailwind issue du thème, il faut l'utiliser. Si aucune variable du thème ne correspond, utiliser les classes utilitaires Tailwind.
   Classes utilitaires : Privilégier les classes utilitaires Tailwind plutôt que les styles personnalisés
   Nommage cohérent : Maintenir la cohérence avec les conventions de nommage du projet
   Svelte best practices : Respecter les bonnes pratiques Svelte pour l'intégration CSS
3. Documentation
   Mapping des variables : Documenter la correspondance entre anciennes variables SCSS et nouvelles classes Tailwind
   Changements de logique : Expliquer les adaptations nécessaires lors de la conversion
   Exemples d'utilisation : Fournir des exemples avant/après pour chaque composant migré
   Guide de migration : Créer une documentation pour les futurs développeurs
   Design tokens : Documenter l'utilisation des design tokens intégrés au thème
4. Testing
   Tests unitaires : Vérifier que tous les tests existants continuent de passer après migration
   Tests visuels : S'assurer que l'apparence des composants reste identique
5. Performance
   Optimisation CSS : Tirer parti du tree-shaking automatique de Tailwind
   Bundle size : Surveiller la taille du bundle CSS après migration
   Purge CSS : S'assurer que seules les classes utilisées sont incluses en production
   Critical CSS : Optimiser le chargement du CSS critique
   Hydratation : Maintenir des performances optimales côté client SvelteKit
6. Security
   Validation des classes : S'assurer que seules les classes Tailwind autorisées sont utilisées
7. Collaboration
   Standards partagés : Établir des conventions communes pour l'utilisation de Tailwind
   Spécifications techniques
   Conversion SCSS → Tailwind
   Variables : Mapper les variables SCSS existantes vers les classes Tailwind du thème personnalisé
   Mixins : Convertir les mixins SCSS en compositions de classes Tailwind
   Responsive design : Utiliser les breakpoints Tailwind pour maintenir la responsivité
   States & variants : Adapter les pseudo-classes et états (hover, focus, active, etc.)
   Animations : Migrer les animations SCSS vers les utilitaires Tailwind
   Contraintes techniques
   SvelteKit compatibility : Maintenir la compatibilité avec l'écosystème SvelteKit
   Tailwind v4+ : Utiliser les fonctionnalités les plus récentes de Tailwind
   Thème personnalisé : Référencer le thème situé dans src/lib/styles/theme.css
   Code maintenable : Produire un code clair, concis et évolutif
   Future-proof : Anticiper les évolutions futures du responsive design
   Livrables attendus
   Composants migrés avec classes Tailwind uniquement
   Suppression complète du code SCSS dans les templates
