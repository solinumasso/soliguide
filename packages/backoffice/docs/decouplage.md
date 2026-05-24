# Plan de découplage — Frontend public / Back-office

## Contexte

Le package `@soliguide/frontend` est une application Angular 17 unique qui sert deux couches distinctes :

- **Frontend public** : pages de recherche de lieux, fiche lieu, accueil, contact — accessibles sans authentification
- **Back-office** : gestion des lieux, des organisations, des utilisateurs, campagnes de mise à jour, traductions, outil de déduplication (Soligare) — réservé aux équipes internes et aux utilisateurs PRO

**Objectif** : séparer ces deux couches en deux packages Angular indépendants dans le monorepo :

- `@soliguide/frontend` — uniquement la partie publique
- `@soliguide/backoffice` — uniquement la partie back-office

---

## 1. Cartographie de l'existant

### 1.1 Structure des routes (app-routing.module.ts)

| Route                     | Module chargé                    | Audience     | Guards                                                       |
| ------------------------- | -------------------------------- | ------------ | ------------------------------------------------------------ |
| `/:lang`                  | HomeComponent (eager)            | Public       | `LanguageGuard`                                              |
| `/:lang/contact`          | ContactComponent (eager)         | Public       | `LanguageGuard`                                              |
| `/:lang/devenir-benevole` | DevenirBenevoleComponent (eager) | Public       | `LanguageGuard`                                              |
| `/:lang/search`           | SearchModule (lazy)              | Public       | `LanguageGuard`                                              |
| `/:lang/fiche`            | PlacePageModule (lazy)           | Public       | `LanguageGuard`                                              |
| `/:lang/aide`             | AideComponent (eager)            | PRO/Trad     | `LanguageGuard` + `AuthGuard`                                |
| `/:lang/aide-trad`        | AideTradComponent (eager)        | Traducteurs  | `LanguageGuard` + `AuthGuard`                                |
| `/:lang/historique`       | PlaceChangesModule (lazy)        | PRO          | `LanguageGuard` + `AuthGuard` + `ProGuard`                   |
| `/:lang/admin-place`      | FormPlaceModule (lazy)           | PRO          | `LanguageGuard` + `AuthGuard` + `ProGuard`                   |
| `/:lang/manage-place`     | AdminPlaceModule (lazy)          | PRO          | `LanguageGuard` + `AuthGuard` + `ProGuard`                   |
| `/:lang/admin-users`      | AdminUsersModule (lazy)          | Admin        | `LanguageGuard` + `AuthGuard` + `ProGuard`                   |
| `/:lang/organisations`    | AdminOrganisationModule (lazy)   | PRO          | `LanguageGuard` + `AuthGuard` + `ProGuard`                   |
| `/:lang/campaign`         | CampaignModule (lazy)            | PRO+Campaign | `LanguageGuard` + `AuthGuard` + `ProGuard` + `CampaignGuard` |
| `/:lang/translations`     | TranslationsModule (lazy)        | Traducteurs  | `LanguageGuard` + `AuthGuard` + `TranslatorSoliguideGuard`   |
| `/:lang/soligare`         | SoligareModule (lazy)            | Super-admin  | `AdminSoliguideGuard`                                        |
| `/:lang/404`              | NotFoundComponent (eager)        | Tous         | `LanguageGuard`                                              |
| `/:lang/solidata`         | SolidataMaintenanceComponent     | Hors-service | `LanguageGuard`                                              |

### 1.2 Modules Angular — classification

#### Modules exclusivement back-office

| Module               | Rôle                                                                  | Dépendances internes                                                                                                                                                      |
| -------------------- | --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `admin-place`        | Dashboard gestion des lieux, liste, filtres, suppression, duplication | `AdminPlaceSharedModule`, `AdminOrganisationModule`, `CampaignSharedModule`, `FicheChangesModule`, `ManageCommonModule`, `PlaceModule`, `SharedModule`, `SearchBarModule` |
| `form-place`         | Formulaire de création/édition complet d'un lieu                      | `AdminPlaceSharedModule`, `PlaceModule`, `SharedModule`, `UsersModule`                                                                                                    |
| `admin-organisation` | Gestion des organisations et équipes                                  | `AdminPlaceSharedModule`, `ManageCommonModule`, `PlaceModule`, `SharedModule`, `UsersModule`                                                                              |
| `admin-users`        | Gestion des comptes utilisateurs                                      | `AdminPlaceSharedModule`, `ManageCommonModule`, `PlaceModule`, `SharedModule`, `UsersModule`                                                                              |
| `admin-place-shared` | Composants d'affichage admin partagés entre modules admin             | `PlaceModule`, `SharedModule`                                                                                                                                             |
| `campaign`           | Campagnes de mise à jour des données                                  | `AdminPlaceSharedModule`, `CampaignSharedModule`, `FormPlaceModule`, `PlaceModule`, `PlacePageModule`, `SharedModule`                                                     |
| `campaign-shared`    | Composants UI communs à campaign et place                             | `SharedModule`                                                                                                                                                            |
| `translations`       | Interface de traduction des contenus                                  | `ManageCommonModule`, `PlaceModule`, `SharedModule`                                                                                                                       |
| `soligare`           | Outil de déduplication (matching)                                     | `SearchModule`, `PlaceModule`, `ManageCommonModule`                                                                                                                       |
| `place-changes`      | Historique des modifications sur les lieux                            | `ManageCommonModule`, `SharedModule`                                                                                                                                      |
| `manage-common`      | Composants UI génériques back-office (pagination, tri, multi-sélect)  | Aucune dépendance interne                                                                                                                                                 |

#### Modules exclusivement publics

| Module         | Rôle                               | Dépendances internes                                                |
| -------------- | ---------------------------------- | ------------------------------------------------------------------- |
| `search`       | Recherche de lieux, carte, filtres | `SharedModule`, `SearchBarModule`, composants standalone de `place` |
| `place-page`   | Fiche détaillée d'un lieu          | `PlaceModule`, `SharedModule`                                       |
| `static-pages` | Pages légales, CGU, RGPD           | `SharedModule`                                                      |

#### Modules partagés (utilisés par les deux couches)

| Module       | Rôle                                                                           | Problème de couplage                                                                                    |
| ------------ | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------- |
| `place`      | Composants display d'un lieu (contacts, horaires, services, photos, transport) | Importe `CampaignSharedModule` et fournit `CampaignService` — logique back-office dans un module public |
| `users`      | Auth (login, signup, reset) + services `AuthService`/`UsersService`            | Importe `InviteUserService` depuis `admin-organisation` — dépendance circulaire                         |
| `shared`     | Pipes, directives, composants UI génériques, services utilitaires              | Mélange utilitaires public et admin, mais le code est propre                                            |
| `search-bar` | Barre de recherche avec autocomplete Algolia                                   | Partagé public (accueil) + admin (filtres) — pas de logique métier problématique                        |
| `general`    | Accueil, nav, footer, contact, pages aide                                      | Contient `AideComponent` et `AideTradComponent` qui sont des pages back-office                          |
| `analytics`  | Intégration Sentry + PostHog                                                   | Aucun couplage métier — technique pur                                                                   |

### 1.3 Services — classification

#### Services back-office

| Service                     | Module                               | Rôle                             |
| --------------------------- | ------------------------------------ | -------------------------------- |
| `AdminPlaceService`         | `form-place`                         | CRUD admin sur les lieux         |
| `AdminPlaceContactsService` | `form-place`                         | Gestion admin des contacts       |
| `UploadService`             | `form-place`                         | Upload photos et documents       |
| `ManagePlacesService`       | `admin-place`                        | Filtres et liste des lieux admin |
| `AdminUsersService`         | `admin-users`                        | CRUD utilisateurs                |
| `OrganisationService`       | `admin-organisation`                 | CRUD organisations               |
| `InviteUserService`         | `admin-organisation`                 | Envoi d'invitations              |
| `CampaignService`           | `campaign` (et `place` — couplage !) | Gestion des campagnes            |
| `SoligareSearchService`     | `soligare`                           | Recherche pour déduplication     |
| `TranslationService`        | `translations`                       | Gestion des traductions          |
| `PlaceChangesService`       | `place-changes`                      | Historique des modifications     |

#### Services publics

| Service            | Module       | Rôle                                |
| ------------------ | ------------ | ----------------------------------- |
| `SearchService`    | `search`     | Recherche full-text et géolocalisée |
| `SearchBarService` | `search-bar` | Autocomplete Algolia                |
| `GeneralService`   | `general`    | Données de la page d'accueil        |
| `PlaceService`     | `place`      | Récupération des données d'un lieu  |
| `HolidaysService`  | `place`      | Calcul des jours fériés             |

#### Services partagés (à dupliquer ou extraire)

| Service                | Module actuel      | Rôle                                       |
| ---------------------- | ------------------ | ------------------------------------------ |
| `AuthService`          | `users`            | Gestion JWT, état de l'utilisateur courant |
| `UsersService`         | `users`            | CRUD utilisateur connecté                  |
| `ChatService`          | `general`/`shared` | Widget de chat Crisp                       |
| `LocationService`      | `shared`           | Géolocalisation                            |
| `PrintService`         | `shared`           | Impression                                 |
| `SEOService`           | `shared`           | Gestion des balises meta                   |
| `CookieManagerService` | `shared`           | Consentement cookies                       |
| `ThemeService`         | `shared`           | Configuration du thème                     |

### 1.4 Guards — classification

| Guard                      | Destination            | Rôle                                                 |
| -------------------------- | ---------------------- | ---------------------------------------------------- |
| `LanguageGuard`            | Les deux apps          | Validation de la langue dans l'URL                   |
| `AuthGuard`                | Les deux apps          | Vérifie la validité du JWT                           |
| `ProGuard`                 | Back-office uniquement | Vérifie que l'utilisateur est PRO ou admin           |
| `AdminSoliguideGuard`      | Back-office uniquement | Vérifie le flag admin Soliguide                      |
| `TranslatorSoliguideGuard` | Back-office uniquement | Vérifie les droits de traduction                     |
| `CampaignGuard`            | Back-office uniquement | Vérifie l'accès aux campagnes                        |
| `PendingChangesGuard`      | Back-office uniquement | Alerte avant de quitter un formulaire non sauvegardé |
| `CanCreateGuard`           | Back-office uniquement | Droits de création d'un lieu                         |
| `CanEditGuard`             | Back-office uniquement | Droits d'édition d'un lieu                           |
| `CanReadChangeGuard`       | Back-office uniquement | Droits de lecture de l'historique                    |
| `NotAuthGuard`             | Les deux apps          | Inverse de AuthGuard (pages de login)                |

### 1.5 Intercepteurs

| Intercepteur             | Portée        | Description                                                |
| ------------------------ | ------------- | ---------------------------------------------------------- |
| `JwtInterceptor`         | Les deux apps | Injecte le token Bearer dans toutes les requêtes HTTP      |
| `ServerErrorInterceptor` | Les deux apps | Gère 401 (logout), 403 (unauthorized), déconnexion offline |

### 1.6 Modèles — classification

Les modèles dans `src/app/models/` sont **quasi-intégralement partagés**. Ils seront à déplacer dans `@soliguide/common` ou `@soliguide/common-angular` si ce n'est pas déjà le cas, ou conservés dans un dossier `models/` partagé via la lib commune.

| Dossier          | Contenu                                 | Destination |
| ---------------- | --------------------------------------- | ----------- |
| `_general/`      | `InfoColor`                             | Shared      |
| `api/`           | `ApiError`, `ApiMessage`                | Shared      |
| `campaign/`      | `CampaignObject`, `CampaignStatus`      | Back-office |
| `categories/`    | Constantes de champs de catégories      | Shared      |
| `manage-search/` | `PasswordToken`                         | Back-office |
| `place/`         | `Place`, `Service`, `Photo`, `Position` | Shared      |
| `place-changes/` | `PlaceChanges`, `TypeEdition`           | Back-office |
| `search-places/` | `MarkerOptions`                         | Public      |
| `themes/`        | `ThemeConfiguration`                    | Shared      |

### 1.7 Assets

Les assets sont **entièrement partagés** entre les deux couches. Un dossier `assets/` commun sera nécessaire ou une copie au moment du build.

| Sous-dossier   | Usage                                                |
| -------------- | ---------------------------------------------------- |
| `css/`         | Styles globaux — partagés                            |
| `fonts/icons/` | Polices d'icônes — partagées                         |
| `images/`      | Images diverses — partagées                          |
| `locales/`     | Fichiers de traduction — partagés                    |
| `files/`       | Données de suggestions de recherche — public surtout |
| `sitemaps/`    | XML sitemaps — public                                |

---

## 2. Points de couplage critiques

### CP-01 — `PlaceModule` dépend de logique back-office

**Fichier** : `src/app/modules/place/place.module.ts`

**Problème** : `PlaceModule` est le module d'affichage d'un lieu, utilisé par les pages publiques (`place-page`, `search`). Or il importe `CampaignSharedModule` et fournit `CampaignService` dans ses providers. La campagne est une notion purement back-office.

```
PlaceModule
  ├── imports: CampaignSharedModule  ← logique back-office dans module public
  └── providers: [CampaignService]   ← service back-office dans module public
```

**Impact** : Impossible de charger `PlaceModule` dans le frontend public sans embarquer du code back-office.

**Résolution** : Supprimer `CampaignSharedModule` de `PlaceModule`. Rendre les bannières de campagne (`PlaceUpdateCampaignBannerComponent`, `ExternalSourcePlaceCampaignBannerComponent`) optionnelles via `@Input()` ou les retirer de `PlaceModule` pour les placer uniquement dans `admin-place-shared`.

---

### CP-02 — `UsersModule` dépend de `admin-organisation`

**Fichier** : `src/app/modules/users/users.module.ts`

**Problème** : `UsersModule` est chargé de façon eager dans `AppModule` (pour toutes les pages) et importe `InviteUserService` depuis `admin-organisation`. Ce service n'a aucune pertinence dans le contexte public.

```
UsersModule (chargé par tous)
  └── providers: [InviteUserService]  ← depuis admin-organisation
```

**Impact** : Le frontend public charge du code back-office au démarrage pour tous les utilisateurs, même anonymes.

**Résolution** : Sortir `InviteUserService` de `UsersModule`. Le placer uniquement dans `AdminOrganisationModule`. Extraire `AuthService` et `UsersService` dans un `CoreModule` ou dans `@soliguide/common-angular`.

---

### CP-03 — `CampaignModule` importe `PlacePageModule`

**Fichier** : `src/app/modules/campaign/campaign.module.ts`

**Problème** : Le module de campagne (back-office) importe `PlacePageModule` (public) pour réutiliser la fiche lieu en lecture dans le workflow de campagne.

```
CampaignModule (back-office)
  └── imports: PlacePageModule  ← module public
```

**Impact** : Dépendance inversée — le back-office dépend du public. Si `PlacePageModule` est modifié pour des raisons publiques, cela peut impacter le back-office.

**Résolution** : Extraire les composants display de lieu utilisés dans la campagne vers `AdminPlaceSharedModule`. Ou bien, dans le backoffice, importer directement `PlaceModule` (les composants d'affichage bas niveau) sans passer par `PlacePageModule`.

---

### CP-04 — `FormPlaceModule` importe `UsersModule`

**Fichier** : `src/app/modules/form-place/form-place.module.ts`

**Problème** : Le formulaire d'édition d'un lieu (back-office) importe `UsersModule` pour accéder à des composants liés à l'authentification ou à la gestion d'utilisateurs dans le formulaire.

```
FormPlaceModule (back-office)
  └── imports: UsersModule
```

**Impact** : Couplage entre formulaire admin et module d'authentification partagé.

**Résolution** : Identifier précisément les composants de `UsersModule` utilisés dans `FormPlaceModule`. Si c'est `InviteFormComponent` ou `TranslatableLanguageSelectorComponent` (seuls exports de `UsersModule`), les déplacer dans un module plus adapté pour le back-office.

---

### CP-05 — `GeneralModule` contient des pages back-office

**Fichier** : `src/app/modules/general/general.module.ts`

**Problème** : `GeneralModule` est chargé de façon eager dans `AppModule` et contient `AideComponent` et `AideTradComponent`, qui sont des pages d'aide réservées aux utilisateurs connectés (PRO / traducteurs). Ces deux routes sont protégées par `AuthGuard`.

**Impact** : Du code back-office (pages d'aide) est embarqué dans le module general qui est pourtant public.

**Résolution** : Extraire `AideComponent` et `AideTradComponent` hors de `GeneralModule`, dans un module dédié au back-office (`aide` route en lazy loading).

---

### CP-06 — `AdminPlaceModule` importe `FicheChangesModule` et `AdminOrganisationModule`

**Fichier** : `src/app/modules/admin-place/admin-place.module.ts`

**Problème** : `AdminPlaceModule` est déjà purement back-office mais crée un graphe de dépendances très profond en important `AdminOrganisationModule` (avec ses propres dépendances) et `FicheChangesModule`. Cela rend le module lourd et difficile à faire évoluer indépendamment.

**Résolution** : Ce n'est pas un problème pour le découplage public/backoffice car ces modules vont tous migrer ensemble vers le package `backoffice`. Mais c'est une dette technique à documenter pour une refactorisation ultérieure.

---

### CP-07 — Chargement eager de `UsersModule`

**Fichier** : `src/app/app.module.ts`

**Problème** : `UsersModule` est chargé en eager dans `AppModule` (marqué `TODO: migrate to lazy loading`). Cela signifie que tout le code d'authentification (login, signup, reset) est chargé immédiatement, même pour un utilisateur anonyme sur la page de recherche.

**Impact** : Bundle public alourdi inutilement pour les visiteurs non connectés.

**Résolution** : Migrer `UsersModule` en lazy loading dans le frontend public (routes `/login`, `/signup`, etc.) et l'intégrer directement dans le routing du back-office.

---

## 3. Points sans nécessité de découplage

Ces éléments sont déjà bien structurés et ne nécessitent pas de travail de découplage spécifique — ils seront soit copiés, soit partagés via `@soliguide/common-angular`.

| Élément                           | Raison                                                               |
| --------------------------------- | -------------------------------------------------------------------- |
| `ManageCommonModule`              | Aucune dépendance sur le public — migration directe vers backoffice  |
| `manage-common`                   | Composants UI purs (pagination, tri) sans logique métier             |
| `analytics` (Sentry/PostHog)      | Module technique, peut être configuré indépendamment dans chaque app |
| `JwtInterceptor`                  | Logique générique, identique dans les deux apps                      |
| `ServerErrorInterceptor`          | Logique générique, identique dans les deux apps                      |
| `LanguageGuard`                   | Identique dans les deux apps                                         |
| `search-bar`                      | Module autonome, pas de dépendance croisée                           |
| `static-pages`                    | Aucune dépendance sur le back-office                                 |
| `place-changes`                   | Purement back-office, migration directe                              |
| `translations` (module)           | Purement back-office, migration directe                              |
| `soligare`                        | Purement back-office, migration directe                              |
| `SharedModule` (pipes/directives) | Code propre, sera extrait dans `@soliguide/common-angular`           |

---

## 4. Graphe de dépendances — état actuel

```
AppModule (eager)
├── GeneralModule          ← public + aide (back-office) ← À SÉPARER
├── StaticPagesModule      ← public ✓
├── SharedModule           ← partagé ✓
├── AnalyticsModule        ← partagé ✓
├── UsersModule (eager)    ← partagé + InviteUserService (back-office) ← À CORRIGER
└── AppRoutingModule
    ├── (public) SearchModule → SharedModule, SearchBarModule
    ├── (public) PlacePageModule → PlaceModule
    │                               └── CampaignSharedModule  ← À CORRIGER (CP-01)
    │                               └── providers: CampaignService ← À CORRIGER (CP-01)
    ├── (admin) FormPlaceModule → AdminPlaceSharedModule → PlaceModule
    │                           → UsersModule ← À CORRIGER (CP-04)
    ├── (admin) AdminPlaceModule → AdminOrganisationModule
    │                            → FicheChangesModule
    │                            → AdminPlaceSharedModule → PlaceModule
    ├── (admin) AdminOrganisationModule → UsersModule, PlaceModule
    ├── (admin) AdminUsersModule → UsersModule, PlaceModule
    ├── (admin) CampaignModule → FormPlaceModule
    │                          → PlacePageModule ← À CORRIGER (CP-03)
    ├── (admin) TranslationsModule
    ├── (admin) PlaceChangesModule
    └── (admin) SoligareModule
```

---

## 5. Plan d'exécution

### Vue d'ensemble

Le découplage se fait en **7 phases** qui s'exécutent dans l'ordre. Chaque phase produit un état compilable et testable avant de passer à la suivante.

```
Phase 0 → Phase 1 → Phase 2 → Phase 3 → Phase 4 → Phase 5 → Phase 6 → Phase 7
  Init      Fix CP    Fix CP    Shared    Création   Migration  Nettoyage  Infra
  projet    01/02     03/04/05  lib       backoffice  modules   frontend   deploy
```

---

### Phase 0 — Initialisation du projet backoffice

**Durée estimée** : 0.5 jour  
**Prérequis** : Aucun  
**Risque** : Faible

#### Étapes

1. Créer le dossier `packages/backoffice/` dans le monorepo.
2. Initialiser une application Angular avec le CLI :
   ```bash
   cd packages/backoffice
   ng new backoffice --routing --style=scss --standalone=false
   ```
3. Configurer `package.json` :
   ```json
   {
     "name": "@soliguide/backoffice",
     "version": "1.0.0"
   }
   ```
4. Ajouter le package à `lerna.json` et `nx.json` pour l'intégration monorepo.
5. Configurer `tsconfig.json` avec les mêmes paths que le frontend (`@soliguide/common`, `@soliguide/common-angular`).
6. Copier les fichiers `angular.json`, `.eslintrc.json`, `jest.config.js` depuis `frontend/` et les adapter.
7. Configurer `yarn workspaces` pour inclure le nouveau package.

#### Livrables

- Package `@soliguide/backoffice` compilable avec `ng serve`
- Intégration Lerna/Nx fonctionnelle

---

### Phase 1 — Correction du couplage CP-01 (PlaceModule ← CampaignSharedModule)

**Durée estimée** : 1 jour  
**Prérequis** : Phase 0  
**Risque** : Moyen — touche un module très utilisé

**Objectif** : Rendre `PlaceModule` totalement indépendant de toute logique back-office.

#### Étapes

1. **Analyser l'usage des bannières de campagne dans `PlaceModule`** :

   - `PlaceUpdateCampaignBannerComponent` — affiché dans la fiche lieu
   - `ExternalSourcePlaceCampaignBannerComponent` — affiché dans la fiche lieu
   - Ces composants dépendent de `CampaignSharedModule`

2. **Stratégie de découplage — Option retenue : Input conditionnel** :

   - Convertir `PlaceUpdateCampaignBannerComponent` et `ExternalSourcePlaceCampaignBannerComponent` en composants standalone sans import de `CampaignSharedModule`
   - OU retirer ces composants de `PlaceModule` et les placer dans `AdminPlaceSharedModule` (seul le back-office affiche les bannières de campagne)
   - Recommandation : **retirer les composants de bannière de campagne de `PlaceModule`** et les placer dans `AdminPlaceSharedModule`

3. **Retirer `CampaignSharedModule` de `PlaceModule`** :

   ```typescript
   // place.module.ts — AVANT
   imports: [CampaignSharedModule, ...]
   providers: [CampaignService, HolidaysService]

   // place.module.ts — APRÈS
   imports: [...]
   providers: [HolidaysService]
   ```

4. **Déplacer `CampaignService` dans `CampaignModule`** comme provider local uniquement.

5. **Déplacer `PlaceUpdateCampaignBannerComponent` et `ExternalSourcePlaceCampaignBannerComponent`** de `PlaceModule` vers `AdminPlaceSharedModule`.

6. **Mettre à jour les imports** dans tous les modules qui utilisaient ces composants via `PlaceModule`.

7. **Vérifier la compilation** : `yarn build --scope @soliguide/frontend`

8. **Lancer les tests** : `yarn workspace @soliguide/frontend test`

#### Livrables

- `PlaceModule` sans aucune dépendance sur `CampaignSharedModule` ou `CampaignService`
- Tests verts

---

### Phase 2 — Correction des couplages CP-02, CP-04, CP-05

**Durée estimée** : 1.5 jours  
**Prérequis** : Phase 1  
**Risque** : Élevé — touche l'authentification et le module chargé de façon eager

#### Étapes

##### 2a — Corriger CP-02 : Sortir `InviteUserService` de `UsersModule`

1. Supprimer `InviteUserService` des providers de `UsersModule`.
2. Ajouter `InviteUserService` aux providers de `AdminOrganisationModule`.
3. Vérifier que les composants de `UsersModule` qui utilisent `InviteUserService` (ex. `InviteFormComponent`) injectent le service depuis le bon scope.
4. Si `InviteFormComponent` est exporté depuis `UsersModule` et utilisé dans `AdminOrganisationModule`, déplacer `InviteFormComponent` vers `AdminOrganisationModule`.

##### 2b — Corriger CP-04 : Analyser pourquoi `FormPlaceModule` importe `UsersModule`

1. Identifier les exports de `UsersModule` utilisés dans `form-place/` :
   - `InviteFormComponent` — si utilisé, le déplacer vers `admin-organisation`
   - `TranslatableLanguageSelectorComponent` — si utilisé, l'extraire dans `SharedModule` ou un module dédié
2. Supprimer l'import de `UsersModule` dans `FormPlaceModule` une fois les dépendances résolues.

##### 2c — Corriger CP-05 : Extraire `AideComponent` et `AideTradComponent` de `GeneralModule`

1. Créer un nouveau module `aide/aide.module.ts` dans le dossier `modules/` du frontend.
2. Déplacer `AideComponent` et `AideTradComponent` dans ce nouveau module.
3. Configurer le routing en lazy loading :
   ```typescript
   {
     path: ":lang/aide",
     canActivate: [LanguageGuard, AuthGuard],
     loadChildren: () => import("./modules/aide/aide.module").then(m => m.AideModule),
   }
   ```
4. Supprimer `AideComponent` et `AideTradComponent` de `GeneralModule`.

##### 2d — Corriger CP-07 : Migrer `UsersModule` en lazy loading

1. Créer un routing module `users-routing.module.ts` s'il n'existe pas déjà (vérifié : il existe).
2. Modifier `app.module.ts` pour ne plus importer `UsersModule` en eager.
3. Configurer les routes de `UsersModule` en lazy loading dans `app-routing.module.ts` :
   ```typescript
   {
     path: ":lang/login",
     loadChildren: () => import("./modules/users/users.module").then(m => m.UsersModule),
   }
   ```
4. S'assurer que `AuthService` et `UsersService` sont accessibles globalement via `providedIn: 'root'` plutôt que via les providers du module.

#### Livrables

- `UsersModule` sans dépendance sur `admin-organisation`
- `FormPlaceModule` sans import de `UsersModule`
- `GeneralModule` sans `AideComponent`/`AideTradComponent`
- `UsersModule` en lazy loading

---

### Phase 3 — Extraction vers `@soliguide/common-angular`

**Durée estimée** : 1 jour  
**Prérequis** : Phase 2  
**Risque** : Moyen — restructuration de la lib partagée

**Objectif** : Identifier et déplacer dans `@soliguide/common-angular` les éléments qui seront utilisés par les deux applications.

#### Éléments à déplacer dans `@soliguide/common-angular`

| Élément                                          | Source actuelle                             | Justification                        |
| ------------------------------------------------ | ------------------------------------------- | ------------------------------------ |
| `SharedModule` (pipes + directives + composants) | `frontend/src/app/modules/shared/`          | Utilisé par les deux apps            |
| `AuthService`                                    | `frontend/src/app/modules/users/services/`  | Requis par les deux apps             |
| `UsersService`                                   | `frontend/src/app/modules/users/services/`  | Requis par les deux apps             |
| `JwtInterceptor`                                 | `frontend/src/app/interceptors/`            | Identique dans les deux apps         |
| `ServerErrorInterceptor`                         | `frontend/src/app/interceptors/`            | Identique dans les deux apps         |
| `LanguageGuard`                                  | `frontend/src/app/guards/`                  | Requis par les deux apps             |
| `AuthGuard`                                      | `frontend/src/app/guards/`                  | Requis par les deux apps             |
| `ThemeService`                                   | `frontend/src/app/modules/shared/services/` | Configuration partagée               |
| `THEME_CONFIGURATION` (models/themes/)           | `frontend/src/app/models/themes/`           | Référencé partout                    |
| `CustomLoaderTranslate`                          | `frontend/src/app/shared/`                  | Identique dans les deux apps         |
| `registerLocales`                                | `frontend/src/app/shared/`                  | Identique dans les deux apps         |
| Modèles partagés (`Place`, `ApiError`, etc.)     | `frontend/src/app/models/`                  | Si pas déjà dans `@soliguide/common` |

#### Étapes

1. Pour chaque élément, vérifier s'il existe déjà dans `@soliguide/common` ou `@soliguide/common-angular`.
2. Déplacer les éléments absents dans `@soliguide/common-angular` avec les exports appropriés.
3. Mettre à jour les imports dans `frontend/` pour pointer vers `@soliguide/common-angular`.
4. Compiler et tester `@soliguide/common-angular` puis `@soliguide/frontend`.

#### Livrables

- `@soliguide/common-angular` enrichi avec les éléments partagés
- `frontend/` utilise les imports depuis `@soliguide/common-angular` pour les éléments partagés

---

### Phase 4 — Création de la structure du back-office

**Durée estimée** : 1 jour  
**Prérequis** : Phases 1, 2, 3  
**Risque** : Faible — création de nouveaux fichiers

**Objectif** : Mettre en place la structure complète du package `backoffice` avec son `AppModule`, son routing et sa configuration.

#### Étapes

1. **Créer `backoffice/src/app/app.module.ts`** :

   ```typescript
   @NgModule({
     imports: [
       BrowserModule,
       BrowserAnimationsModule,
       CommonModule,
       FontAwesomeModule,
       FormsModule,
       ReactiveFormsModule,
       HttpClientModule,
       NgbModule,
       SharedModule,         // depuis @soliguide/common-angular
       AnalyticsModule,
       ToastrModule.forRoot({...}),
       TranslateModule.forRoot({...}),
       BackofficeRoutingModule,
     ],
     providers: [
       { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
       { provide: HTTP_INTERCEPTORS, useClass: ServerErrorInterceptor, multi: true },
       { provide: APP_INITIALIZER, useFactory: initializeTranslate, ... },
     ],
     bootstrap: [AppComponent],
   })
   export class BackofficeAppModule {}
   ```

2. **Créer `backoffice/src/app/backoffice-routing.module.ts`** avec les routes back-office :

   - `/manage-place`, `/admin-place`, `/admin-users`, `/organisations`
   - `/campaign`, `/translations`, `/soligare`, `/historique`
   - `/aide`, `/aide-trad`
   - Routes de login/logout

3. **Créer les environnements** `backoffice/src/environments/` :

   - Même structure que `frontend/src/environments/`
   - `apiUrl`, `locationApiUrl`, `posthogUrl`, etc.

4. **Configurer `angular.json`** pour le package backoffice :

   - Configurations `fr`, `es`, `ad` (selon besoin)
   - Assets, styles, polyfills

5. **Créer le `NavComponent` back-office** (nav différent de la nav publique).

6. **Créer le `FooterComponent` back-office** si différent.

7. **Créer `AppComponent` back-office** avec la structure de layout appropriée (sidebar admin, etc.).

#### Livrables

- Application backoffice qui compile et affiche une page d'accueil
- Routing configuré avec toutes les routes admin en lazy loading

---

### Phase 5 — Migration des modules back-office

**Durée estimée** : 3 jours  
**Prérequis** : Phase 4  
**Risque** : Élevé — déplacement de code métier

**Objectif** : Déplacer un par un les modules back-office depuis `frontend/` vers `backoffice/`.

**Ordre de migration** (du moins dépendant au plus dépendant) :

#### 5.1 — Modules sans dépendances internes (Jour 1)

| Ordre | Module               | Complexité                                          |
| ----- | -------------------- | --------------------------------------------------- |
| 1     | `manage-common`      | Faible — 0 dépendance interne                       |
| 2     | `campaign-shared`    | Faible — dépend seulement de `SharedModule`         |
| 3     | `admin-place-shared` | Moyenne — dépend de `PlaceModule` et `SharedModule` |

Pour chaque module :

1. Copier le dossier vers `packages/backoffice/src/app/modules/`
2. Mettre à jour tous les chemins d'import
3. Vérifier la compilation du backoffice

#### 5.2 — Modules place et users (Jour 1/2)

| Ordre | Module  | Complexité                                  |
| ----- | ------- | ------------------------------------------- |
| 4     | `place` | Haute — après correction CP-01, sera propre |
| 5     | `users` | Haute — nécessite CP-02 résolu              |

**Note importante** : `PlaceModule` reste aussi dans `frontend/` pour la partie publique. Il sera présent dans les deux packages. La source de vérité reste `frontend/` jusqu'à ce qu'un package `@soliguide/common-angular` soit suffisamment enrichi pour l'héberger. À terme, `PlaceModule` sera extrait dans `@soliguide/common-angular`.

#### 5.3 — Modules admin métier (Jour 2)

| Ordre | Module               | Complexité                                       |
| ----- | -------------------- | ------------------------------------------------ |
| 6     | `form-place`         | Haute — grand module avec beaucoup de composants |
| 7     | `admin-organisation` | Haute — dépend de `form-place` et `users`        |
| 8     | `admin-users`        | Moyenne — dépend de `admin-place-shared`         |

#### 5.4 — Modules fonctionnels avancés (Jour 3)

| Ordre | Module                  | Complexité                                             |
| ----- | ----------------------- | ------------------------------------------------------ |
| 9     | `admin-place`           | Haute — module dashboard principal                     |
| 10    | `place-changes`         | Moyenne                                                |
| 11    | `campaign`              | Haute — dépend de `form-place` et `admin-place-shared` |
| 12    | `translations`          | Moyenne                                                |
| 13    | `soligare`              | Moyenne                                                |
| 14    | `aide` (nouveau module) | Faible — résultat de CP-05                             |

#### Pour chaque module, appliquer la procédure :

```
1. Copier src/app/modules/<module>/ → packages/backoffice/src/app/modules/<module>/
2. Mettre à jour les imports relatifs
3. Référencer les dépendances depuis @soliguide/common-angular
4. Ajouter le module au routing de backoffice
5. yarn build --scope @soliguide/backoffice  (doit compiler)
6. Tests manuels de la fonctionnalité migrée
```

#### Livrables

- Tous les modules back-office présents dans `packages/backoffice/`
- Application backoffice fonctionnelle en dev local
- Tests unitaires migrés et verts

---

### Phase 6 — Nettoyage du frontend public

**Durée estimée** : 1 jour  
**Prérequis** : Phase 5 complète et validée  
**Risque** : Moyen — suppression de code

**Objectif** : Retirer du package `frontend/` tout le code qui a migré vers `backoffice/`.

#### Étapes

1. **Supprimer les modules migrés** de `frontend/src/app/modules/` :

   - `admin-place/`
   - `admin-place-shared/`
   - `admin-organisation/`
   - `admin-users/`
   - `form-place/`
   - `campaign/`
   - `campaign-shared/`
   - `translations/`
   - `soligare/`
   - `place-changes/`
   - `manage-common/`

2. **Supprimer les guards back-office** de `frontend/src/app/guards/` :

   - `pro.guard.ts`
   - `admin-soliguide.guard.ts`
   - `translator-soliguide.guard.ts`
   - `campaign.guard.ts`
   - `pending-changes.guard.ts`
   - `can-create.guard.ts`
   - `can-edit.guard.ts`
   - `can-read-change.guard.ts`

3. **Nettoyer `app-routing.module.ts`** : supprimer toutes les routes admin.

4. **Nettoyer `app.module.ts`** : supprimer les imports des modules migrés.

5. **Supprimer les modèles back-office** :

   - `models/campaign/`
   - `models/manage-search/`
   - `models/place-changes/`

6. **Analyser le bundle frontend public** :

   ```bash
   yarn workspace @soliguide/frontend analyze
   ```

   Vérifier que le bundle a significativement diminué.

7. **Lancer les tests** :

   ```bash
   yarn workspace @soliguide/frontend test
   ```

8. **Tests E2E** sur les parcours publics clés :
   - Recherche de lieu
   - Affichage d'une fiche lieu
   - Navigation sur la page d'accueil
   - Pages statiques

#### Livrables

- `frontend/` sans aucun code back-office
- Bundle public allégé (mesure avant/après)
- Tests verts

---

### Phase 7 — Infrastructure et déploiement

**Durée estimée** : 1.5 jours  
**Prérequis** : Phases 5 et 6  
**Risque** : Élevé — changements d'infrastructure

**Objectif** : Mettre en production les deux applications sur des serveurs distincts.

#### 7.1 — Configuration serveur (Caddy / Nginx)

1. **Définir les domaines** :

   - `soliguide.fr` → frontend public
   - `admin.soliguide.fr` (ou `pro.soliguide.fr`) → back-office

2. **Configurer Caddy** pour chaque domaine :

   - Servir les fichiers statiques Angular
   - Redirection `/*` vers `index.html` (SPA routing)
   - Headers de sécurité (CSP, HSTS)

3. **Variables d'environnement** distinctes par application :
   - Backoffice peut avoir des URLs API différentes si nécessaire
   - Configuration PostHog séparée (tracking distinct)
   - Sentry projets distincts

#### 7.2 — CI/CD

1. **Créer des pipelines distincts** :

   - Pipeline `frontend` : build + test + deploy `@soliguide/frontend`
   - Pipeline `backoffice` : build + test + deploy `@soliguide/backoffice`

2. **Optimiser les builds** : chaque pipeline ne rebuilde que son package et ses dépendances (Nx affected).

3. **Tests E2E distincts** :
   - Frontend : parcours public (Playwright ou Cypress)
   - Backoffice : parcours admin (authentification, CRUD lieux)

#### 7.3 — Authentification cross-domain

**Point critique** : Si le frontend public propose un lien "Se connecter" qui redirige vers le back-office, ou si un utilisateur connecté sur le public doit accéder au back-office, il faut gérer le partage de session JWT.

**Options** :

- **Cookies partagés** sur le domaine parent (`.soliguide.fr`) — nécessite HTTPS et configuration `SameSite`
- **Redirect avec token** — l'app publique redirige vers le backoffice avec un token temporaire
- **SSO** — solution plus robuste à long terme

**Recommandation** : Cookies partagés sur `.soliguide.fr` pour la phase initiale.

#### Livrables

- Deux URL distinctes en production
- CI/CD distinct pour chaque application
- Documentation de déploiement mise à jour

---

## 6. Tableau de bord des risques

| Risque                                        | Probabilité | Impact | Mitigation                                   |
| --------------------------------------------- | ----------- | ------ | -------------------------------------------- |
| Régression sur `PlaceModule` (CP-01)          | Haute       | Élevé  | Tests unitaires exhaustifs avant/après       |
| Problème JWT cross-domain (Phase 7)           | Moyenne     | Élevé  | Prototyper en staging avant prod             |
| `UsersModule` en lazy loading (CP-07)         | Moyenne     | Moyen  | Tester tous les flux auth en dev             |
| Build cassé lors de la migration des modules  | Haute       | Faible | Migration module par module avec build check |
| Oubli d'un import lors du nettoyage (Phase 6) | Haute       | Faible | TypeScript strict mode + tests               |
| Performance dégradée backoffice               | Faible      | Faible | Lazy loading de tous les modules             |

---

## 7. Chronologie indicative

| Semaine   | Phases                    | Résultat                                          |
| --------- | ------------------------- | ------------------------------------------------- |
| Semaine 1 | Phase 0 + Phase 1         | Backoffice initialisé, CP-01 résolu               |
| Semaine 2 | Phase 2 + Phase 3         | Tous les couplages corrigés, lib commune enrichie |
| Semaine 3 | Phase 4 + Phase 5 (début) | Structure backoffice + premiers modules migrés    |
| Semaine 4 | Phase 5 (fin) + Phase 6   | Migration complète + frontend nettoyé             |
| Semaine 5 | Phase 7                   | Infrastructure et déploiement                     |

**Total estimé** : 5 semaines, ~10 jours de développement effectif

---

## 8. Définition de "done"

Le découplage est considéré terminé quand :

- [ ] `yarn build --scope @soliguide/frontend` ne contient aucun import depuis un module back-office
- [ ] `yarn build --scope @soliguide/backoffice` compile correctement
- [ ] `yarn workspace @soliguide/frontend analyze` montre un bundle réduit d'au moins 40% vs l'état initial
- [ ] Les tests unitaires passent dans les deux packages
- [ ] Les deux applications sont déployées sur des domaines distincts
- [ ] Un utilisateur anonyme sur le frontend public ne charge aucun code back-office
- [ ] Un administrateur peut accéder à toutes les fonctionnalités admin depuis le backoffice
- [ ] Le JWT est correctement partagé entre les deux domaines

---

## 9. Architecture cible

```
packages/
├── frontend/          ← @soliguide/frontend (public uniquement)
│   └── src/app/
│       ├── modules/
│       │   ├── general/        (home, nav, footer, contact)
│       │   ├── search/
│       │   ├── place-page/
│       │   ├── place/          (display components)
│       │   ├── static-pages/
│       │   ├── search-bar/
│       │   └── users/          (login, signup — lazy loaded)
│       └── guards/
│           ├── language.guard.ts
│           ├── auth.guard.ts
│           └── not-auth.guard.ts
│
├── backoffice/        ← @soliguide/backoffice (admin/pro uniquement)
│   └── src/app/
│       ├── modules/
│       │   ├── admin-place/
│       │   ├── admin-place-shared/
│       │   ├── admin-organisation/
│       │   ├── admin-users/
│       │   ├── form-place/
│       │   ├── campaign/
│       │   ├── campaign-shared/
│       │   ├── translations/
│       │   ├── soligare/
│       │   ├── place-changes/
│       │   ├── manage-common/
│       │   ├── place/          (copie ou import depuis common-angular)
│       │   └── aide/           (pages d'aide — extrait de general)
│       └── guards/
│           ├── language.guard.ts  (depuis common-angular)
│           ├── auth.guard.ts      (depuis common-angular)
│           ├── pro.guard.ts
│           ├── admin-soliguide.guard.ts
│           ├── translator-soliguide.guard.ts
│           ├── campaign.guard.ts
│           └── pending-changes.guard.ts
│
└── common-angular/    ← @soliguide/common-angular (enrichi)
    └── src/
        ├── modules/
        │   ├── shared/         (pipes, directives, composants UI communs)
        │   └── analytics/
        ├── services/
        │   ├── auth.service.ts
        │   └── users.service.ts
        ├── interceptors/
        │   ├── jwt.interceptor.ts
        │   └── server-error.interceptor.ts
        └── guards/
            ├── language.guard.ts
            └── auth.guard.ts
```
