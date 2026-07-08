/**
 * Statut de vie d'une campagne (nouveau modèle).
 *
 * À ne pas confondre avec le legacy `CampaignStatus` (TO_DO / STARTED /
 * FINISHED) qui décrit le statut d'une fiche par rapport à une campagne
 * hardcodée, ni avec `CampaignPlaceParticipationStatus` qui décrit le statut
 * d'une participation.
 */
export enum CampaignLifecycleStatus {
  DRAFT = "DRAFT",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
}
