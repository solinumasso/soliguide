# Analyse `isOpenToday` - Bugs, corrections et harmonisation

## Fichiers modifiés

| Fichier                                      | Modification                                               |
| -------------------------------------------- | ---------------------------------------------------------- |
| `api/src/place/services/holidays.service.ts` | Fix: stocker les jours fériés fetched dans `this.holidays` |
| `api/src/place/utils/isOpenToday.ts`         | Harmonisation `isPlaceOpenToday` et `isServiceOpenToday`   |

## Fichiers impactés (non modifiés, bénéficient des corrections)

| Fichier                                                   | Rôle                                                                  |
| --------------------------------------------------------- | --------------------------------------------------------------------- |
| `api/src/place/services/isOpenToday.service.ts`           | Batch cron `setIsOpenToday()` - appelle les mêmes fonctions corrigées |
| `api/src/place/utils/updateServicesAfterPatch.ts`         | Appelle `isServiceOpenToday()` pour chaque service                    |
| `api/src/place/controllers/admin-place.controller.ts`     | 4 endpoints appellent `isPlaceOpenToday()`                            |
| `api/src/place/controllers/admin-temp-info.controller.ts` | Appelle `isServiceOpenToday()`                                        |

**Note** : Aucune modification dans `@soliguide/common` pour éviter les dommages collatéraux sur le frontend. Le typage de `ApiPlace.tempInfos` reste `any` dans common ; le cast `as unknown as any` dans `computePlaceOpeningStatus` est conservé.

---

## Bugs corrigés

### BUG 1 : `HolidaysService` ne stockait jamais les jours fériés

**Avant** : `fetchHolidaysForCountries()` retournait les données mais ne les stockait jamais dans `this.holidays`. `getHolidaysByCountry()` ignorait la valeur de retour.

**Conséquence** : `isDayHolidayForPostalCode()` retournait toujours `false`. Les fermetures pour jours fériés n'étaient jamais appliquées.

**Fix** : Ajout de `Object.assign(this.holidays, fetched)` dans `fetchHolidaysForCountries()`.

### BUG 2 : `isPlaceOpenToday` / `isServiceOpenToday` n'utilisaient pas `computeTempIsActive`

**Avant** :

```typescript
// Vérification manuelle sans dateFin, dépendant d'un actif potentiellement périmé
if (place.tempInfos.closure.actif && place.tempInfos.closure.dateDebut <= today) {
  return false;
}
```

**Conséquences** :

- Pas de vérification de `dateFin` → fermetures fantômes après expiration
- `actif` stocké en BDD pouvait être périmé (snapshot calculé à l'écriture)
- Fermetures créées > 15j avant leur début avaient `actif: false` → ignorées

**Après** :

```typescript
// Utilise computeTempIsActive de @soliguide/common (vérifie actif + isWithinInterval)
if (computeTempIsActive(place.tempInfos.closure)) {
  return false;
}
```

### BUG 3 : Status DRAFT non filtré et country non vérifié en early return

**Avant** : Seul `PERMANENTLY_CLOSED` provoquait un early return. Pas de vérification de `country`.

**Après** :

```typescript
const position = getPosition(place);
if (place.status === PlaceStatus.PERMANENTLY_CLOSED || place.status === PlaceStatus.DRAFT || !position?.country) {
  return false;
}
```

---

## Harmonisation réalisée

### Logique unifiée `isPlaceOpenToday`

```
isPlaceOpenToday(place):
│
├─ DRAFT / PERMANENTLY_CLOSED / pas de country → false
├─ computeTempIsActive(closure) → false
├─ holidays + closedHolidays === CLOSED → false
├─ computeTempIsActive(hours) → tempInfos.hours.hours[day].open
└─ newhours[day].open
```

### Logique unifiée `isServiceOpenToday`

```
isServiceOpenToday(service, place):
│
├─ DRAFT / PERMANENTLY_CLOSED / pas de country → false
├─ computeTempIsActive(service.close) || computeTempIsActive(place closure) → false
├─ holidays + closedHolidays === CLOSED → false
├─ !differentHours && computeTempIsActive(place hours) → tempInfos.hours.hours[day].open
└─ service.hours[day].open
```

### Cohérence API ↔ Common ↔ Batch

| Aspect                 | Avant                                                              | Après                              |
| ---------------------- | ------------------------------------------------------------------ | ---------------------------------- |
| Temp closure check     | API: `actif && dateDebut <= today` / Common: `computeTempIsActive` | Tous: `computeTempIsActive`        |
| Vérification `dateFin` | API: non / Common: oui                                             | Tous: oui (via `isWithinInterval`) |
| Status DRAFT           | API `isPlaceOpenToday`: non filtré / Batch: filtré en query        | Tous: filtré                       |
| Country check          | API: vérif tardive / Batch: vérif en query                         | Tous: early return                 |
| Services               | `updateServicesAfterPatch` appelait déjà `isServiceOpenToday`      | Inchangé, bénéficie des fixes      |

### Typage (à faire ultérieurement)

Le typage de `ApiPlace.tempInfos: any` dans `@soliguide/common` n'a pas été modifié pour éviter les dommages collatéraux sur le frontend. À planifier dans un ticket dédié avec vérification de l'impact sur tous les packages consommateurs.
