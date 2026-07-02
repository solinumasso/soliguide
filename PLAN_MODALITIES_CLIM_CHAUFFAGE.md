# Plan — Ajout modalité d'accueil : climatisation

## 1. Objectif

Ajouter à la classe `Modalities` un sous-objet `thermalComfort` indiquant si le lieu est **chauffé** (`heated`) et/ou **climatisé** (`airConditioned`).

- **Les deux champs sont dans le modèle** (persistés, validés côté API, exposés côté common).
- **Seule la clim est affichée / filtrable / éditable dans l'UI** pour ce PR.
- `heated` est stocké et acceptable en API, mais aucune UI (form, display, filtre) n'y touche pour l'instant. Extension UI = follow-up trivial (miroir des blocs `airConditioned`).

Nom du sous-objet retenu : **`ThermalComfort`** (englobe chauffage + clim, et pourra accueillir de l'isolation plus tard sans changer de nom).

### Contraintes retenues

1. **Sémantique 3-états** : `true` = confirmé oui, `false` = confirmé non, `null` = "on ne sait pas". La valeur par défaut à l'instanciation est `null`.
2. **Pas de propagation au niveau service** : `thermalComfort` est UNIQUEMENT au niveau du lieu. Les services héritent implicitement et ne surchargent pas.
3. **Normalisation systématique par classe** : toute donnée modalities entrant dans un code TS passe par `new Modalities(input)`, qui instancie systématiquement `this.thermalComfort = new ThermalComfort(input?.thermalComfort)`. La classe `ThermalComfort` matérialise les champs manquants à `null`. Résultat : à l'usage, `modalities.thermalComfort` n'est **jamais** `undefined` — plus besoin de guards partout.
4. **Filtre recherche public** : bouton dédié visible qui exécute un filtre sur `modalities.thermalComfort.airConditioned`.
5. **Pas de touche `JSON.stringify` maintenant** : les diffs existants (`display-place-changes`, etc.) resteront en place. La normalisation par classe suffit à protéger le comportement. Un refactor propre du comparateur est prévu en follow-up.

---

## 2. Structure retenue

### Interface + classe

```ts
// packages/common/src/modalities/interfaces/ThermalComfort.interface.ts
export interface ThermalComfortData {
  heated: boolean | null;
  airConditioned: boolean | null;
}
```

```ts
// packages/common/src/modalities/classes/ThermalComfort.class.ts
import type { ThermalComfortData } from "../interfaces";

export class ThermalComfort implements ThermalComfortData {
  public heated: boolean | null;
  public airConditioned: boolean | null;

  constructor(thermalComfort?: Partial<ThermalComfortData> | null) {
    this.heated = thermalComfort?.heated ?? null;
    this.airConditioned = thermalComfort?.airConditioned ?? null;
  }
}
```

Les deux champs existent en modèle. Seul `airConditioned` est câblé dans l'UI (form, display, filtre) pour ce PR ; `heated` traverse la stack silencieusement en attendant son UI.

### Intégration dans `Modalities`

```ts
// packages/common/src/modalities/classes/Modalities.class.ts
public thermalComfort: ThermalComfort;   // NON-optionnel côté classe (toujours instancié)

constructor(modalities?: Partial<Modalities>) {
  // ... champs existants inchangés
  this.thermalComfort = new ThermalComfort(modalities?.thermalComfort);
}
```

**Effet clé** : après `new Modalities(mongoDoc)`, on a systématiquement `modalities.thermalComfort.airConditioned` et `modalities.thermalComfort.heated` = `boolean | null`, jamais `undefined`. Les vieilles places Mongo sans le champ ressortent avec `thermalComfort: { heated: null, airConditioned: null }` en mémoire. Le champ reste absent en base tant que la place n'est pas ré-enregistrée.

### Nommage clés i18n

- `ACCESS_CONDITION_AIR_CONDITIONED` — "Lieu climatisé"
- `ACCESS_CONDITION_NOT_AIR_CONDITIONED` — "Lieu non climatisé"

Le rendu affiche uniquement quand la valeur n'est pas `null`. **Pas de clés `HEATED`/`NOT_HEATED` dans ce PR** — à ajouter en follow-up quand on branchera l'UI du chauffage.

---

## 3. Fonctions de comparaison — comportement attendu

### Frontend — `display-place-changes.component.ts:275-320`

La méthode `computeModalitiesChanges` fait :
1. `JSON.stringify(oldPlace.modalities) !== JSON.stringify(newPlace.modalities)` pour détecter un changement.
2. Un tableau de flags booléens par sous-modalité pour classer en `added` / `deleted` / `modified`.

**Grâce à la normalisation par classe**, si à la fois `oldPlace` et `placeChanged` passent par `new Modalities(...)` avant d'arriver ici (ce qui est déjà le cas ou à s'assurer), alors :
- `old.thermalComfort` et `new.thermalComfort` sont tous deux `{ airConditioned: null }` par défaut.
- `JSON.stringify` produit la même chaîne pour deux vieilles places → pas de faux positif.

**Ajout requis** : entrées dans `modalityFlags` pour que le badge `added`/`deleted` fonctionne pour la clim :
```ts
[
  Boolean(oldModalities?.thermalComfort?.airConditioned !== null),
  Boolean(newModalities?.thermalComfort?.airConditioned !== null),
],
```
(Un `null → true|false` = ajout d'info, `true|false → null` = suppression d'info.)

### API — `place-changes-utils.ts:189-193`

Le case `modalities` fait un `dot.pick`. Pas de changement requis **à condition** que la place et l'ancienne version soient passées par `new Modalities(...)` en amont. À valider dans le service concerné ; sinon on ajoute une normalisation locale.

### Follow-up prévu (hors PR)

Remplacer les `JSON.stringify(...)` par une vraie fonction de diff/comparaison typée, avec traitement propre du 3-états. Ticket à créer.

---

## 4. Filtre recherche — bouton dédié

### API

- `packages/api/src/search/utils/parsers/parse-modalities.ts` — ajouter un case dédié `thermalComfort.airConditioned`. Le filtre construit une requête Mongo `{ "modalities.thermalComfort.airConditioned": true }` quand l'utilisateur active le filtre.
- `packages/api/src/search/dto/search.dto.ts` — accepter le paramètre `airConditioned` (`optional().isBoolean()`).
- `packages/common/src/search-places/interfaces/SearchModalities.interface.ts` — ajouter `airConditioned?: boolean;`.
- `packages/common/src/search-places/constants/SEARCH_MODALITIES_FILTERS.const.ts` — **à décider** : soit on ajoute `"airConditioned"` à la liste générique (si le code exploite cette liste pour itérer / sérialiser URL), soit on garde à part parce que le champ est dans un sous-objet et pas au niveau racine.

  **Recommandation** : lire d'abord ce à quoi sert `SEARCH_MODALITIES_FILTERS` (probablement les checkboxes génériques dans l'UI). Vu qu'on veut un **bouton dédié**, garder `thermalComfort.airConditioned` hors de cette liste et l'implémenter à part dans l'UI + parser.

### Frontend + web-app UI

- Bouton dédié visible dans la barre de filtres (frontend admin + web-app public).
- Radio switch avec emoji ❄️.
- Ajout du paramètre à la query string / navigation.

---

## 5. Compatibilité — pourquoi c'est safe

- Documents Mongo existants : pas de champ `thermalComfort` en base. À la lecture, ils passent par `new Modalities()` → `thermalComfort: { airConditioned: null }` en mémoire. Aucun effet visible côté rendu (on filtre `null`).
- Aucune migration Mongo requise.
- Schema Mongoose : sous-champ `thermalComfort.airConditioned: { type: Boolean, default: null }`, pas de `required`, pas de default sur l'objet parent.
- DTO API : validators `.optional({ nullable: true })`.
- Le fait que le constructeur normalise **toujours** évite les régressions de diff sans avoir à toucher au comparateur actuel.

---

## 6. Plan d'exécution (ordre strict)

Ordre : **common → api → frontend → widget → web-app**.

### Étape 1 — `@soliguide/common`

Nouveaux fichiers :

- `packages/common/src/modalities/interfaces/ThermalComfort.interface.ts` — `ThermalComfortData`.
- `packages/common/src/modalities/classes/ThermalComfort.class.ts` — classe `ThermalComfort`.

Modifications :

- `packages/common/src/modalities/classes/index.ts` — export `ThermalComfort`.
- `packages/common/src/modalities/interfaces/index.ts` — export `ThermalComfortData`.
- `packages/common/src/modalities/classes/Modalities.class.ts` — `public thermalComfort: ThermalComfort` + `this.thermalComfort = new ThermalComfort(modalities?.thermalComfort)` dans le constructeur.
- `packages/common/src/modalities/enums/ModalitiesElement.enum.ts` — `THERMAL_COMFORT = "thermalComfort"`.
- `packages/common/src/translations/functions/translateModalities.ts` — blocs :
  ```ts
  if (modalities.thermalComfort.airConditioned === true) {
    stringModalities += i18next.t("ACCESS_CONDITION_AIR_CONDITIONED", { lng }) + "\n";
  } else if (modalities.thermalComfort.airConditioned === false) {
    stringModalities += i18next.t("ACCESS_CONDITION_NOT_AIR_CONDITIONED", { lng }) + "\n";
  }
  ```
- `packages/common/src/translations/tests/mocks/PLACE_MODALITIES.mock.ts` — 2 nouveaux cas (`airConditioned: true`, `airConditioned: false`).
- `packages/common/src/translations/tests/translateModalities.spec.ts` — couvre les nouveaux mocks.
- `packages/common/src/search-places/interfaces/SearchModalities.interface.ts` — `airConditioned?: boolean`.
- `packages/common/src/translations/locales/fr.json` — 2 clés en FR (source).

**PAS modifié** :
- `SEARCH_MODALITIES_FILTERS.const.ts` (filtre dédié géré hors liste).
- `PlaceChangesSection.enum.ts` (section reste `modalities`).
- `PlaceTranslatedFieldElement.enum.ts`, `EXPORT_COLUMNS.const.ts`.
- Mock `ONLINE_PLACE.mock.ts` reste valide.

**Build** : `yarn build --scope @soliguide/common`.

### Étape 2 — `@soliguide/api`

- `packages/api/src/place/models/modalities.model.ts` — schema Mongoose :
  ```ts
  thermalComfort: {
    type: {
      heated: { type: Boolean, default: null },
      airConditioned: { type: Boolean, default: null },
    },
    required: false,
    _id: false,
  }
  ```
- `packages/api/src/place/dto/modalities.dto.ts` — validators :
  - `body("modalities.thermalComfort").optional().isObject()`
  - `body("modalities.thermalComfort.heated").optional({ nullable: true }).isBoolean()`
  - `body("modalities.thermalComfort.airConditioned").optional({ nullable: true }).isBoolean()`
- `packages/api/src/search/utils/parsers/parse-modalities.ts` — ajouter parsing filtre dédié `airConditioned` → `{ "modalities.thermalComfort.airConditioned": true }`.
- `packages/api/src/search/dto/search.dto.ts` — accepter param `airConditioned`.
- `packages/api/src/place/interfaces/ApiModalities.interface.ts` — hérite automatiquement.
- `packages/api/e2e/admin-places/bodies/STEP_MODALITIES.const.ts` — scénario PATCH.
- `packages/api/resources/locales/fr.json` — copie automatique depuis common (vérifier prebuild).

**Sync Airtable** : hors scope, à voir plus tard.

### Étape 3 — `@soliguide/frontend` (Angular)

- `modules/form-place/components/modalities-form/modalities-form.component.ts`
  - Handler `setAirConditioned(value: boolean | null)`.
  - Grâce à `new Modalities()` en amont, pas besoin d'init défensive.
- `modules/form-place/components/modalities-form/modalities-form.component.html`
  - Section "Climatisation" avec radio switch 3-états et emoji ❄️ (Oui / Non / Ne sait pas).
- `modules/admin-place-shared/components/display-modalities/`
  - Affichage lecture : n'afficher que si `airConditioned !== null`.
- `modules/place/components/display-modalities-inline/` — idem.
- `modules/place-changes/components/display-place-changes/display-place-changes.component.ts:275-320`
  - Ajouter le flag dans `modalityFlags` pour que les badges `added`/`deleted` fonctionnent.
- `modules/search/components/search/search.component.*`
  - Ajouter le bouton dédié ❄️ dans la barre de filtres.
- Tests `.spec.ts`.

**PAS modifié** :
- Composants au niveau service (thermalComfort n'est pas propagé).

### Étape 4 — `@soliguide/widget`

- `modules/iframe-generator/components/modalities-form/` — miroir frontend.
- `modules/search/components/search/search.component.ts` — bouton dédié ❄️.

### Étape 5 — `@soliguide/web-app` (SvelteKit — public)

- `lib/models/placeDetails.ts:99-176` — `buildModalities` rend `airConditioned` si ≠ `null`.
- `lib/models/placeDetails.spec.ts` — cas de test.
- `routes/[lang]/places/[identifier]/functions.ts` — mapping des 2 nouvelles clés i18n.
- `lib/models/placeDetailsData.mock.ts` — scénario thermalComfort.
- UI recherche publique — bouton dédié ❄️.

### Étape 6 — Traductions

- Poser uniquement le FR (source) dans `packages/common/src/translations/locales/fr.json`.
- Weblate ouvrira les PR de traduction EN/ES/CA/… automatiquement.

---

## 7. Zones à valider (rapide)

1. **Emoji ❄️** OK ou préfères-tu autre chose (flocon `❄`, air `💨`, thermostat `🌡`) ?
2. **Nommage clé i18n** : `ACCESS_CONDITION_AIR_CONDITIONED` reste cohérent avec les autres `ACCESS_CONDITION_*`. OK ?
3. **Filtre recherche** : bouton dédié = un unique switch (Oui / rien) ou un tri-état complet (Oui / Non / Peu importe) ? Ma reco : bi-état classique (Peu importe / Oui), car filtrer sur "Non climatisé" n'apporte probablement rien à l'usage.

---

## 8. Ordre des commits

1. `feat(common): add optional thermalComfort modality`
2. `feat(api): support thermalComfort modality with dedicated search filter`
3. `feat(frontend): edit, display and filter thermalComfort modality`
4. `feat(widget): edit, display and filter thermalComfort modality`
5. `feat(web-app): display and filter thermalComfort modality`

Un seul PR groupé sur `feat-add-clim`, rebase sur `develop`.

---

## 9. Résumé — impact estimé

| Package | Fichiers touchés (approx.) | Complexité |
|---|---|---|
| common | ~10 (dont 2 nouveaux) | Faible |
| api | ~5 | Faible (schema + DTO + parser filtre) |
| frontend | ~8 | Moyenne (UI 3-états + place-changes + filtre) |
| widget | ~3 | Faible (miroir) |
| web-app | ~5 | Faible (affichage + filtre) |
| **Total** | **~31 fichiers** | Migration Mongo : **0** |

### Follow-ups explicites (hors PR)

- Brancher l'UI de `heated` (miroir de `airConditioned` : form, display, filtre, i18n `ACCESS_CONDITION_HEATED` / `NOT_HEATED`).
- Remplacer les `JSON.stringify(oldPlace) !== JSON.stringify(newPlace)` par un vrai comparateur propre.
- Mapping Airtable si sync bidirectionnelle nécessaire.
