# Analytics scripts

Scripts ponctuels pour la synchronisation de données analytiques et CRM.

---

## brevo-campaign-user-update.ts

Upsert des contacts Brevo pour une campagne de mise à jour.

**Logique** : pour chaque utilisateur lié (OWNER, EDITOR ou READER, statut VERIFIED) à au moins une structure ayant complété la campagne configurée (`status = FINISHED`), met l'attribut `CHANGE_CAMPAIGN_MID_YEAR` à `true` (booléen) dans Brevo.

Les contacts sont envoyés par batch de 100 via l'endpoint `POST /contacts/batch` de l'API Brevo.

**Configurer la campagne**

Modifier la constante `CAMPAIGN` en haut du fichier :

```ts
const CAMPAIGN = CampaignName.MID_YEAR_2025;
```

**Variables d'environnement requises**

| Variable        | Description              |
| --------------- | ------------------------ |
| `MONGODB_URI`   | URI de connexion MongoDB |
| `BREVO_API_KEY` | Clé API Brevo            |

**Lancer le script**

```bash
BREVO_API_KEY="xxx" MONGODB_URI="yyy" yarn workspace @soliguide/api brevo:campaign-user-update
```

**Exemple de sortie**

```
[1/4] Recherche des structures ayant complété MID_YEAR_2025...
      → 3241 structure(s) trouvée(s)
[2/4] Recherche des utilisateurs liés à ces structures...
      → 16685 utilisateur(s) concerné(s)
[3/4] Récupération des emails...
      → 16685 email(s) récupéré(s)
[4/4] Upsert dans Brevo par batch de 100...
      → 16685/16685 contacts envoyés

Terminé. 16685 contacts mis à jour dans Brevo.
Attribut : CHANGE_CAMPAIGN_MID_YEAR = true (booléen)
```
