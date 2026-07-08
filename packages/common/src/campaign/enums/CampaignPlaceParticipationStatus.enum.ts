/**
 * Statut d'une participation d'une fiche à une campagne (nouveau modèle).
 *
 * Distinct de `CampaignLifecycleStatus` (statut de la campagne elle-même)
 * et du legacy `CampaignStatus`.
 */
export enum CampaignPlaceParticipationStatus {
  TO_DO = "TO_DO",
  STARTED = "STARTED",
  COMPLETED = "COMPLETED",
}
