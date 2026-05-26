import { OrgaCampaignStatus, PlaceCampaignStatus } from "../types";

export const ORGA_CAMPAIGN_STATUS: { [key in OrgaCampaignStatus]: string } = {
  TO_DO: "NOT_STARTED",
  STARTED: "IN_PROGRESS",
  FINISHED: "COMPLETED",
};

export const PLACE_CAMPAIGN_STATUS: { [key in PlaceCampaignStatus]: string } = {
  TO_DO: "NOT_STARTED",
  STARTED: "IN_PROGRESS",
  FINISHED: "COMPLETED",
  REMIND: "RECALL",
};
