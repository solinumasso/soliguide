import { type Campaign } from "@soliguide/common";

import { CampaignTempFormsPlaceSummary } from "./CampaignTempFormsPlaceSummary.interface";
import { CampaignTempFormsUserSummary } from "./CampaignTempFormsUserSummary.interface";

export interface CampaignTempFormsPayload {
  campaign: Pick<
    Campaign,
    | "slug"
    | "name"
    | "description"
    | "country"
    | "startDate"
    | "endDate"
    | "sectionsToUpdate"
  >;
  user: CampaignTempFormsUserSummary;
  places: CampaignTempFormsPlaceSummary[];
}
