# Llançament de l'API pública de Soliguide

> **Data de posada a disposició**: _per confirmar_
> **Fi del suport de l'API actual (`https://api.soliguide.fr`)**: _per confirmar_
> **Contacte**: api@solinum.org

## A qui s'adreça aquest document

Als integradors que ja consumeixen l'API Solidaritat (`https://api.soliguide.fr`) en règim de conveni de col·laboració amb Solinum — Eurométropole de Strasbourg (OD@CiT), Résorption Bidonvilles (DIHAL), A'urba, Entourage, i altres socis actuals. Hi trobareu què canvia, per què i com migrar.

## En resum

Una nova API pública reemplaça progressivament els endpoints `/new-search` i `/place/:lieu_id`. Formalitza, sota un contracte OpenAPI versionat, la transició ja iniciada a la documentació actual (camps marcats `@new` / `@deprecated`), enriqueix els filtres disponibles i exposa una documentació interactiva servida directament pel servei.

## Per què una nova API

- **Contracte formal i versionat** — esquema OpenAPI complet, primera versió `2026-01-01`. Les evolucions futures no afectaran les versions anteriors.
- **Documentació interactiva integrada** — Scalar exposat a `/api/docs`, sense dependre d'una pàgina Notion externa.
- **Filtres i opcions enriquits** — nous filtres de modalitat (mobilitat reduïda, animals, de pagament, llengua de signes), ordenació configurable, cerca multi-zona.
- **Neteja progressiva de camps heretats** — els camps marcats `@deprecated` a la documentació actual estan assenyalats explícitament a l'esquema i s'eliminaran en una versió futura.

## Endpoint i autenticació

| Aspecte       | Abans                                  | Després                                |
| ------------- | -------------------------------------- | -------------------------------------- |
| Base URL      | `https://api.soliguide.fr`             | _per confirmar_                        |
| Cerca         | `POST /new-search`                     | `POST /search`                         |
| Auth          | `Authorization: JWT <token>`           | **Sense canvis**: `JWT <token>`        |
| Documentació  | Notion (enllaç compartit)              | `/api/docs` (Scalar), `/openapi/<version>.json` |

El token JWT continua sent el proporcionat per Solinum en signar el conveni de col·laboració.

## Models actuals — referència (legacy)

Per a referència, aquí teniu els esquemes tal com els coneixeu avui a `https://api.soliguide.fr`. La correspondència amb la nova API apareix a la columna **Nou**.

### Cos de petició `POST /new-search`

| Camp                          | Tipus                 | Obligatori             | Descripció (legacy)                                    | Nou                                              |
| ----------------------------- | --------------------- | ---------------------- | ------------------------------------------------------ | ------------------------------------------------ |
| `location`                    | object                | ✓                      | Restricció geogràfica principal                        | Sense canvis (+ `locations[]` per multi-zona)    |
| `location.geoType`            | string                | ✓                      | `pays \| region \| departement \| ville \| codePostal \| position` | Igual + `citiesGroup`, `inconnu`       |
| `location.geoValue`           | string                | segons `geoType`       | Slug o codi de la zona                                 | Igual; restringit a `fr \| es \| ad` si `geoType=pays` |
| `location.coordinates`        | `[number, number]`    | si `geoType=position`  | `[lng, lat]`                                           | Sense canvis                                     |
| `location.distance`           | number                | —                      | Radi en km (per defecte 10)                            | Sense canvis                                     |
| `category`                    | string                | —                      | Slug d'una categoria (fills inclosos recursivament)    | Sense canvis                                     |
| `categories`                  | `string[] \| number[]`| —                      | Slugs o IDs numèrics (legacy)                          | **Només slugs** (IDs numèrics rebutjats)         |
| `options.page`                | number                | —                      | Per defecte `1`                                        | Sense canvis                                     |
| `options.limit`               | number                | —                      | Per defecte **`20`**                                   | Per defecte **`10`**                             |
| `options.fields`              | string                | —                      | Llista separada per espais (`"lieu_id name"`)          | Sense canvis                                     |
| `openToday`                   | boolean               | —                      | Almenys un servei obert avui                           | Sense canvis                                     |
| `updatedAt.value`             | string                | —                      | Format **`YYYY/MM/DD HH:mm`**                          | Format **ISO 8601**                              |
| `updatedAt.intervalType`      | enum                  | —                      | `SPECIFIC_DAY \| BEFORE_DAY \| AFTER_DAY`              | Sense canvis                                     |
| `publics.age`                 | number                | —                      | Edat objectiu (enter)                                  | Objecte `{ min, max }` (0–99)                    |
| `publics.gender`              | string[]              | —                      | `men`, `women`                                         | Sense canvis                                     |
| `publics.administrative`      | string[]              | —                      | `regular`, `asylum`, `refugee`, `undocumented`         | Sense canvis                                     |
| `publics.familialle`          | string[]              | —                      | `isolated`, `family`, `couple`, `pregnant`             | Sense canvis (typo `familialle` conservat)       |
| `publics.other`               | string[]              | —                      | `violence`, `addiction`, `handicap`, `lgbt+`, `hiv`, `prostitution`, `prison` | Sense canvis           |
| `publics.accueil`             | `0 \| 1 \| 2`         | —                      | Incondicional / preferencial / exclusiu                | Enum `unconditional \| preferential \| exclusive` |
| `modalities.appointment`      | boolean               | —                      | Amb cita prèvia                                        | Sense canvis                                     |
| `modalities.inscription`      | boolean               | —                      | Inscripció prèvia requerida                            | Sense canvis                                     |
| `modalities.orientation`      | boolean               | —                      | Orientació requerida                                   | Sense canvis                                     |
| `modalities.inconditionnel`   | boolean               | —                      | Accés incondicional (anul·la les altres modalitats)    | Sense canvis                                     |
| _(nou)_                       |                       |                        |                                                        | `modalities.animal`, `modalities.pmr`, `modalities.price`, `modalities.sign` |
| _(nou)_                       |                       |                        |                                                        | `options.sortBy`, `options.sortValue`            |
| _(nou)_                       |                       |                        |                                                        | `placeType` (`PLACE` \| `ITINERARY`)             |
| `word`                        | string                | —                      | Cerca per text sobre el nom de l'estructura            | Sense canvis                                     |

### Resposta `POST /new-search` — nivell superior

```json
{ "nbResults": number, "places": Place[] }
```

Aquesta estructura és **sense canvis** a la nova API.

### Objecte `Place` (resposta de `GET /place/:lieu_id` i elements de `places[]`)

| Camp               | Tipus                                                   | Descripció (legacy)                                           | Nou                                                                     |
| ------------------ | ------------------------------------------------------- | ------------------------------------------------------------- | ----------------------------------------------------------------------- |
| `lieu_id`          | number                                                  | Identificador únic del lloc                                   | Sense canvis                                                            |
| `name`             | string                                                  | Nom del lloc                                                  | Sense canvis                                                            |
| `status`           | enum                                                    | `DRAFT \| ONLINE \| OFFLINE \| CLOSED` (OFFLINE = sense actualitzar >6 mesos) | Sense canvis                                             |
| `position`         | object                                                  | Bloc adreça + coordenades                                     | Vegeu a sota                                                            |
| `services_all`     | `Service[]`                                             | Serveis oferts pel lloc                                       | Sense canvis (vegeu detall Service a sota)                              |
| `sources`          | `Source[]`                                              | Fonts d'origen de la referenciació                            | Sense canvis                                                            |
| `closedHolidays`   | enum                                                    | `UNKNOWN \| OPEN \| CLOSED`                                   | Sense canvis                                                            |
| `sourceLanguage`   | string                                                  | Llengua d'origen de la dada (ISO 639-3)                       | Sense canvis                                                            |
| `country`          | string                                                  | Codi país ISO 3166-1 alpha-2                                  | Restringit a `fr \| es \| ad`                                           |
| `languages`        | string[]                                                | Llengües parlades (ISO 639-3)                                 | Sense canvis                                                            |
| `createdAt`        | date                                                    | Data de creació                                               | Sense canvis                                                            |
| `updatedAt`        | date                                                    | Data de darrera actualització                                 | Sense canvis                                                            |

### Sub-objecte `position`

| Camp legacy (FR)          | Estat          | Camp nou (EN)                          | Notes                                                       |
| ------------------------- | -------------- | -------------------------------------- | ----------------------------------------------------------- |
| `adresse`                 | `@deprecated`  | `address`                              | Àlies conservat a `2026-01-01`, eliminació anunciada        |
| `codePostal`              | `@deprecated`  | `postalCode`                           | Àlies conservat a `2026-01-01`, eliminació anunciada        |
| `complementAdresse`       | `@deprecated`  | `additionalInformation`                | Àlies conservat a `2026-01-01`, eliminació anunciada        |
| `departement`             | `@deprecated`  | `department`                           | Àlies conservat a `2026-01-01`, eliminació anunciada        |
| `departementCode`         | `@deprecated`  | `departmentCode`                       | P. ex.: `974`, `2A`, `91`, `06`                             |
| `pays`                    | `@deprecated`  | `country`                              | Ara restringit a `fr \| es \| ad`                           |
| `ville`                   | `@deprecated`  | `city`                                 | Àlies conservat a `2026-01-01`, eliminació anunciada        |
| —                         |                | `cityCode`                             | Codi administratiu de la ciutat                             |
| —                         |                | `region`                               |                                                             |
| —                         |                | `regionCode`                           |                                                             |
| —                         |                | `timeZone`                             | Format IANA (`Europe/Paris`, etc.)                          |
| `location` (`{coordinates, type}`) | conservat | `location` (`{coordinates, type}`)    | GeoJSON Point sense canvis                                   |

### Objecte `Service`

| Camp legacy                     | Estat           | Camp equivalent (nou)                                 |
| ------------------------------- | --------------- | ----------------------------------------------------- |
| `categorie: Number`             | `@deprecated`   | `category: string` (slug)                             |
| `categorie` (IDs numèrics en filtre d'entrada) | `@deprecated` | Només slugs                                |
| `services_all[].name`           | `@deprecated`   | Migrat a `categorySpecificFields` (vegeu a sota)      |
| `services_all[].jobsList`       | `@deprecated`   | `categorySpecificFields.jobsList`                     |
| `category`                      | `@new`          | Slug de categoria — única font de veritat             |
| `categorySpecificFields`        | `@new`          | Camps polimòrfics segons la categoria                 |
| `close`                         | conservat       | Tancament temporal (`actif`, dates inici/fi)          |
| `status` (saturació)            | conservat       | Nivell de saturació                                   |

### `categorySpecificFields` (camps polimòrfics per categoria)

Camp opcional a cada `Service`, depèn de la categoria. Resum:

| Camp                               | Tipus     | Categories objectiu                                                                                          |
| ---------------------------------- | --------- | ------------------------------------------------------------------------------------------------------------ |
| `activityName`                     | string    | `sport_activities`, `other_activities`                                                                       |
| `availableEquipmentType`           | enum[]    | `shared_kitchen` (`oven`, `microwaves`, `dishwasher`, `cutlery`, `kettle`, `pans`, `frying_pan`, `strainer`, `other`) |
| `availableEquipmentPrecisions`     | string    | `shared_kitchen` quan `other`                                                                                |
| `babyParcelAgeType`                | enum[]    | `baby_parcel` (`under_six_months`, `between_6_and_12_months`, `between_12_and_18_months`, `over_18_months`)  |
| `canteensMealType`                 | enum      | `seated_catering` (`petitdej`, `collation`, `boisson`, `dejeuner`, `diner`)                                  |
| `courseType`                       | enum      | `french_course` (`alphabetisation`, `asl`, `fle`)                                                            |
| `degreeOfChoiceType`               | enum      | Serveis food (`free_choice`, `accompagnied_choice`, `no_choice`)                                             |
| `dietaryAdaptationsType`           | enum[]    | Food (`vegetarian`, `halal`, `gluten_free`, `salt_free`, `kosher`, `lactose_free`)                           |
| `dietaryRegimesType`               | enum      | Food (`we_adapt`, `try_to_adapt`)                                                                            |
| `domiciliationType`                | enum      | `domiciliation` (`domi1` dret comú, `domi2` refugiats, `domi4` apartat postal)                               |
| `foodProductType`                  | enum[]    | `food_packages`, `social_grocery_stores`                                                                     |
| `hygieneProductType`               | enum      | `hygiene_products` (`sanitary_materials`, `other_care_products`)                                             |
| `jobsList`                         | string    | `integration_through_economic_activity`                                                                      |
| `mobilityAssistanceName`           | string    | `mobility_assistance`                                                                                        |
| `serviceStyleType`                 | enum[]    | `food_distribution` (`indoor_seating`, `outdoor_seating`, `take_away`, `delivery`)                           |
| `voucherType`                      | enum      | `food_voucher` (`food_voucher`, `food_stamp`, `food_cheque`, `other`)                                        |
| `wellnessActivityName`             | string    | `wellness`                                                                                                   |

Els camps de tipus `string` es **tradueixen al servidor** a l'idioma de la petició; els enums es retornen com a claus brutes (traducció esperada al client).

### Categories — taula de conversió (resum)

12 categories arrel (slugs en anglès), corresponent als antics IDs numèrics:

| Slug                          | Etiqueta EN               | IDs legacy |
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

> Errades històriques conservades per compatibilitat: `accomodation` (en lloc de `accommodation`), `animal_assitance`, `familialle`.

La taula completa slug ↔ ID numèric està exposada a la documentació interactiva `/api/docs` (toggle equivalent al de Notion).

## Canvis principals per als consumidors

### 1. Codis de país restringits a FR / ES / AD

Només s'accepten els tres països efectivament coberts per Soliguide: `fr`, `es`, `ad`. Els codis heretats dels departaments i territoris francesos d'ultramar (`re`, `gf`, `pf`, `tf`, `gp`, `mq`, `yt`, `bl`, `mf`, `pm`, `wf`) ja no s'accepten com a entrada — feu servir `fr`, que ara cobreix tot el territori francès.

### 2. Categories: només slugs

Els IDs numèrics (`101`, `403`, …) ja no s'accepten com a entrada. Feu servir els slugs en anglès (`addiction`, `social_accompaniment`, …). Hi ha sis noves categories alimentàries disponibles: `solidarity_fridge`, `shared_kitchen`, `cooking_workshop`, `baby_parcel`, `food_voucher`, `community_garden`.

A la resposta, el camp `services_all[].categorie: Number` es manté en aquesta versió però està marcat com a `deprecated: true`; feu servir `services_all[].category` (slug).

### 3. Format de dates

`updatedAt.value` passa al format **ISO 8601** (p. ex. `2026-01-01T00:00:00.000Z`). El format històric `YYYY/MM/DD HH:mm` ja no s'accepta.

### 4. Filtre d'edat — objecte rang

`publics.age` passa a ser un objecte `{ min, max }` (enters `0`–`99`), en lloc d'un únic nombre. Això permet expressar un rang d'edat.

### 5. Filtre `publics.accueil` — enum

Passa a ser un enum (`unconditional`, `preferential`, `exclusive`), en lloc de `0` / `1` / `2`.

### 6. Nous filtres de modalitat

- `modalities.animal` — accepta animals
- `modalities.pmr` — accessible per a persones amb mobilitat reduïda
- `modalities.price` — servei de pagament
- `modalities.sign` — llengua de signes

Els anteriors (`appointment`, `inscription`, `orientation`, `inconditionnel`) no canvien.

### 7. Noves opcions d'ordenació i paginació

- `options.sortBy`: `createdAt | lieu_id | name | distance | slugs.infos.name | status | updatedAt`
- `options.sortValue`: `1` (ascendent) / `-1` (descendent)
- `options.limit` per defecte: **10** (vs. 20 a l'API actual)

### 8. Nous filtres de cerca

- `placeType`: `PLACE` (per defecte) o `ITINERARY` — lloc fix o itinerari mòbil
- `locations[]`: cerca multi-zona (p. ex. per a un widget)

### 9. Camps d'adreça — àlies bilingües, eliminació futura anunciada

Els camps francesos dels objectes `position` (`adresse`, `codePostal`, `complementAdresse`, `departement`, `departementCode`, `pays`, `ville`) es **mantenen com a àlies** dels seus equivalents en anglès (`address`, `postalCode`, `additionalInformation`, `department`, `departmentCode`, `country`, `city`) en aquesta versió. S'**eliminaran en una versió posterior** — adapteu ja el vostre codi als noms en anglès.

### 10. Endpoint `/place/:lieu_id`

A hores d'ara, la nova API exposa **únicament** `POST /search`. La recuperació d'un lloc per `lieu_id` està per confirmar (arribarà en una versió posterior o via un paràmetre de filtre).

## Documentació interactiva

- **Interactiva**: `/api/docs` (Scalar) — esquemes, exemples, crides executables
- **Spec JSON**: `/openapi/<version>.json`
- **Versió actual**: `2026-01-01`

Es publicarà un changelog automàtic amb cada nova versió.

## Migració — pas a pas

1. **Apuntar** a la nova base URL (_per confirmar_)
2. **Reemplaçar** `/new-search` per `/search`
3. **Mapejar** els IDs numèrics de categoria als seus slugs (taula de conversió a Scalar)
4. **Filtrar** únicament sobre `fr`, `es`, `ad` a `location.country` i `geoValue` quan `geoType=pays`
5. **Migrar** el format de `updatedAt.value` a ISO 8601
6. **Adaptar** `publics.age` (objecte `{min, max}`) i `publics.accueil` (enum)
7. **Reanomenar** els camps d'adreça de FR a EN al vostre codi de mapeig (transició suau, però cal anticipar)
8. **Provar** contra `/api/docs`

L'API actual (`https://api.soliguide.fr`) continua disponible durant la fase de transició.

## El que no canvia

- Autenticació: capçalera `Authorization: JWT <token>`, mateix token
- Estructura general de la resposta: `{ nbResults: number, places: Place[] }`
- Estructura `services_all[]` per als serveis d'un lloc
- Valors de `geoType`: continuen en francès (`pays`, `ville`, `codePostal`, `departement`, `region`, `position`, `citiesGroup`, `inconnu`)
- Format d'horaris (enter `HMM` o `HHMM`, p. ex. `930` = 9:30)

## Calendari

| Fita                                       | Data                |
| ------------------------------------------ | ------------------- |
| Disponibilitat de l'API pública            | _per confirmar_     |
| Anunci oficial als socis                   | _per confirmar_     |
| Fi del suport de l'API actual              | _per confirmar_     |

## Suport

- Email: **api@solinum.org**
- Documentació interactiva: `/api/docs`
- Documentació heretada (referència durant la transició): https://solinum.notion.site/API-Solidarit-5ca44f60963741f1b22874d5f566c8cb
