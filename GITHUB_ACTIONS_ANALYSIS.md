<!--
Soliguide: Useful information for those who need it

SPDX-FileCopyrightText: © 2026 Solinum

SPDX-License-Identifier: AGPL-3.0-only

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published
by the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
-->

# Analyse des GitHub Actions - Rapport de bugs et problèmes

**Date**: 2026-02-04
**Auteur**: Analyse automatisée

## Résumé

Ce rapport identifie les bugs, problèmes potentiels et améliorations possibles dans les workflows GitHub Actions du projet Soliguide.

---

## 🔴 Bugs critiques

### 1. Référence manquante dans `_test-package.yml`

**Fichier**: `.github/workflows/_test-package.yml`
**Lignes**: 47, 59, 62

**Problème**:
Le workflow référence `needs.affected_packages.outputs.node_version` mais le job `affected_packages` n'existe pas dans le contexte de ce workflow réutilisable.

```yaml
key: ${{ runner.os }}-${{ needs.affected_packages.outputs.node_version }}-prettiercache-${{ inputs.package }}-${{ github.ref }}
```

**Impact**: Le cache ne fonctionnera pas correctement car la clé contiendra une valeur vide ou undefined.

**Ligne concernée**:
- Prettier cache: ligne 47
- Eslint cache: ligne 59
- Restore keys: lignes 49-50, 61-62

---

### 2. Condition `always()` mal positionnée

**Fichier**: `.github/workflows/_build-and-test.yml`
**Ligne**: 634

**Problème**:
La condition logique est ambiguë:
```yaml
if: ${{ !startsWith(github.ref, 'refs/pull/') || needs.affected_packages.outputs.to_test != '[]' && always() }}
```

La fonction `always()` devrait être en dehors de l'expression OR/AND pour être évaluée correctement.

**Impact**: Le job `send-test-coverage` pourrait ne pas s'exécuter dans certaines situations attendues.

**Correction suggérée**:
```yaml
if: ${{ always() && (!startsWith(github.ref, 'refs/pull/') || needs.affected_packages.outputs.to_test != '[]') }}
```

---

### 3. Job `build_container` avec `if: always()`

**Fichier**: `.github/workflows/_build-container-image.yml`
**Ligne**: 84

**Problème**:
Le job principal utilise `if: ${{ always() }}` alors qu'il dépend des jobs `docker_meta*`:
```yaml
build_container:
  name: Build container image ${{ inputs.image_name }}
  if: ${{ always() }}
  needs:
    - docker_meta
    - docker_meta1
    - docker_meta2
```

**Impact**: Le job s'exécutera même si les metadata jobs échouent, ce qui causera des erreurs lors de l'accès aux outputs.

**Correction suggérée**: Retirer le `if: always()` ou ajouter une condition qui vérifie que les jobs nécessaires ont réussi.

---

## ⚠️ Problèmes moyens

### 4. Secrets non requis dans `_deploy-to-test-qovery.yml`

**Fichier**: `.github/workflows/_deploy-to-test-qovery.yml`
**Lignes**: 46-48

**Problème**:
Les secrets sont déclarés sans attribut `required`:
```yaml
secrets:
  QOVERY_CLI_ACCESS_TOKEN:
  GCORE_API_KEY:
```

**Impact**: Si les secrets ne sont pas fournis par l'appelant, le workflow échouera avec une erreur peu claire.

**Correction suggérée**:
```yaml
secrets:
  QOVERY_CLI_ACCESS_TOKEN:
    required: true
  GCORE_API_KEY:
    required: true
```

---

### 5. Absence de concurrency dans `develop.yml`

**Fichier**: `.github/workflows/develop.yml`
**Problème**: Le workflow ne définit pas de groupe de concurrence contrairement aux autres workflows principaux (pr.yml, release.yml, tag.yml, hotfix.yml).

**Impact**: Plusieurs exécutions peuvent se chevaucher lors de pushs rapides sur develop, gaspillant des ressources et créant des déploiements concurrents.

**Correction suggérée**:
```yaml
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true
```

---

### 6. Duplication de code massive dans `_deploy-to-test-qovery.yml`

**Fichier**: `.github/workflows/_deploy-to-test-qovery.yml`
**Lignes**: 167-617

**Problème**: Code hautement répétitif pour créer les domaines de chaque service (API, Location API, Soligare, Web App, Frontend, Widget). La fonction shell `create_domain_if_not_exists` est redéfinie 6 fois de manière identique.

**Impact**:
- Difficile à maintenir
- Risque d'incohérence entre les services
- Fichier très long (651 lignes)

**Amélioration suggérée**: Extraire la logique commune dans un script shell réutilisable ou un workflow composite.

---

### 7. Logique du gatekeeper potentiellement fragile

**Fichier**: `.github/workflows/_build-and-test.yml`
**Lignes**: 745-890

**Problème**: Le job gatekeeper contient beaucoup de vérifications conditionnelles qui peuvent être difficiles à maintenir. Si un nouveau package est ajouté, il faut mettre à jour plusieurs endroits.

**Impact**: Risque d'oubli lors de l'ajout de nouveaux packages.

**Amélioration suggérée**: Générer dynamiquement les vérifications ou utiliser une approche plus déclarative.

---

## 📝 Problèmes mineurs et améliorations

### 8. Typo dans `_docker-meta.yml`

**Fichier**: `.github/workflows/_docker-meta.yml`
**Lignes**: 59, 68, 82

**Problème**: "disbale" au lieu de "disable"
```yaml
# disbale latest, we've no need for it
```

**Impact**: Aucun impact fonctionnel, juste une typo dans les commentaires.

---

### 9. Environnement commenté dans cron

**Fichier**: `.github/workflows/cron-clever-cloud-stop-in-the-evening.yml`
**Ligne**: 36

**Problème**:
```yaml
environment_prefix:
#          - DEMO
          - TEST1
          - TEST2
```

**Impact**: Peut créer de la confusion. Si DEMO doit être désactivé, le retirer complètement ou ajouter un commentaire explicatif.

---

### 10. Exclusion de branches potentiellement redondante

**Fichier**: `.github/workflows/pr.yml`
**Lignes**: 23-25

**Problème**:
```yaml
branches-ignore:
  - "renovate/**"
  - hotfix
```

Il existe déjà un workflow spécifique pour Renovate (`pr-renovate.yml`) qui se déclenche sur les branches `renovate/**`.

**Impact**: Peut créer de la confusion sur quel workflow s'exécute réellement. Cependant, GitHub Actions gère correctement les deux cas.

---

### 11. Condition fragile dans `create-release.yml`

**Fichier**: `.github/workflows/create-release.yml`
**Ligne**: 29

**Problème**:
```yaml
if: "!contains(github.event.head_commit.message, 'chore')"
```

Cette condition empêche la création de release si le message de commit contient "chore" n'importe où, même dans une description ou un mot composé.

**Impact**: Pourrait bloquer des releases légitimes si le mot "chore" apparaît dans le contexte d'une description.

**Amélioration suggérée**: Utiliser une expression régulière plus précise qui vérifie le préfixe du message (`^chore:`).

---

### 12. Nommage incohérent des environnements dans matrices

**Fichier**: `.github/workflows/cron-clever-cloud-stop-in-the-evening.yml`
**Lignes**: 35-38

**Problème**: La matrice utilise des noms en MAJUSCULES (TEST1, TEST2) alors que d'autres workflows utilisent des noms en minuscules (develop, staging, production).

**Impact**: Peut créer de la confusion lors de la maintenance.

---

## 🔍 Observations architecturales

### 13. Pas de timeout défini sur les jobs

**Observation**: Aucun workflow ne définit de `timeout-minutes` au niveau des jobs.

**Risque**: Un job bloqué pourrait consommer des minutes GitHub Actions inutilement (max 6h par défaut).

**Recommandation**: Ajouter des timeouts appropriés aux jobs longs (build, test, deploy).

---

### 14. Utilisation de `docker pull --pull always`

**Fichier**: `.github/workflows/_build-and-test.yml`
**Ligne**: 274

**Observation**:
```yaml
docker run --pull always
```

Le flag `--pull always` n'est pas nécessaire car l'image a déjà été pullée juste avant (ligne 261).

**Impact**: Performance légèrement réduite.

---

### 15. Secrets GH_TOKEN vs GITHUB_TOKEN

**Fichier**: `.github/workflows/create-release.yml`
**Ligne**: 46

**Observation**: Utilise `secrets.GH_TOKEN` au lieu du `secrets.GITHUB_TOKEN` par défaut.

**Raison possible**: Probablement nécessaire pour déclencher d'autres workflows (le GITHUB_TOKEN par défaut ne déclenche pas d'événements).

**Recommandation**: Ajouter un commentaire expliquant pourquoi un PAT personnalisé est nécessaire.

---

## 📊 Statistiques

- **Total de workflows**: 28
- **Workflows réutilisables**: 9 (préfixe `_`)
- **Workflows principaux**: 19
- **Bugs critiques**: 3
- **Problèmes moyens**: 4
- **Problèmes mineurs**: 8
- **Lignes de code total**: ~3500 lignes YAML

---

## 🎯 Recommandations prioritaires

1. **Priorité 1**: Corriger la référence `needs.affected_packages` dans `_test-package.yml`
2. **Priorité 2**: Fixer la condition `always()` dans `send-test-coverage`
3. **Priorité 3**: Revoir le `if: always()` dans `build_container`
4. **Priorité 4**: Ajouter `required: true` aux secrets de Qovery
5. **Priorité 5**: Ajouter la concurrency au workflow develop
6. **Priorité 6**: Refactoriser `_deploy-to-test-qovery.yml` pour réduire la duplication

---

## 📝 Notes

- Les workflows sont globalement bien structurés avec une bonne séparation des responsabilités
- Bonne utilisation des workflows réutilisables pour éviter la duplication
- La stratégie de build avec Docker multi-stage est bien implémentée
- Le système de cache est bien pensé (Prettier, ESLint, Docker layers)
- La gestion des déploiements multi-environnements est sophistiquée

---

**Fin du rapport**
