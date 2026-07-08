/**
 * Sections modifiables via le parcours campagne, dans l'ordre d'affichage
 * par défaut du stepper front. Sert de :
 * - source des chemins URL (`PATCH /campaigns/:slug/places/:lieu_id/sections/:sectionPath`)
 * - source du type union `CampaignSectionPath`
 * - clef du mapping `SECTION_PATH_TO_PLACE_CHANGES_SECTION`
 *
 * Les noms sont kebab-case, URL-friendly, alignés avec les libellés
 * produit (indépendants de `PlaceChangesSection` qui garde des noms
 * historiques comme `emplacement` ou `public`).
 */
export const CAMPAIGN_SECTION_PATHS = [
  "contacts",
  "general-info",
  "location",
  "hours",
  "modalities",
  "publics",
  "photos",
  "services",
  "sources",
  "visibility",
] as const;

export type CampaignSectionPath = (typeof CAMPAIGN_SECTION_PATHS)[number];
