import { PlaceChangesSection } from "../../place-changes/enums";
import { CampaignSectionPath } from "./CAMPAIGN_SECTION_PATHS.const";

/**
 * Mapping `CampaignSectionPath` → `PlaceChangesSection`.
 *
 * Sert à dériver `sections[path].changes: boolean` sur une participation
 * en interrogeant la collection `placeChanges` avec le bon nom de section.
 *
 * Requis parce que le vocabulaire des sections campagne (URL-friendly,
 * ordre produit) est distinct du vocabulaire historique de `placeChanges`
 * (17 valeurs, incluant `emplacement` / `public` / `generalinfo`).
 */
export const SECTION_PATH_TO_PLACE_CHANGES_SECTION: Record<
  CampaignSectionPath,
  PlaceChangesSection
> = {
  contacts: PlaceChangesSection.contacts,
  "general-info": PlaceChangesSection.generalinfo,
  location: PlaceChangesSection.emplacement,
  hours: PlaceChangesSection.hours,
  modalities: PlaceChangesSection.modalities,
  publics: PlaceChangesSection.public,
  photos: PlaceChangesSection.photos,
  services: PlaceChangesSection.services,
  sources: PlaceChangesSection.sources,
  visibility: PlaceChangesSection.visibility,
};
