import {
  CAMPAIGN_DEFAULT_NAME,
  CAMPAIGN_LIST,
  CampaignStatus,
} from "@soliguide/common";

import { differenceInHours } from "date-fns";

import { Place } from "../../../models";
import { campaignIsActiveWithTheme } from "./campaignIsActive";

export const displayCampaignInfo = (place: Place): boolean => {
  const campaignInfo = CAMPAIGN_LIST[CAMPAIGN_DEFAULT_NAME];

  return (
    campaignIsActiveWithTheme() &&
    differenceInHours(new Date(), campaignInfo.dateDebutAffichage) > 0 &&
    place.campaigns.runningCampaign.toUpdate &&
    place.campaigns.runningCampaign.status !== CampaignStatus.FINISHED
  );
};
