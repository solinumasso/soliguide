# Rapport d'analyse des performances des tests

**Date**: 2026-02-10
**Total tests**: 1039 tests
**Tests passants**: 1017 (97.9%)
**Tests échouants**: 22 (2.1%)

## 🔴 Problèmes critiques identifiés

### 1. **track-search-places.service.spec.ts** - 40.4s (FAIL)

**Problème**: Timeout de 30s sur les hooks à cause de `jest.useFakeTimers()`

**Fichier**: `src/middleware/analytics/track-search-places.service.spec.ts:45`

**Cause**:
```typescript
jest.useFakeTimers(); // Ligne 45
```

Les fake timers bloquent les opérations async dans les hooks `beforeAll`/`afterAll`, notamment la connexion MongoDB.

**Solution recommandée**:
```typescript
// Ligne 45
jest.useFakeTimers({
  doNotFake: ['nextTick', 'setImmediate', 'setTimeout', 'setInterval']
});

// OU retirer complètement si non nécessaire
afterAll(() => {
  jest.useRealTimers();
});
```

**Impact**: Économie de ~40s par exécution

---

### 2. **users-me.routes.spec.ts** - 48.4s (FAIL)

**Problème**: Trop de tests avec requêtes réseau répétées

**Fichier**: `e2e/users/users-me.routes.spec.ts:44,87`

**Cause**:
- `describe.each(Object.values(TestAccounts))` crée 11 suites × ~15 tests = **165 tests**
- `beforeEach` fait une requête GET `/users/me` avant CHAQUE test (ligne 87-100)
- Total: **165 requêtes HTTP supplémentaires**

**Solutions recommandées**:

**Option A - Optimiser beforeEach** (recommandé):
```typescript
// Utiliser beforeAll au lieu de beforeEach si les données ne changent pas
beforeAll(async () => {
  const response = await getUser();
  userId = response.body.user_id;
  userData = { /* ... */ };
});
```

**Option B - Réduire les comptes testés**:
```typescript
// Tester uniquement les cas critiques au lieu de tous les comptes
describe.each(ALLOWED_USERS)( // Au lieu de Object.values(TestAccounts)
  `Tests of the route '${baseUrl}'`,
  (currentAccountTest) => {
    // ...
  }
);
```

**Impact**: Économie de ~35-40s par exécution

---

### 3. **Tests e2e généraux** - 15-20s chacun (plusieurs FAIL)

**Problème**: Tests e2e lents avec erreurs de duplicate keys et process.exit

**Fichiers concernés**:
- `e2e/form-place/temp-infos.routes.spec.ts` - 19.7s
- `e2e/admin-places/admin-place.routes.spec.ts` - 18.7s
- `e2e/users/admin-users.routes.spec.ts` - 17.1s
- `e2e/users/signup-admin-territory.spec.ts` - 15.9s
- `e2e/health/health.routes.spec.ts` - 14.1s

**Causes**:
1. Erreurs `MongoServerError: E11000 duplicate key` suggèrent un manque de nettoyage entre tests
2. Erreurs `process.exit called with "1"` indiquent des crashes non gérés
3. Tests qui appellent la DB sans isolation

**Solutions recommandées**:

**A. Ajouter un nettoyage de DB dans les hooks**:
```typescript
beforeEach(async () => {
  // Nettoyer les données de test créées
  await PlaceModel.deleteMany({ lieu_id: { $gte: 10000 } }); // IDs de test
  await UserModel.deleteMany({ mail: /test.*@/ }); // Emails de test
});
```

**B. Utiliser des IDs uniques par test**:
```typescript
const testId = Date.now() + Math.random(); // ID unique par exécution
const testPlace = { lieu_id: testId, /* ... */ };
```

**C. Isoler les tests avec transactions MongoDB** (si replica set disponible):
```typescript
let session;
beforeEach(async () => {
  session = await mongoose.startSession();
  session.startTransaction();
});

afterEach(async () => {
  await session.abortTransaction();
  session.endSession();
});
```

**Impact**: Économie de ~20-30s + réduction des flaky tests

---

## 📊 Autres optimisations possibles

### 4. Tests unitaires qui accèdent à la DB - 10-14s

**Fichiers**:
- `search.service.spec.ts` - 11.1s
- `manage-places-and-users.controller.spec.ts` - 11.9s
- `invitations.service.spec.ts` - 10.7s
- `invite-user.controller.spec.ts` - 10.4s

**Recommandation**: Mock les appels DB pour les tests unitaires
```typescript
jest.mock('../../models/place.model');
jest.mock('../../services/database.service');
```

**Impact potentiel**: Réduction de 50-80% du temps d'exécution

---

## 🎯 Estimation des gains

| Optimisation | Temps économisé | Difficulté |
|--------------|----------------|------------|
| Fix fake timers | ~40s | ⭐ Facile |
| Optimiser users-me.routes | ~35s | ⭐⭐ Moyen |
| Nettoyer tests e2e | ~30s | ⭐⭐⭐ Difficile |
| Mock DB dans tests unitaires | ~20s | ⭐⭐ Moyen |
| **TOTAL POTENTIEL** | **~2 minutes** | |

---

## 🚀 Plan d'action recommandé

### Phase 1 - Quick wins (1-2h)
1. ✅ **Fix connexion MongoDB dans jest-setup.ts** (DÉJÀ FAIT)
2. 🔧 Fix `jest.useFakeTimers()` dans track-search-places.service.spec.ts
3. 🔧 Changer `beforeEach` → `beforeAll` dans users-me.routes.spec.ts

### Phase 2 - Nettoyage tests e2e (3-4h)
4. 🔧 Ajouter nettoyage DB dans afterEach des tests e2e
5. 🔧 Utiliser des IDs uniques pour éviter les duplicates
6. 🔧 Gérer les erreurs `process.exit` dans les tests

### Phase 3 - Optimisation avancée (optionnel)
7. 🔧 Mock les appels DB dans les tests unitaires
8. 🔧 Paralléliser les tests e2e indépendants
9. 🔧 Utiliser des transactions MongoDB pour l'isolation

---

## 🔍 Commandes utiles

```bash
# Lancer un seul test lent pour débugger
yarn test src/middleware/analytics/track-search-places.service.spec.ts

# Voir le timing détaillé de tous les tests
yarn test --verbose 2>&1 | grep -E "(PASS|FAIL).*\([0-9]"

# Lancer les tests sans les e2e (plus rapide)
yarn test --testPathIgnorePatterns=e2e

# Lancer les tests en série (pour débugger les race conditions)
yarn test --runInBand
```

---

## 📝 Notes

- Configuration Jest actuelle : timeout de 30s (jest.config.ts:30)
- Tests e2e utilisent la DB de test : `soliguide_test`
- Certains tests échouent à cause de duplicate keys → problème de nettoyage
- Le fix de connexion MongoDB a déjà résolu les timeouts de 10s sur document.services et photo.services
