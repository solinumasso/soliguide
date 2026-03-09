import { OrgaCampaignStatus, PlaceCampaignStatus } from "../types";

export const ORGA_CAMPAIGN_STATUS: { [key in OrgaCampaignStatus]: string } = {
  TO_DO: "Non commencé",
  STARTED: "En cours",
  FINISHED: "Terminé",
};

export const PLACE_CAMPAIGN_STATUS: { [key in PlaceCampaignStatus]: string } = {
  TO_DO: "Non commencé",
  STARTED: "En cours",
  FINISHED: "Terminé",
  REMIND: "Rappel",
};
