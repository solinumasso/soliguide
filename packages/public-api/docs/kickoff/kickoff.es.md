# Lanzamiento de la API pública de Soliguide

> **Fecha de puesta a disposición**: _por confirmar_ > **Fin del soporte de la API actual (`https://api.soliguide.fr`)**: _por confirmar_ > **Contacto**: api@solinum.org

## A quién va dirigido este documento

A los integradores que ya consumen la API Solidaridad (`https://api.soliguide.fr`) bajo convenio de colaboración con Solinum — Eurométropole de Strasbourg (OD@CiT), Résorption Bidonvilles (DIHAL), A'urba, Entourage, y otros socios actuales. Aquí encontrarán qué cambia, por qué y cómo migrar.

## En resumen

Una nueva API pública reemplaza progresivamente los endpoints `/new-search` y `/place/:lieu_id`. Formaliza, bajo un contrato OpenAPI versionado, la transición ya iniciada en la documentación actual (campos marcados `@new` / `@deprecated`), enriquece los filtros disponibles y expone una documentación interactiva servida directamente por el servicio.

## Por qué una nueva API

- **Contrato formal y versionado** — esquema OpenAPI completo, primera versión `2026-01-01`. Las evoluciones futuras no afectarán a las versiones anteriores.
- **Documentación interactiva integrada** — Scalar expuesto en `/api/docs`, sin depender de una página Notion externa.
- **Filtros y opciones enriquecidos** — nuevos filtros de modalidad (movilidad reducida, animales, de pago, lengua de signos), ordenación configurable, búsqueda multi-zona.
- **Limpieza progresiva de campos heredados** — los campos marcados `@deprecated` en la documentación actual están señalados explícitamente en el esquema y se eliminarán en una versión futura.

## Endpoint y autenticación

| Aspecto       | Antes                        | Después                                         |
| ------------- | ---------------------------- | ----------------------------------------------- |
| Base URL      | `https://api.soliguide.fr`   | _por confirmar_                                 |
| Búsqueda      | `POST /new-search`           | `POST /search`                                  |
| Auth          | `Authorization: JWT <token>` | **Sin cambios**: `JWT <token>`                  |
| Documentación | Notion (enlace compartido)   | `/api/docs` (Scalar), `/openapi/<version>.json` |

El token JWT sigue siendo el proporcionado por Solinum al firmar el convenio de colaboración.

## Modelos actuales — referencia (legacy)

Para referencia, aquí están los esquemas tal como los conocen hoy en `https://api.soliguide.fr`. La correspondencia con la nueva API aparece en la columna **Nuevo**.

### Cuerpo de petición `POST /new-search`

| Campo                       | Tipo                   | Obligatorio           | Descripción (legacy)                                                          | Nuevo                                                                        |
| --------------------------- | ---------------------- | --------------------- | ----------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| `location`                  | object                 | ✓                     | Restricción geográfica principal                                              | Sin cambios (+ `locations[]` para multi-zona)                                |
| `location.geoType`          | string                 | ✓                     | `pays \| region \| departement \| ville \| codePostal \| position`            | Igual + `citiesGroup`, `inconnu`                                             |
| `location.geoValue`         | string                 | según `geoType`       | Slug o código de la zona                                                      | Igual; restringido a `fr \| es \| ad` si `geoType=pays`                      |
| `location.coordinates`      | `[number, number]`     | si `geoType=position` | `[lng, lat]`                                                                  | Sin cambios                                                                  |
| `location.distance`         | number                 | —                     | Radio en km (por defecto 10)                                                  | Sin cambios                                                                  |
| `category`                  | string                 | —                     | Slug de una categoría (hijos incluidos recursivamente)                        | Sin cambios                                                                  |
| `categories`                | `string[] \| number[]` | —                     | Slugs o IDs numéricos (legacy)                                                | **Solo slugs** (IDs numéricos rechazados)                                    |
| `options.page`              | number                 | —                     | Por defecto `1`                                                               | Sin cambios                                                                  |
| `options.limit`             | number                 | —                     | Por defecto **`20`**                                                          | Por defecto **`10`**                                                         |
| `options.fields`            | string                 | —                     | Lista separada por espacios (`"lieu_id name"`)                                | Sin cambios                                                                  |
| `openToday`                 | boolean                | —                     | Al menos un servicio abierto hoy                                              | Sin cambios                                                                  |
| `updatedAt.value`           | string                 | —                     | Formato **`YYYY/MM/DD HH:mm`**                                                | Formato **ISO 8601**                                                         |
| `updatedAt.intervalType`    | enum                   | —                     | `SPECIFIC_DAY \| BEFORE_DAY \| AFTER_DAY`                                     | Sin cambios                                                                  |
| `publics.age`               | number                 | —                     | Edad objetivo (entero)                                                        | Objeto `{ min, max }` (0–99)                                                 |
| `publics.gender`            | string[]               | —                     | `men`, `women`                                                                | Sin cambios                                                                  |
| `publics.administrative`    | string[]               | —                     | `regular`, `asylum`, `refugee`, `undocumented`                                | Sin cambios                                                                  |
| `publics.familialle`        | string[]               | —                     | `isolated`, `family`, `couple`, `pregnant`                                    | Sin cambios (typo `familialle` conservado)                                   |
| `publics.other`             | string[]               | —                     | `violence`, `addiction`, `handicap`, `lgbt+`, `hiv`, `prostitution`, `prison` | Sin cambios                                                                  |
| `publics.accueil`           | `0 \| 1 \| 2`          | —                     | Incondicional / preferencial / exclusivo                                      | Enum `unconditional \| preferential \| exclusive`                            |
| `modalities.appointment`    | boolean                | —                     | Con cita previa                                                               | Sin cambios                                                                  |
| `modalities.inscription`    | boolean                | —                     | Inscripción previa requerida                                                  | Sin cambios                                                                  |
| `modalities.orientation`    | boolean                | —                     | Orientación requerida                                                         | Sin cambios                                                                  |
| `modalities.inconditionnel` | boolean                | —                     | Acceso incondicional (anula las demás modalidades)                            | Sin cambios                                                                  |
| _(nuevo)_                   |                        |                       |                                                                               | `modalities.animal`, `modalities.pmr`, `modalities.price`, `modalities.sign` |
| _(nuevo)_                   |                        |                       |                                                                               | `options.sortBy`, `options.sortValue`                                        |
| _(nuevo)_                   |                        |                       |                                                                               | `placeType` (`PLACE` \| `ITINERARY`)                                         |
| `word`                      | string                 | —                     | Búsqueda por texto sobre el nombre de la estructura                           | Sin cambios                                                                  |

### Respuesta `POST /new-search` — nivel superior

```json
{ "nbResults": number, "places": Place[] }
```

Esta estructura es **sin cambios** en la nueva API.

### Objeto `Place` (respuesta de `GET /place/:lieu_id` y elementos de `places[]`)

| Campo            | Tipo        | Descripción (legacy)                                                       | Nuevo                                   |
| ---------------- | ----------- | -------------------------------------------------------------------------- | --------------------------------------- |
| `lieu_id`        | number      | Identificador único del lugar                                              | Sin cambios                             |
| `name`           | string      | Nombre del lugar                                                           | Sin cambios                             |
| `status`         | enum        | `DRAFT \| ONLINE \| OFFLINE \| CLOSED` (OFFLINE = sin actualizar >6 meses) | Sin cambios                             |
| `position`       | object      | Bloque de dirección + coordenadas                                          | Ver abajo                               |
| `services_all`   | `Service[]` | Servicios ofrecidos por el lugar                                           | Sin cambios (ver detalle Service abajo) |
| `sources`        | `Source[]`  | Fuentes de origen de la referencia                                         | Sin cambios                             |
| `closedHolidays` | enum        | `UNKNOWN \| OPEN \| CLOSED`                                                | Sin cambios                             |
| `sourceLanguage` | string      | Idioma de origen del dato (ISO 639-3)                                      | Sin cambios                             |
| `country`        | string      | Código país ISO 3166-1 alpha-2                                             | Restringido a `fr \| es \| ad`          |
| `languages`      | string[]    | Idiomas hablados (ISO 639-3)                                               | Sin cambios                             |
| `createdAt`      | date        | Fecha de creación                                                          | Sin cambios                             |
| `updatedAt`      | date        | Fecha de última actualización                                              | Sin cambios                             |

### Sub-objeto `position`

| Campo legacy (FR)                  | Estado        | Campo nuevo (EN)                   | Notas                                                   |
| ---------------------------------- | ------------- | ---------------------------------- | ------------------------------------------------------- |
| `adresse`                          | `@deprecated` | `address`                          | Alias conservado en `2026-01-01`, eliminación anunciada |
| `codePostal`                       | `@deprecated` | `postalCode`                       | Alias conservado en `2026-01-01`, eliminación anunciada |
| `complementAdresse`                | `@deprecated` | `additionalInformation`            | Alias conservado en `2026-01-01`, eliminación anunciada |
| `departement`                      | `@deprecated` | `department`                       | Alias conservado en `2026-01-01`, eliminación anunciada |
| `departementCode`                  | `@deprecated` | `departmentCode`                   | Ej.: `974`, `2A`, `91`, `06`                            |
| `pays`                             | `@deprecated` | `country`                          | Ahora restringido a `fr \| es \| ad`                    |
| `ville`                            | `@deprecated` | `city`                             | Alias conservado en `2026-01-01`, eliminación anunciada |
| —                                  |               | `cityCode`                         | Código administrativo de la ciudad                      |
| —                                  |               | `region`                           |                                                         |
| —                                  |               | `regionCode`                       |                                                         |
| —                                  |               | `timeZone`                         | Formato IANA (`Europe/Paris`, etc.)                     |
| `location` (`{coordinates, type}`) | conservado    | `location` (`{coordinates, type}`) | GeoJSON Point sin cambios                               |

### Objeto `Service`

| Campo legacy                                     | Estado        | Campo equivalente (nuevo)                      |
| ------------------------------------------------ | ------------- | ---------------------------------------------- |
| `categorie: Number`                              | `@deprecated` | `category: string` (slug)                      |
| `categorie` (IDs numéricos en filtro de entrada) | `@deprecated` | Solo slugs                                     |
| `services_all[].name`                            | `@deprecated` | Migrado a `categorySpecificFields` (ver abajo) |
| `services_all[].jobsList`                        | `@deprecated` | `categorySpecificFields.jobsList`              |
| `category`                                       | `@new`        | Slug de categoría — única fuente de verdad     |
| `categorySpecificFields`                         | `@new`        | Campos polimórficos según la categoría         |
| `close`                                          | conservado    | Cierre temporal (`actif`, fechas inicio/fin)   |
| `status` (saturación)                            | conservado    | Nivel de saturación                            |

### `categorySpecificFields` (campos polimórficos por categoría)

Campo opcional en cada `Service`, depende de la categoría. Resumen:

| Campo                          | Tipo   | Categorías objetivo                                                                                                   |
| ------------------------------ | ------ | --------------------------------------------------------------------------------------------------------------------- |
| `activityName`                 | string | `sport_activities`, `other_activities`                                                                                |
| `availableEquipmentType`       | enum[] | `shared_kitchen` (`oven`, `microwaves`, `dishwasher`, `cutlery`, `kettle`, `pans`, `frying_pan`, `strainer`, `other`) |
| `availableEquipmentPrecisions` | string | `shared_kitchen` cuando `other`                                                                                       |
| `babyParcelAgeType`            | enum[] | `baby_parcel` (`under_six_months`, `between_6_and_12_months`, `between_12_and_18_months`, `over_18_months`)           |
| `canteensMealType`             | enum   | `seated_catering` (`petitdej`, `collation`, `boisson`, `dejeuner`, `diner`)                                           |
| `courseType`                   | enum   | `french_course` (`alphabetisation`, `asl`, `fle`)                                                                     |
| `degreeOfChoiceType`           | enum   | Servicios food (`free_choice`, `accompagnied_choice`, `no_choice`)                                                    |
| `dietaryAdaptationsType`       | enum[] | Food (`vegetarian`, `halal`, `gluten_free`, `salt_free`, `kosher`, `lactose_free`)                                    |
| `dietaryRegimesType`           | enum   | Food (`we_adapt`, `try_to_adapt`)                                                                                     |
| `domiciliationType`            | enum   | `domiciliation` (`domi1` derecho común, `domi2` refugiados, `domi4` apartado postal)                                  |
| `foodProductType`              | enum[] | `food_packages`, `social_grocery_stores`                                                                              |
| `hygieneProductType`           | enum   | `hygiene_products` (`sanitary_materials`, `other_care_products`)                                                      |
| `jobsList`                     | string | `integration_through_economic_activity`                                                                               |
| `mobilityAssistanceName`       | string | `mobility_assistance`                                                                                                 |
| `serviceStyleType`             | enum[] | `food_distribution` (`indoor_seating`, `outdoor_seating`, `take_away`, `delivery`)                                    |
| `voucherType`                  | enum   | `food_voucher` (`food_voucher`, `food_stamp`, `food_cheque`, `other`)                                                 |
| `wellnessActivityName`         | string | `wellness`                                                                                                            |

Los campos de tipo `string` se **traducen en el servidor** al idioma de la petición; los enums se devuelven como claves brutas (traducción esperada en el cliente).

### Categorías — tabla de conversión (resumen)

12 categorías raíz (slugs en inglés), correspondiendo a los antiguos IDs numéricos:

| Slug                       | Etiqueta EN               | IDs legacy               |
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

> Erratas históricas conservadas por compatibilidad: `accomodation` (en lugar de `accommodation`), `animal_assitance`, `familialle`.

La tabla completa slug ↔ ID numérico está expuesta en la documentación interactiva `/api/docs` (toggle equivalente al de Notion).

## Cambios principales para los consumidores

### 1. Códigos de país restringidos a FR / ES / AD

Solo se aceptan los tres países efectivamente cubiertos por Soliguide: `fr`, `es`, `ad`. Los códigos heredados de departamentos y territorios franceses de ultramar (`re`, `gf`, `pf`, `tf`, `gp`, `mq`, `yt`, `bl`, `mf`, `pm`, `wf`) ya no se aceptan como entrada — utilice `fr`, que ahora cubre todo el territorio francés.

### 2. Categorías: solo slugs

Los IDs numéricos (`101`, `403`, …) ya no se aceptan como entrada. Use los slugs en inglés (`addiction`, `social_accompaniment`, …). Hay seis nuevas categorías alimentarias disponibles: `solidarity_fridge`, `shared_kitchen`, `cooking_workshop`, `baby_parcel`, `food_voucher`, `community_garden`.

En la respuesta, el campo `services_all[].categorie: Number` se conserva en esta versión pero está marcado como `deprecated: true`; use `services_all[].category` (slug).

### 3. Formato de fechas

`updatedAt.value` pasa al formato **ISO 8601** (p. ej. `2026-01-01T00:00:00.000Z`). El formato histórico `YYYY/MM/DD HH:mm` ya no se acepta.

### 4. Filtro de edad — objeto rango

`publics.age` pasa a ser un objeto `{ min, max }` (enteros `0`–`99`), en lugar de un único número. Esto permite expresar un rango de edad.

### 5. Filtro `publics.accueil` — enum

Pasa a ser un enum (`unconditional`, `preferential`, `exclusive`), en lugar de `0` / `1` / `2`.

### 6. Nuevos filtros de modalidad

- `modalities.animal` — acepta animales
- `modalities.pmr` — accesible para personas con movilidad reducida
- `modalities.price` — servicio de pago
- `modalities.sign` — lengua de signos

Los anteriores (`appointment`, `inscription`, `orientation`, `inconditionnel`) no cambian.

### 7. Nuevas opciones de ordenación y paginación

- `options.sortBy`: `createdAt | lieu_id | name | distance | slugs.infos.name | status | updatedAt`
- `options.sortValue`: `1` (ascendente) / `-1` (descendente)
- `options.limit` por defecto: **10** (vs. 20 en la API actual)

### 8. Nuevos filtros de búsqueda

- `placeType`: `PLACE` (por defecto) o `ITINERARY` — lugar fijo o itinerario móvil
- `locations[]`: búsqueda multi-zona (p. ej. para un widget)

### 9. Campos de dirección — alias bilingües, eliminación futura anunciada

Los campos franceses de los objetos `position` (`adresse`, `codePostal`, `complementAdresse`, `departement`, `departementCode`, `pays`, `ville`) se **mantienen como alias** de sus equivalentes en inglés (`address`, `postalCode`, `additionalInformation`, `department`, `departmentCode`, `country`, `city`) en esta versión. Se **eliminarán en una versión posterior** — adapte ya su código a los nombres en inglés.

### 10. Endpoint `/place/:lieu_id`

Por ahora, la nueva API expone **únicamente** `POST /search`. La recuperación de un lugar por `lieu_id` está por confirmar (llegará en una versión posterior o vía un parámetro de filtro).

## Documentación interactiva

- **Interactiva**: `/api/docs` (Scalar) — esquemas, ejemplos, llamadas ejecutables
- **Spec JSON**: `/openapi/<version>.json`
- **Versión actual**: `2026-01-01`

Se publicará un changelog automático con cada nueva versión.

## Migración — paso a paso

1. **Apuntar** a la nueva base URL (_por confirmar_)
2. **Reemplazar** `/new-search` por `/search`
3. **Mapear** los IDs numéricos de categoría a sus slugs (tabla de conversión en Scalar)
4. **Filtrar** únicamente sobre `fr`, `es`, `ad` en `location.country` y `geoValue` cuando `geoType=pays`
5. **Migrar** el formato de `updatedAt.value` a ISO 8601
6. **Adaptar** `publics.age` (objeto `{min, max}`) y `publics.accueil` (enum)
7. **Renombrar** los campos de dirección de FR a EN en su código de mapeo (transición suave, pero anticipar)
8. **Probar** contra `/api/docs`

La API actual (`https://api.soliguide.fr`) sigue disponible durante la fase de transición.

## Lo que no cambia

- Autenticación: cabecera `Authorization: JWT <token>`, mismo token
- Estructura general de la respuesta: `{ nbResults: number, places: Place[] }`
- Estructura `services_all[]` para los servicios de un lugar
- Valores de `geoType`: permanecen en francés (`pays`, `ville`, `codePostal`, `departement`, `region`, `position`, `citiesGroup`, `inconnu`)
- Formato de horarios (entero `HMM` o `HHMM`, p. ej. `930` = 9:30)

## Calendario

| Hito                             | Fecha           |
| -------------------------------- | --------------- |
| Disponibilidad de la API pública | _por confirmar_ |
| Anuncio oficial a los socios     | _por confirmar_ |
| Fin del soporte de la API actual | _por confirmar_ |

## Soporte

- Email: **api@solinum.org**
- Documentación interactiva: `/api/docs`
- Documentación heredada (referencia durante la transición): https://solinum.notion.site/API-Solidarit-5ca44f60963741f1b22874d5f566c8cb
