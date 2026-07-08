/**
 * @deprecated Use `CampaignLifecycleStatus` (statut d'une campagne)
 * ou `CampaignPlaceParticipationStatus` (statut d'une participation).
 * Ancien statut hardcodé sur `place.campaigns[NAME]` des crisis campaigns.
 */
export enum CampaignStatus {
  TO_DO = "TO_DO",
  STARTED = "STARTED",
  FINISHED = "FINISHED",
}

export enum CampaignStatusForSearch {
  TO_DO = "TO_DO",
  NO_CHANGE = "NO_CHANGE",
  STARTED = "STARTED",
  FINISHED = "FINISHED",
  REMIND = "REMIND",
  CHANGED = "CHANGED",
}
