# Lancement de l'API publique Soliguide

> **Date de mise à disposition** : _à confirmer_ > **Fin de support de l'API actuelle (`https://api.soliguide.fr`)** : _à confirmer_ > **Contact** : api@solinum.org

## À qui s'adresse ce document

Aux intégrateurs qui consomment déjà l'API Solidarité (`https://api.soliguide.fr`) sous convention partenariale avec Solinum — Eurométropole de Strasbourg (OD@CiT), Résorption Bidonvilles (DIHAL), A'urba, Entourage, et autres partenaires existants. Vous trouverez ici ce qui change, pourquoi, et comment migrer.

## En bref

Une nouvelle API publique remplace progressivement les endpoints `/new-search` et `/place/:lieu_id`. Elle formalise sous un contrat OpenAPI versionné la transition déjà engagée dans la doc actuelle (champs marqués `@new` / `@deprecated`), enrichit les filtres et expose une documentation interactive directement servie par le service.

## Pourquoi cette nouvelle API

- **Contrat formel et versionné** — schéma OpenAPI complet, première version `2026-01-01`. Les évolutions futures n'impacteront pas les versions précédentes.
- **Documentation interactive intégrée** — Scalar exposé à `/api/docs`, sans dépendre d'une page Notion externe.
- **Filtres et options enrichis** — nouveaux filtres de modalité (PMR, animal, payant, langue des signes), tri configurable, recherche multi-zones.
- **Nettoyage progressif des champs hérités** — les champs marqués `@deprecated` dans la doc actuelle sont signalés explicitement dans le schéma et seront supprimés dans une version future.

## Endpoint et authentification

| Aspect        | Avant                        | Après                                           |
| ------------- | ---------------------------- | ----------------------------------------------- |
| Base URL      | `https://api.soliguide.fr`   | _à confirmer_                                   |
| Recherche     | `POST /new-search`           | `POST /search`                                  |
| Auth          | `Authorization: JWT <token>` | **Inchangée** : `JWT <token>`                   |
| Documentation | Notion (lien partagé)        | `/api/docs` (Scalar), `/openapi/<version>.json` |

Le token JWT reste celui fourni par Solinum à la signature de la convention partenariale.

## Modèles actuels — référence (legacy)

Pour rappel, voici les schémas tels que vous les connaissez aujourd'hui sur `https://api.soliguide.fr`. Les correspondances avec la nouvelle API figurent dans la colonne **Nouveau**.

### Corps de requête `POST /new-search`

| Champ                       | Type                   | Obligatoire           | Description (legacy)                                                          | Nouveau                                                                      |
| --------------------------- | ---------------------- | --------------------- | ----------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| `location`                  | object                 | ✓                     | Contrainte géographique principale                                            | Inchangé (+ `locations[]` pour multi-zones)                                  |
| `location.geoType`          | string                 | ✓                     | `pays \| region \| departement \| ville \| codePostal \| position`            | Idem + `citiesGroup`, `inconnu`                                              |
| `location.geoValue`         | string                 | selon `geoType`       | Slug ou code de la zone                                                       | Idem ; restreint à `fr \| es \| ad` si `geoType=pays`                        |
| `location.coordinates`      | `[number, number]`     | si `geoType=position` | `[lng, lat]`                                                                  | Inchangé                                                                     |
| `location.distance`         | number                 | —                     | Rayon en km (défaut 10)                                                       | Inchangé                                                                     |
| `category`                  | string                 | —                     | Slug d'une catégorie (les enfants sont inclus)                                | Inchangé                                                                     |
| `categories`                | `string[] \| number[]` | —                     | Slugs ou IDs numériques (legacy)                                              | **Slugs uniquement** (numériques refusés)                                    |
| `options.page`              | number                 | —                     | Défaut `1`                                                                    | Inchangé                                                                     |
| `options.limit`             | number                 | —                     | Défaut **`20`**                                                               | Défaut **`10`**                                                              |
| `options.fields`            | string                 | —                     | Liste séparée par espaces (`"lieu_id name"`)                                  | Inchangé                                                                     |
| `openToday`                 | boolean                | —                     | Au moins un service ouvert aujourd'hui                                        | Inchangé                                                                     |
| `updatedAt.value`           | string                 | —                     | Format **`YYYY/MM/DD HH:mm`**                                                 | Format **ISO 8601**                                                          |
| `updatedAt.intervalType`    | enum                   | —                     | `SPECIFIC_DAY \| BEFORE_DAY \| AFTER_DAY`                                     | Inchangé                                                                     |
| `publics.age`               | number                 | —                     | Âge ciblé (entier)                                                            | Objet `{ min, max }` (0–99)                                                  |
| `publics.gender`            | string[]               | —                     | `men`, `women`                                                                | Inchangé                                                                     |
| `publics.administrative`    | string[]               | —                     | `regular`, `asylum`, `refugee`, `undocumented`                                | Inchangé                                                                     |
| `publics.familialle`        | string[]               | —                     | `isolated`, `family`, `couple`, `pregnant`                                    | Inchangé (typo `familialle` conservée)                                       |
| `publics.other`             | string[]               | —                     | `violence`, `addiction`, `handicap`, `lgbt+`, `hiv`, `prostitution`, `prison` | Inchangé                                                                     |
| `publics.accueil`           | `0 \| 1 \| 2`          | —                     | Inconditionnel / préférentiel / exclusif                                      | Enum `unconditional \| preferential \| exclusive`                            |
| `modalities.appointment`    | boolean                | —                     | Sur rendez-vous                                                               | Inchangé                                                                     |
| `modalities.inscription`    | boolean                | —                     | Inscription préalable requise                                                 | Inchangé                                                                     |
| `modalities.orientation`    | boolean                | —                     | Orientation requise                                                           | Inchangé                                                                     |
| `modalities.inconditionnel` | boolean                | —                     | Accès inconditionnel (override les autres modalités)                          | Inchangé                                                                     |
| _(nouveau)_                 |                        |                       |                                                                               | `modalities.animal`, `modalities.pmr`, `modalities.price`, `modalities.sign` |
| _(nouveau)_                 |                        |                       |                                                                               | `options.sortBy`, `options.sortValue`                                        |
| _(nouveau)_                 |                        |                       |                                                                               | `placeType` (`PLACE` \| `ITINERARY`)                                         |
| `word`                      | string                 | —                     | Recherche texte par nom de structure                                          | Inchangé                                                                     |

### Réponse `POST /new-search` — top-level

```json
{ "nbResults": number, "places": Place[] }
```

Cette structure est **inchangée** dans la nouvelle API.

### Objet `Place` (réponse `GET /place/:lieu_id` et items de `places[]`)

| Champ            | Type        | Description (legacy)                                                | Nouveau                                 |
| ---------------- | ----------- | ------------------------------------------------------------------- | --------------------------------------- |
| `lieu_id`        | number      | Identifiant unique du lieu                                          | Inchangé                                |
| `name`           | string      | Nom du lieu                                                         | Inchangé                                |
| `status`         | enum        | `DRAFT \| ONLINE \| OFFLINE \| CLOSED` (OFFLINE = >6 mois sans MAJ) | Inchangé                                |
| `position`       | object      | Bloc adresse + coordonnées                                          | Voir ci-dessous                         |
| `services_all`   | `Service[]` | Services proposés par le lieu                                       | Inchangé (voir détail Service plus bas) |
| `sources`        | `Source[]`  | Sources d'origine du référencement                                  | Inchangé                                |
| `closedHolidays` | enum        | `UNKNOWN \| OPEN \| CLOSED`                                         | Inchangé                                |
| `sourceLanguage` | string      | Langue d'origine de la donnée (ISO 639-3)                           | Inchangé                                |
| `country`        | string      | Code pays ISO 3166-1 alpha-2                                        | Restreint à `fr \| es \| ad`            |
| `languages`      | string[]    | Langues parlées (ISO 639-3)                                         | Inchangé                                |
| `createdAt`      | date        | Date de création                                                    | Inchangé                                |
| `updatedAt`      | date        | Date de dernière mise à jour                                        | Inchangé                                |

### Sous-objet `position`

| Champ legacy (FR)                  | Statut        | Sous-objet `position` (nouveau, EN) | Notes                                                |
| ---------------------------------- | ------------- | ----------------------------------- | ---------------------------------------------------- |
| `adresse`                          | `@deprecated` | `address`                           | Alias conservé en `2026-01-01`, suppression annoncée |
| `codePostal`                       | `@deprecated` | `postalCode`                        | Alias conservé en `2026-01-01`, suppression annoncée |
| `complementAdresse`                | `@deprecated` | `additionalInformation`             | Alias conservé en `2026-01-01`, suppression annoncée |
| `departement`                      | `@deprecated` | `department`                        | Alias conservé en `2026-01-01`, suppression annoncée |
| `departementCode`                  | `@deprecated` | `departmentCode`                    | Ex : `974`, `2A`, `91`, `06`                         |
| `pays`                             | `@deprecated` | `country`                           | Désormais restreint à `fr \| es \| ad`               |
| `ville`                            | `@deprecated` | `city`                              | Alias conservé en `2026-01-01`, suppression annoncée |
| —                                  |               | `cityCode`                          | Code administratif de la ville                       |
| —                                  |               | `region`                            |                                                      |
| —                                  |               | `regionCode`                        |                                                      |
| —                                  |               | `timeZone`                          | Format IANA (`Europe/Paris`, etc.)                   |
| `location` (`{coordinates, type}`) | conservé      | `location` (`{coordinates, type}`)  | GeoJSON Point inchangé                               |

### Objet `Service`

| Champ legacy                                  | Statut        | Champ équivalent (nouveau)                            |
| --------------------------------------------- | ------------- | ----------------------------------------------------- |
| `categorie: Number`                           | `@deprecated` | `category: string` (slug)                             |
| `categorie` (IDs numériques en entrée filtre) | `@deprecated` | Slugs uniquement                                      |
| `services_all[].name`                         | `@deprecated` | Migré dans `categorySpecificFields` (voir ci-dessous) |
| `services_all[].jobsList`                     | `@deprecated` | `categorySpecificFields.jobsList`                     |
| `category`                                    | `@new`        | Slug catégorie, source unique                         |
| `categorySpecificFields`                      | `@new`        | Champs polymorphes selon la catégorie                 |
| `close`                                       | conservé      | Fermeture temporaire (`actif`, dates de début/fin)    |
| `status` (saturation)                         | conservé      | Niveau de saturation                                  |

### `categorySpecificFields` (champs polymorphes par catégorie)

Champ optionnel sur chaque `Service`, dépend de la catégorie. Liste résumée :

| Champ                          | Type   | Catégories cibles                                                                                                     |
| ------------------------------ | ------ | --------------------------------------------------------------------------------------------------------------------- |
| `activityName`                 | string | `sport_activities`, `other_activities`                                                                                |
| `availableEquipmentType`       | enum[] | `shared_kitchen` (`oven`, `microwaves`, `dishwasher`, `cutlery`, `kettle`, `pans`, `frying_pan`, `strainer`, `other`) |
| `availableEquipmentPrecisions` | string | `shared_kitchen` si `other`                                                                                           |
| `babyParcelAgeType`            | enum[] | `baby_parcel` (`under_six_months`, `between_6_and_12_months`, `between_12_and_18_months`, `over_18_months`)           |
| `canteensMealType`             | enum   | `seated_catering` (`petitdej`, `collation`, `boisson`, `dejeuner`, `diner`)                                           |
| `courseType`                   | enum   | `french_course` (`alphabetisation`, `asl`, `fle`)                                                                     |
| `degreeOfChoiceType`           | enum   | Services food (`free_choice`, `accompagnied_choice`, `no_choice`)                                                     |
| `dietaryAdaptationsType`       | enum[] | Food (`vegetarian`, `halal`, `gluten_free`, `salt_free`, `kosher`, `lactose_free`)                                    |
| `dietaryRegimesType`           | enum   | Food (`we_adapt`, `try_to_adapt`)                                                                                     |
| `domiciliationType`            | enum   | `domiciliation` (`domi1` droit commun, `domi2` réfugiés, `domi4` boîte postale)                                       |
| `foodProductType`              | enum[] | `food_packages`, `social_grocery_stores`                                                                              |
| `hygieneProductType`           | enum   | `hygiene_products` (`sanitary_materials`, `other_care_products`)                                                      |
| `jobsList`                     | string | `integration_through_economic_activity`                                                                               |
| `mobilityAssistanceName`       | string | `mobility_assistance`                                                                                                 |
| `serviceStyleType`             | enum[] | `food_distribution` (`indoor_seating`, `outdoor_seating`, `take_away`, `delivery`)                                    |
| `voucherType`                  | enum   | `food_voucher` (`food_voucher`, `food_stamp`, `food_cheque`, `other`)                                                 |
| `wellnessActivityName`         | string | `wellness`                                                                                                            |

Les champs de type `string` sont **traduits côté serveur** dans la langue de la requête, les enums sont renvoyés en clés brutes (à traduire côté client).

### Catégories — table de conversion (résumé)

12 catégories racines (slugs en anglais), correspondant aux anciens IDs numériques :

| Slug                       | Label EN                  | Anciens IDs              |
| -------------------------- | ------------------------- | ------------------------ |
| `health`                   | Health                    | 100 + 101–110            |
| `training_and_jobs`        | Training and Employment   | 200 + 201–205            |
| `hygiene_and_wellness`     | Hygiene and Well-being    | 300 + 301–306            |
| `counseling`               | Counseling                | 400 + 401–408            |
| `technology`               | Technology                | 500 + 501–505            |
| `food`                     | Food                      | 600 + 601–605 + 6 `@new` |
| `welcome`                  | Welcome                   | 700 + 701–705            |
| `activities`               | Activities                | 800 + 801–804            |
| `equipment`                | Equipment                 | 900 + 901–904            |
| `health_specialists`       | Specialists               | 1100 + 1101–1122         |
| `mobility`                 | Transportation & Mobility | 1200 + 1201–1204         |
| `accomodation_and_housing` | Housing & Accommodation   | 1300 + 1301–1305         |

> Typos historiques conservées pour compatibilité : `accomodation` (au lieu de `accommodation`), `animal_assitance`, `familialle`.

La table complète slug ↔ ID numérique est exposée dans la doc interactive `/api/docs` (toggle équivalent à celui de la Notion).

## Changements principaux pour les consommateurs

### 1. Codes pays restreints à FR / ES / AD

Seuls les trois pays effectivement couverts par Soliguide sont acceptés : `fr`, `es`, `ad`. Les codes hérités des départements et territoires d'outre-mer (`re`, `gf`, `pf`, `tf`, `gp`, `mq`, `yt`, `bl`, `mf`, `pm`, `wf`) ne sont plus acceptés en entrée — utilisez `fr` qui couvre désormais l'ensemble du territoire français.

### 2. Catégories : slugs uniquement

Les IDs numériques (`101`, `403`, …) ne sont plus acceptés en entrée. Utilisez les slugs anglais (`addiction`, `social_accompaniment`, …). Six nouvelles catégories alimentaires sont disponibles : `solidarity_fridge`, `shared_kitchen`, `cooking_workshop`, `baby_parcel`, `food_voucher`, `community_garden`.

Côté réponse, le champ `services_all[].categorie: Number` est conservé pour cette version mais marqué `deprecated: true` ; utilisez `services_all[].category` (slug).

### 3. Format des dates

`updatedAt.value` passe au format **ISO 8601** (ex. `2026-01-01T00:00:00.000Z`). Le format historique `YYYY/MM/DD HH:mm` n'est plus accepté.

### 4. Filtre âge — objet plage

`publics.age` devient un objet `{ min, max }` (entiers `0`–`99`), au lieu d'un seul nombre. Cela permet d'exprimer une fourchette d'âge.

### 5. Filtre `publics.accueil` — enum

Passe en enum (`unconditional`, `preferential`, `exclusive`), au lieu de `0` / `1` / `2`.

### 6. Nouveaux filtres de modalité

- `modalities.animal` — accepte les animaux
- `modalities.pmr` — accessible PMR (personnes à mobilité réduite)
- `modalities.price` — service payant
- `modalities.sign` — langue des signes

Les anciens (`appointment`, `inscription`, `orientation`, `inconditionnel`) restent inchangés.

### 7. Nouvelles options de tri et pagination

- `options.sortBy` : `createdAt | lieu_id | name | distance | slugs.infos.name | status | updatedAt`
- `options.sortValue` : `1` (ascendant) / `-1` (descendant)
- `options.limit` par défaut : **10** (vs 20 sur l'API actuelle)

### 8. Nouveaux filtres de recherche

- `placeType` : `PLACE` (défaut) ou `ITINERARY` — type de lieu ou parcours
- `locations[]` : recherche multi-zones (par exemple pour un widget)

### 9. Champs d'adresse — alias bilingues, suppression future annoncée

Les champs français des objets `position` (`adresse`, `codePostal`, `complementAdresse`, `departement`, `departementCode`, `pays`, `ville`) sont **conservés en alias** de leurs équivalents anglais (`address`, `postalCode`, `additionalInformation`, `department`, `departmentCode`, `country`, `city`) dans cette version. Ils seront **supprimés dans une version ultérieure** — adaptez votre code dès maintenant aux noms anglais.

### 10. Endpoint `/place/:lieu_id`

À ce jour, la nouvelle API expose **uniquement** `POST /search`. La récupération d'un lieu par `lieu_id` reste à confirmer (suivra dans une version ultérieure ou via paramètre de filtre).

## Documentation interactive

- **Interactive** : `/api/docs` (Scalar) — schémas, exemples, possibilité d'exécuter des appels
- **Spec JSON** : `/openapi/<version>.json`
- **Version actuelle** : `2026-01-01`

Un changelog automatique sera publié à chaque nouvelle version.

## Migration — pas à pas

1. **Pointer** vers la nouvelle URL de base (_à confirmer_)
2. **Remplacer** `/new-search` par `/search`
3. **Mapper** les IDs catégories numériques vers leurs slugs (table de conversion dans Scalar)
4. **Filtrer** uniquement sur `fr`, `es`, `ad` côté `location.country` et `geoValue` quand `geoType=pays`
5. **Migrer** le format `updatedAt.value` vers ISO 8601
6. **Adapter** `publics.age` (objet `{min, max}`) et `publics.accueil` (enum)
7. **Renommer** les champs d'adresse FR → EN côté code de mapping (transition douce, mais à anticiper)
8. **Tester** contre `/api/docs`

L'API actuelle (`https://api.soliguide.fr`) reste disponible pendant la phase de transition.

## Ce qui ne change pas

- Authentification : header `Authorization: JWT <token>`, même token
- Structure top-level de la réponse : `{ nbResults: number, places: Place[] }`
- Structure `services_all[]` pour les services d'un lieu
- Valeurs de `geoType` : restent en français (`pays`, `ville`, `codePostal`, `departement`, `region`, `position`, `citiesGroup`, `inconnu`)
- Format des horaires (entier `HMM` ou `HHMM`, ex. `930` = 9h30)

## Calendrier

| Étape                                 | Date          |
| ------------------------------------- | ------------- |
| Mise à disposition de la nouvelle API | _à confirmer_ |
| Annonce officielle aux partenaires    | _à confirmer_ |
| Fin de support de l'API actuelle      | _à confirmer_ |

## Support

- Email : **api@solinum.org**
- Documentation interactive : `/api/docs`
- Documentation legacy (référence pendant la transition) : https://solinum.notion.site/API-Solidarit-5ca44f60963741f1b22874d5f566c8cb
