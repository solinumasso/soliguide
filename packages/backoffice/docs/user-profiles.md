# Profils utilisateurs du backoffice

## Vue d'ensemble

Le backoffice Soliguide distingue deux dimensions pour déterminer les droits d'un utilisateur :

- **`UserStatus`** : la catégorie globale du compte (qui est-il ?)
- **`UserRole`** : son rôle au sein d'une organisation spécifique (que peut-il faire dans cette orga ?)

La propriété calculée `user.admin` vaut `true` pour `ADMIN_TERRITORY` et `ADMIN_SOLIGUIDE`.

---

## 1. Statuts utilisateurs (`UserStatus`)

| Statut            | Description                                      | Accès backoffice                              |
| ----------------- | ------------------------------------------------ | --------------------------------------------- |
| `SIMPLE_USER`     | Compte standard non-professionnel                | Connexion uniquement, aucun accès fonctionnel |
| `VOLUNTEER`       | Bénévole                                         | Connexion uniquement, aucun accès fonctionnel |
| `API_USER`        | Partenaire API                                   | Connexion uniquement                          |
| `WIDGET_USER`     | Utilisateur widget embarqué                      | Connexion uniquement                          |
| `SOLI_BOT`        | Bot interne Soliguide                            | Usage technique                               |
| `PRO`             | Compte professionnel rattaché à une organisation | Accès gestion fiches et organisation          |
| `ADMIN_TERRITORY` | Administrateur d'un territoire                   | Accès admin sur son territoire                |
| `ADMIN_SOLIGUIDE` | Administrateur Soliguide global                  | Accès complet                                 |

---

## 2. Rôles au sein d'une organisation (`UserRole`)

S'applique uniquement aux utilisateurs `PRO`. Défini par organisation.

| Rôle     | Description                    | Peut créer une fiche | Peut éditer une fiche      |
| -------- | ------------------------------ | -------------------- | -------------------------- |
| `OWNER`  | Propriétaire de l'organisation | ✅                   | ✅                         |
| `EDITOR` | Éditeur                        | ❌                   | ✅ (uniquement ses fiches) |
| `READER` | Lecteur                        | ❌                   | ❌                         |

---

## 3. Statut de vérification (`UserRightStatus`)

Un utilisateur `PRO` doit avoir `user.verified === true` pour accéder aux routes protégées par `ProGuard`. Un compte non vérifié (`PENDING`) voit son accès bloqué même s'il est PRO.

| Valeur     | Signification                            |
| ---------- | ---------------------------------------- |
| `VERIFIED` | Compte validé, accès autorisé            |
| `PENDING`  | En attente de vérification, accès bloqué |

---

## 4. Guards et conditions d'accès

| Guard                      | Condition                                                  | Utilisé sur                                                |
| -------------------------- | ---------------------------------------------------------- | ---------------------------------------------------------- |
| `AuthGuard`                | Utilisateur connecté                                       | La majorité des routes                                     |
| `ProGuard`                 | `verified` ET (`admin` OU `PRO`)                           | Historique, fiches, utilisateurs, organisations, campagnes |
| `AdminSoliguideGuard`      | `admin` (TERRITORY ou SOLIGUIDE)                           | Soligare, gestion utilisateurs, recherche admin            |
| `CanCreateGuard`           | `admin` OU `role === OWNER`                                | Création de fiche                                          |
| `CanEditGuard`             | Vérifié via API (`placeService.canEditPlace`)              | Édition de fiche spécifique                                |
| `TranslatorSoliguideGuard` | `user.translator === true`                                 | Module traductions                                         |
| `CampaignGuard`            | Accès validé par API pour le contexte (lieu / orga / user) | Routes campagne                                            |
| `NotAuthGuard`             | Utilisateur NON connecté                                   | Connexion, inscription                                     |
| `LanguageGuard`            | Langue valide dans l'URL                                   | Toutes les routes `/:lang/…`                               |

---

## 5. Matrice d'accès par profil

### Légende

- ✅ Accès complet
- ✅ (restreint) Accès partiel selon contexte
- ❌ Accès refusé
- — Non applicable

| Fonctionnalité                 | PRO READER     | PRO EDITOR     | PRO OWNER | ADMIN_TERRITORY    | ADMIN_SOLIGUIDE |
| ------------------------------ | -------------- | -------------- | --------- | ------------------ | --------------- |
| Consulter les fiches           | ✅             | ✅             | ✅        | ✅                 | ✅              |
| Éditer une fiche               | ❌             | ✅ (restreint) | ✅        | ✅                 | ✅              |
| Créer une fiche                | ❌             | ❌             | ✅        | ✅                 | ✅              |
| Voir son organisation          | ✅             | ✅             | ✅        | —                  | —               |
| Gérer son organisation         | ❌             | ❌             | ✅        | ✅                 | ✅              |
| Gérer toutes les organisations | ❌             | ❌             | ❌        | ✅                 | ✅              |
| Voir l'historique d'une fiche  | ✅             | ✅             | ✅        | ✅                 | ✅              |
| Gérer l'historique (global)    | ❌             | ❌             | ❌        | ✅                 | ✅              |
| Gérer les utilisateurs         | ❌             | ❌             | ❌        | ✅                 | ✅              |
| Gérer les partenaires API      | ❌             | ❌             | ❌        | ✅                 | ✅              |
| Participer à une campagne      | ✅ (restreint) | ✅             | ✅        | ✅                 | ✅              |
| Gérer les emails de campagne   | ❌             | ❌             | ❌        | ✅                 | ✅              |
| Accès traductions              | ❌             | ❌             | ❌        | ✅ (si traducteur) | ✅              |
| Suivi des traductions          | ❌             | ❌             | ❌        | ❌                 | ✅              |
| Accès Soligare                 | ❌             | ❌             | ❌        | ❌                 | ✅              |
| Inviter des membres            | ❌             | ❌             | ✅        | ✅                 | ✅              |

---

## 6. Comportement de la page d'accueil par profil

### Problème actuel

La page d'accueil redirige vers `/:lang/manage-place`. Cette page est protégée par `ProGuard`, ce qui signifie qu'un utilisateur `SIMPLE_USER`, `VOLUNTEER`, ou un `PRO` non vérifié est bloqué dès l'arrivée.

### Proposition : dashboard d'accueil avec cartes

Plutôt qu'une redirection directe vers `manage-place`, créer une page `/:lang/dashboard` accessible à tout utilisateur connecté, affichant dynamiquement des cartes selon le profil.

---

## 7. Cartes dashboard par profil

### PRO READER

| Carte             | Destination                | Condition d'affichage |
| ----------------- | -------------------------- | --------------------- |
| Mes fiches        | `/:lang/manage-place`      | `PRO`                 |
| Mon organisation  | `/:lang/organisations/:id` | `PRO` avec 1 orga     |
| Campagne en cours | `/:lang/campaign`          | Campagne active       |
| Mon compte        | `/:lang/user/my-account`   | Toujours              |

### PRO EDITOR

Tout ce que voit READER, plus :

| Carte                    | Destination                | Condition d'affichage |
| ------------------------ | -------------------------- | --------------------- |
| Modifier une fiche       | `/:lang/admin-place/infos` | `EDITOR`              |
| Historique de mes fiches | `/:lang/historique`        | `PRO`                 |

### PRO OWNER

Tout ce que voit EDITOR, plus :

| Carte                  | Destination                | Condition d'affichage |
| ---------------------- | -------------------------- | --------------------- |
| Créer une fiche        | `/:lang/admin-place/infos` | `OWNER`               |
| Gérer mon organisation | `/:lang/organisations/:id` | `OWNER`               |
| Inviter des membres    | (modal ou page dédiée)     | `OWNER`               |

### ADMIN_TERRITORY

| Carte                   | Destination                  | Condition d'affichage |
| ----------------------- | ---------------------------- | --------------------- |
| Gérer les structures    | `/:lang/manage-place/search` | `admin`               |
| Créer une structure     | `/:lang/admin-place/infos`   | `admin`               |
| Gérer les utilisateurs  | `/:lang/admin-users/manage`  | `admin`               |
| Gérer les organisations | `/:lang/organisations`       | `admin`               |
| Historique              | `/:lang/historique/manage`   | `admin`               |
| Campagne en cours       | `/:lang/campaign`            | Campagne active       |
| Traductions             | `/:lang/translations`        | `translator`          |
| Mon compte              | `/:lang/user/my-account`     | Toujours              |

### ADMIN_SOLIGUIDE

Tout ce que voit ADMIN_TERRITORY, plus :

| Carte                     | Destination                           | Condition d'affichage      |
| ------------------------- | ------------------------------------- | -------------------------- |
| Soligare                  | `/:lang/soligare`                     | `ADMIN_SOLIGUIDE` + config |
| Gérer les partenaires API | `/:lang/admin-users/manage-api-users` | `admin`                    |
| Emails de campagne        | `/:lang/manage-emails/templates`      | `admin` + campagne active  |
| Suivi des traductions     | `/:lang/translations/places`          | `admin`                    |

### Utilisateur non vérifié / SIMPLE_USER / VOLUNTEER

Page d'accueil minimaliste :

| Carte              | Destination              | Condition d'affichage                                                       |
| ------------------ | ------------------------ | --------------------------------------------------------------------------- |
| Mon compte         | `/:lang/user/my-account` | Toujours                                                                    |
| Message informatif | —                        | Si `PRO` non vérifié : expliquer que le compte est en attente de validation |

---

## 8. Règles de redirection depuis `/:lang`

| Situation                                        | Redirection                                            |
| ------------------------------------------------ | ------------------------------------------------------ |
| Non connecté                                     | `/:lang/connexion?returnUrl=/:lang`                    |
| Connecté, `ADMIN_SOLIGUIDE` ou `ADMIN_TERRITORY` | `/:lang/dashboard`                                     |
| Connecté, `PRO` vérifié                          | `/:lang/dashboard`                                     |
| Connecté, `PRO` non vérifié                      | `/:lang/dashboard` (avec message de compte en attente) |
| Connecté, autre statut                           | `/:lang/dashboard` (carte unique : Mon compte)         |

> **Note :** La page `/:lang/dashboard` est la cible recommandée. Elle remplace le comportement actuel qui redirige vers `/:lang/manage-place` (inaccessible pour les non-PRO).

---

## 9. Fichiers de référence

| Fichier                                                                       | Rôle                                                                |
| ----------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| `packages/common/src/users/enums/`                                            | `UserStatus`, `UserRole`, `UserRightStatus`                         |
| `packages/backoffice/src/app/modules/users/classes/user.class.ts`             | Classe `User` avec propriétés dérivées (`admin`, `pro`, `verified`) |
| `packages/backoffice/src/app/modules/users/services/auth.service.ts`          | `currentUserValue`, `isAuth()`, `logoutAndRedirect()`               |
| `packages/backoffice/src/app/guards/`                                         | Tous les guards avec leurs conditions                               |
| `packages/backoffice/src/app/modules/general/components/nav/nav.component.ts` | Logique d'affichage conditionnel de la nav                          |
| `packages/backoffice/src/app/app-routing.module.ts`                           | Routes et guards associés                                           |
