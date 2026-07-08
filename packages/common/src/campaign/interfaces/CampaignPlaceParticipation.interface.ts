import { CampaignPlaceParticipationStatus } from "../enums/CampaignPlaceParticipationStatus.enum";
import { CampaignSectionPath } from "../constants/CAMPAIGN_SECTION_PATHS.const";

/**
 * État d'avancement d'une section dans une participation.
 * Le `changes: boolean` est dérivé à la demande depuis la collection
 * `placeChanges` via `SECTION_PATH_TO_PLACE_CHANGES_SECTION` — il n'est
 * pas persisté ici pour éviter la duplication.
 */
export interface CampaignParticipationSectionState {
  completedAt: Date | null;
}

/**
 * Participation d'une fiche à une campagne. Une entrée par couple
 * (campagne, fiche) dans la collection `campaign_place_participations`.
 *
 * Matérialisée par le job de matérialisation à l'activation de la campagne
 * (upsert idempotent, statut initial `TO_DO`). Les fiches ajoutées ensuite
 * sont rattrapées par un cron périodique.
 */
export interface CampaignPlaceParticipation {
  /** Slug de la campagne (référence logique — pas d'ObjectId ref pour lisibilité). */
  campaignSlug: string;

  /** `lieu_id` de la fiche (identifiant numérique historique). */
  lieu_id: number;

  status: CampaignPlaceParticipationStatus;

  /**
   * État par section, indexé par `CampaignSectionPath`. Les sections
   * absentes du mapping sont hors périmètre pour cette participation
   * (typiquement = pas dans `campaign.sectionsToUpdate`).
   */
  sections: Partial<
    Record<CampaignSectionPath, CampaignParticipationSectionState>
  >;

  /** Date du 1er `PATCH` de section (passage `TO_DO → STARTED`). */
  startedAt: Date | null;

  /** Date du dernier `PATCH` qui a fait basculer la participation à `COMPLETED`. */
  completedAt: Date | null;

  createdAt: Date;
  updatedAt: Date;
}
