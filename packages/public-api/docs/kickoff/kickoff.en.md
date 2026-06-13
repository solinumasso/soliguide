# Soliguide Public API launch

> **Launch date**: _to be confirmed_
> **End-of-life of the current API (`https://api.soliguide.fr`)**: _to be confirmed_
> **Contact**: api@solinum.org

## Who this document is for

Integrators already consuming the Solidarity API (`https://api.soliguide.fr`) under a partnership agreement with Solinum — Eurométropole de Strasbourg (OD@CiT), Résorption Bidonvilles (DIHAL), A'urba, Entourage, and other existing partners. You will find here what changes, why, and how to migrate.

## In short

A new public API will gradually replace the `/new-search` and `/place/:lieu_id` endpoints. It formalizes, under a versioned OpenAPI contract, the transition already started in the current documentation (fields marked `@new` / `@deprecated`), enriches the available filters, and exposes an interactive documentation served directly by the service.

## Why a new API

- **Formal, versioned contract** — complete OpenAPI schema, first version `2026-01-01`. Future changes will not affect previous versions.
- **Built-in interactive documentation** — Scalar exposed at `/api/docs`, no longer depending on an external Notion page.
- **Richer filters and options** — new modality filters (reduced mobility, animals, paid, sign language), configurable sorting, multi-zone search.
- **Progressive cleanup of legacy fields** — fields marked `@deprecated` in the current documentation are explicitly flagged in the schema and will be removed in a future version.

## Endpoint and authentication

| Aspect        | Before                                  | After                                  |
| ------------- | --------------------------------------- | -------------------------------------- |
| Base URL      | `https://api.soliguide.fr`              | _to be confirmed_                      |
| Search        | `POST /new-search`                      | `POST /search`                         |
| Auth          | `Authorization: JWT <token>`            | **Unchanged**: `JWT <token>`           |
| Documentation | Notion (shared link)                    | `/api/docs` (Scalar), `/openapi/<version>.json` |

The JWT token remains the one provided by Solinum upon signing the partnership agreement.

## Current models — reference (legacy)

For reference, here are the schemas as you know them today on `https://api.soliguide.fr`. The mapping to the new API appears in the **New** column.

### `POST /new-search` request body

| Field                         | Type                  | Required               | Description (legacy)                                   | New                                              |
| ----------------------------- | --------------------- | ---------------------- | ------------------------------------------------------ | ------------------------------------------------ |
| `location`                    | object                | ✓                      | Primary geographic constraint                          | Unchanged (+ `locations[]` for multi-zone)       |
| `location.geoType`            | string                | ✓                      | `pays \| region \| departement \| ville \| codePostal \| position` | Same + `citiesGroup`, `inconnu`        |
| `location.geoValue`           | string                | depending on `geoType` | Slug or zone code                                      | Same; restricted to `fr \| es \| ad` if `geoType=pays` |
| `location.coordinates`        | `[number, number]`    | if `geoType=position`  | `[lng, lat]`                                           | Unchanged                                        |
| `location.distance`           | number                | —                      | Radius in km (default 10)                              | Unchanged                                        |
| `category`                    | string                | —                      | Slug of a category (children included recursively)     | Unchanged                                        |
| `categories`                  | `string[] \| number[]`| —                      | Slugs or numeric IDs (legacy)                          | **Slugs only** (numeric IDs rejected)            |
| `options.page`                | number                | —                      | Default `1`                                            | Unchanged                                        |
| `options.limit`               | number                | —                      | Default **`20`**                                       | Default **`10`**                                 |
| `options.fields`              | string                | —                      | Space-separated list (`"lieu_id name"`)                | Unchanged                                        |
| `openToday`                   | boolean               | —                      | At least one service open today                        | Unchanged                                        |
| `updatedAt.value`             | string                | —                      | Format **`YYYY/MM/DD HH:mm`**                          | Format **ISO 8601**                              |
| `updatedAt.intervalType`      | enum                  | —                      | `SPECIFIC_DAY \| BEFORE_DAY \| AFTER_DAY`              | Unchanged                                        |
| `publics.age`                 | number                | —                      | Target age (integer)                                   | Object `{ min, max }` (0–99)                     |
| `publics.gender`              | string[]              | —                      | `men`, `women`                                         | Unchanged                                        |
| `publics.administrative`      | string[]              | —                      | `regular`, `asylum`, `refugee`, `undocumented`         | Unchanged                                        |
| `publics.familialle`          | string[]              | —                      | `isolated`, `family`, `couple`, `pregnant`             | Unchanged (typo `familialle` preserved)          |
| `publics.other`               | string[]              | —                      | `violence`, `addiction`, `handicap`, `lgbt+`, `hiv`, `prostitution`, `prison` | Unchanged             |
| `publics.accueil`             | `0 \| 1 \| 2`         | —                      | Unconditional / preferential / exclusive               | Enum `unconditional \| preferential \| exclusive` |
| `modalities.appointment`      | boolean               | —                      | By appointment                                         | Unchanged                                        |
| `modalities.inscription`      | boolean               | —                      | Prior registration required                            | Unchanged                                        |
| `modalities.orientation`      | boolean               | —                      | Orientation required                                   | Unchanged                                        |
| `modalities.inconditionnel`   | boolean               | —                      | Unconditional access (overrides other modalities)      | Unchanged                                        |
| _(new)_                       |                       |                        |                                                        | `modalities.animal`, `modalities.pmr`, `modalities.price`, `modalities.sign` |
| _(new)_                       |                       |                        |                                                        | `options.sortBy`, `options.sortValue`            |
| _(new)_                       |                       |                        |                                                        | `placeType` (`PLACE` \| `ITINERARY`)             |
| `word`                        | string                | —                      | Text search by place name                              | Unchanged                                        |

### `POST /new-search` response — top level

```json
{ "nbResults": number, "places": Place[] }
```

This structure is **unchanged** in the new API.

### `Place` object (response from `GET /place/:lieu_id` and items of `places[]`)

| Field              | Type                                                    | Description (legacy)                                          | New                                                                     |
| ------------------ | ------------------------------------------------------- | ------------------------------------------------------------- | ----------------------------------------------------------------------- |
| `lieu_id`          | number                                                  | Unique identifier of the place                                | Unchanged                                                               |
| `name`             | string                                                  | Place name                                                    | Unchanged                                                               |
| `status`           | enum                                                    | `DRAFT \| ONLINE \| OFFLINE \| CLOSED` (OFFLINE = not updated for >6 months) | Unchanged                                                |
| `position`         | object                                                  | Address + coordinates block                                   | See below                                                               |
| `services_all`     | `Service[]`                                             | Services offered by the place                                 | Unchanged (see Service detail below)                                    |
| `sources`          | `Source[]`                                              | Source(s) of the referencing data                             | Unchanged                                                               |
| `closedHolidays`   | enum                                                    | `UNKNOWN \| OPEN \| CLOSED`                                   | Unchanged                                                               |
| `sourceLanguage`   | string                                                  | Original data language (ISO 639-3)                            | Unchanged                                                               |
| `country`          | string                                                  | Country code ISO 3166-1 alpha-2                               | Restricted to `fr \| es \| ad`                                          |
| `languages`        | string[]                                                | Languages spoken (ISO 639-3)                                  | Unchanged                                                               |
| `createdAt`        | date                                                    | Creation date                                                 | Unchanged                                                               |
| `updatedAt`        | date                                                    | Last update date                                              | Unchanged                                                               |

### `position` sub-object

| Legacy field (FR)         | Status         | New field (EN)                          | Notes                                                       |
| ------------------------- | -------------- | --------------------------------------- | ----------------------------------------------------------- |
| `adresse`                 | `@deprecated`  | `address`                               | Kept as alias in `2026-01-01`, removal announced            |
| `codePostal`              | `@deprecated`  | `postalCode`                            | Kept as alias in `2026-01-01`, removal announced            |
| `complementAdresse`       | `@deprecated`  | `additionalInformation`                 | Kept as alias in `2026-01-01`, removal announced            |
| `departement`             | `@deprecated`  | `department`                            | Kept as alias in `2026-01-01`, removal announced            |
| `departementCode`         | `@deprecated`  | `departmentCode`                        | E.g.: `974`, `2A`, `91`, `06`                               |
| `pays`                    | `@deprecated`  | `country`                               | Now restricted to `fr \| es \| ad`                          |
| `ville`                   | `@deprecated`  | `city`                                  | Kept as alias in `2026-01-01`, removal announced            |
| —                         |                | `cityCode`                              | Administrative code of the city                             |
| —                         |                | `region`                                |                                                             |
| —                         |                | `regionCode`                            |                                                             |
| —                         |                | `timeZone`                              | IANA format (`Europe/Paris`, etc.)                          |
| `location` (`{coordinates, type}`) | preserved | `location` (`{coordinates, type}`)    | GeoJSON Point unchanged                                      |

### `Service` object

| Legacy field                    | Status          | Equivalent field (new)                                |
| ------------------------------- | --------------- | ----------------------------------------------------- |
| `categorie: Number`             | `@deprecated`   | `category: string` (slug)                             |
| `categorie` (numeric IDs in filter input) | `@deprecated` | Slugs only                                |
| `services_all[].name`           | `@deprecated`   | Moved into `categorySpecificFields` (see below)       |
| `services_all[].jobsList`       | `@deprecated`   | `categorySpecificFields.jobsList`                     |
| `category`                      | `@new`          | Category slug — single source of truth                |
| `categorySpecificFields`        | `@new`          | Polymorphic fields depending on the category          |
| `close`                         | preserved       | Temporary closure (`actif`, start/end dates)          |
| `status` (saturation)           | preserved       | Saturation level                                      |

### `categorySpecificFields` (polymorphic fields per category)

Optional field on each `Service`, depends on the category. Summary:

| Field                              | Type      | Target categories                                                                                            |
| ---------------------------------- | --------- | ------------------------------------------------------------------------------------------------------------ |
| `activityName`                     | string    | `sport_activities`, `other_activities`                                                                       |
| `availableEquipmentType`           | enum[]    | `shared_kitchen` (`oven`, `microwaves`, `dishwasher`, `cutlery`, `kettle`, `pans`, `frying_pan`, `strainer`, `other`) |
| `availableEquipmentPrecisions`     | string    | `shared_kitchen` when `other`                                                                                |
| `babyParcelAgeType`                | enum[]    | `baby_parcel` (`under_six_months`, `between_6_and_12_months`, `between_12_and_18_months`, `over_18_months`)  |
| `canteensMealType`                 | enum      | `seated_catering` (`petitdej`, `collation`, `boisson`, `dejeuner`, `diner`)                                  |
| `courseType`                       | enum      | `french_course` (`alphabetisation`, `asl`, `fle`)                                                            |
| `degreeOfChoiceType`               | enum      | Food services (`free_choice`, `accompagnied_choice`, `no_choice`)                                            |
| `dietaryAdaptationsType`           | enum[]    | Food (`vegetarian`, `halal`, `gluten_free`, `salt_free`, `kosher`, `lactose_free`)                           |
| `dietaryRegimesType`               | enum      | Food (`we_adapt`, `try_to_adapt`)                                                                            |
| `domiciliationType`                | enum      | `domiciliation` (`domi1` common law, `domi2` refugees, `domi4` postal box)                                   |
| `foodProductType`                  | enum[]    | `food_packages`, `social_grocery_stores`                                                                     |
| `hygieneProductType`               | enum      | `hygiene_products` (`sanitary_materials`, `other_care_products`)                                             |
| `jobsList`                         | string    | `integration_through_economic_activity`                                                                      |
| `mobilityAssistanceName`           | string    | `mobility_assistance`                                                                                        |
| `serviceStyleType`                 | enum[]    | `food_distribution` (`indoor_seating`, `outdoor_seating`, `take_away`, `delivery`)                           |
| `voucherType`                      | enum      | `food_voucher` (`food_voucher`, `food_stamp`, `food_cheque`, `other`)                                        |
| `wellnessActivityName`             | string    | `wellness`                                                                                                   |

`string`-typed fields are **translated server-side** in the request language; enums are returned as raw keys (client-side translation expected).

### Categories — conversion table (summary)

12 root categories (English slugs), mapping to the legacy numeric IDs:

| Slug                          | EN label                  | Legacy IDs |
| ----------------------------- | ------------------------- | ---------- |
| `health`                      | Health                    | 100 + 101–110 |
| `training_and_jobs`           | Training and Employment   | 200 + 201–205 |
| `hygiene_and_wellness`        | Hygiene and Well-being    | 300 + 301–306 |
| `counseling`                  | Counseling                | 400 + 401–408 |
| `technology`                  | Technology                | 500 + 501–505 |
| `food`                        | Food                      | 600 + 601–605 + 6 `@new` |
| `welcome`                     | Welcome                   | 700 + 701–705 |
| `activities`                  | Activities                | 800 + 801–804 |
| `equipment`                   | Equipment                 | 900 + 901–904 |
| `health_specialists`          | Specialists               | 1100 + 1101–1122 |
| `mobility`                    | Transportation & Mobility | 1200 + 1201–1204 |
| `accomodation_and_housing`    | Housing & Accommodation   | 1300 + 1301–1305 |

> Historical typos preserved for compatibility: `accomodation` (instead of `accommodation`), `animal_assitance`, `familialle`.

The full slug ↔ numeric ID table is exposed in the interactive documentation at `/api/docs` (toggle equivalent to the Notion one).

## Key changes for consumers

### 1. Country codes restricted to FR / ES / AD

Only the three countries actually covered by Soliguide are accepted: `fr`, `es`, `ad`. The legacy codes for French overseas departments and territories (`re`, `gf`, `pf`, `tf`, `gp`, `mq`, `yt`, `bl`, `mf`, `pm`, `wf`) are no longer accepted as input — use `fr`, which now covers the entire French territory.

### 2. Categories: slugs only

Numeric IDs (`101`, `403`, …) are no longer accepted as input. Use the English slugs (`addiction`, `social_accompaniment`, …). Six new food-related categories are available: `solidarity_fridge`, `shared_kitchen`, `cooking_workshop`, `baby_parcel`, `food_voucher`, `community_garden`.

On the response side, the `services_all[].categorie: Number` field is kept for this version but marked `deprecated: true`; use `services_all[].category` (slug).

### 3. Date format

`updatedAt.value` switches to the **ISO 8601** format (e.g. `2026-01-01T00:00:00.000Z`). The historical `YYYY/MM/DD HH:mm` format is no longer accepted.

### 4. Age filter — range object

`publics.age` becomes a `{ min, max }` object (integers `0`–`99`), instead of a single number. This allows expressing an age range.

### 5. `publics.accueil` filter — enum

Switches to an enum (`unconditional`, `preferential`, `exclusive`) instead of `0` / `1` / `2`.

### 6. New modality filters

- `modalities.animal` — accepts animals
- `modalities.pmr` — accessible to people with reduced mobility
- `modalities.price` — paid service
- `modalities.sign` — sign-language friendly

The existing ones (`appointment`, `inscription`, `orientation`, `inconditionnel`) remain unchanged.

### 7. New sorting and pagination options

- `options.sortBy`: `createdAt | lieu_id | name | distance | slugs.infos.name | status | updatedAt`
- `options.sortValue`: `1` (ascending) / `-1` (descending)
- `options.limit` default: **10** (vs. 20 on the current API)

### 8. New search filters

- `placeType`: `PLACE` (default) or `ITINERARY` — fixed place or mobile itinerary
- `locations[]`: multi-zone search (e.g. for a widget)

### 9. Address fields — bilingual aliases, future removal announced

The French address fields on `position` objects (`adresse`, `codePostal`, `complementAdresse`, `departement`, `departementCode`, `pays`, `ville`) are **kept as aliases** of their English counterparts (`address`, `postalCode`, `additionalInformation`, `department`, `departmentCode`, `country`, `city`) in this version. They will be **removed in a future version** — update your code to the English names now.

### 10. `/place/:lieu_id` endpoint

At this stage, the new API only exposes `POST /search`. Retrieving a place by `lieu_id` is to be confirmed (will follow in a later version or via a filter parameter).

## Interactive documentation

- **Interactive**: `/api/docs` (Scalar) — schemas, examples, executable calls
- **JSON spec**: `/openapi/<version>.json`
- **Current version**: `2026-01-01`

An automatic changelog will be published with each new version.

## Migration — step by step

1. **Point** to the new base URL (_to be confirmed_)
2. **Replace** `/new-search` with `/search`
3. **Map** numeric category IDs to their slugs (conversion table in Scalar)
4. **Filter** only on `fr`, `es`, `ad` for `location.country` and `geoValue` when `geoType=pays`
5. **Migrate** the `updatedAt.value` format to ISO 8601
6. **Adapt** `publics.age` (`{min, max}` object) and `publics.accueil` (enum)
7. **Rename** French address fields to English in your mapping code (soft transition, but anticipate)
8. **Test** against `/api/docs`

The current API (`https://api.soliguide.fr`) remains available during the transition.

## What does not change

- Authentication: `Authorization: JWT <token>` header, same token
- Top-level response structure: `{ nbResults: number, places: Place[] }`
- `services_all[]` structure for the services of a place
- `geoType` values: still in French (`pays`, `ville`, `codePostal`, `departement`, `region`, `position`, `citiesGroup`, `inconnu`)
- Opening-hours format (integer `HMM` or `HHMM`, e.g. `930` = 9:30 AM)

## Timeline

| Milestone                              | Date                |
| -------------------------------------- | ------------------- |
| Public API availability                | _to be confirmed_   |
| Official announcement to partners      | _to be confirmed_   |
| End of support for the current API     | _to be confirmed_   |

## Support

- Email: **api@solinum.org**
- Interactive documentation: `/api/docs`
- Legacy documentation (reference during the transition): https://solinum.notion.site/API-Solidarit-5ca44f60963741f1b22874d5f566c8cb
