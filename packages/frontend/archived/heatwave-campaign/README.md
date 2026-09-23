# Campagne canicule — code parqué

Le dispositif de la campagne canicule 2026 a été retiré du frontend une fois la
campagne terminée. Ses **points d'appel** ont été supprimés (routes, items de
menu, déclarations de module, insertions dans les templates), mais les fichiers
eux-mêmes sont conservés ici pour être repris lors de la séparation du frontend
et du back-office.

Ce dossier est **hors de `src/`** : il n'est ni compilé, ni linté, ni inclus
dans le bundle. Il est aussi exclu de Prettier, pour que le code reste
strictement identique à ce qui a été retiré.

## Contenu

L'arborescence reproduit celle d'origine, relative à `src/app/` :

| Chemin ici | Emplacement d'origine | Rôle |
| --- | --- | --- |
| `modules/campaign-temp-forms/` | idem | Parcours public de mise à jour, accès par lien email Brevo borné par `campaignSlug` + `campaignUserUuid` |
| `modules/campaign/components/campaign-climate-orga/` | idem | Même parcours, variante admin scopée organisation |
| `modules/campaign/components/campaign-heatwave-link/` | idem | Boutons d'accès dans les tables admin utilisateurs et organisations |
| `modules/campaign/services/admin-campaigns.service.ts` | idem | Appels API de la campagne |
| `modules/shared/components/thermal-comfort-status/` | idem | Affichage du confort thermique : rubans, cartes et bannière d'incitation |

## À la reprise

Ces fichiers réfèrent des symboles qui ont pu évoluer depuis leur retrait :
n'étant plus compilés, rien ne les en avertit. Prévoir une passe de `tsc` après
remise en place.

Points d'appel à restaurer, tous visibles dans le commit de retrait :

- la route `:lang/campaign-temp-forms` dans `app-routing.module.ts` ;
- la route `climate-summer/:campaignSlug/orga/:orgaObjectId` dans
  `campaign-routing.module.ts`, et la déclaration dans `campaign.module.ts` ;
- `<app-campaign-heatwave-link>` dans `manage-users` et `manage-organisations`,
  avec leurs déclarations de module ;
- l'item de menu dans `nav.component`, qui lisait
  `campaignsCatalog.getActiveCampaign()` ;
- les insertions de `<app-thermal-comfort-status>` dans `search-place-result`,
  `place.component`, `admin-place.component`, `display-modalities-inline` et
  `display-modalities`, avec leurs déclarations de module.

Ce qui **n'a pas** été retiré et reste opérationnel : la saisie du confort
thermique dans le formulaire de modalités, le champ `modalities.thermalComfort`
de `@soliguide/common`, les endpoints de campagne de `packages/api`, la
campagne `canicule-france-2026` en base, et les clés de traduction.
