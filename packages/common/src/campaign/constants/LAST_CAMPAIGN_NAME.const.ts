import { CampaignName } from "../enums/CampaignName.enum";
import { CAMPAIGN_LIST } from "./CAMPAIGN_LIST.const";

const getLastCompletedCampaignByType = (
  typeName: string
): CampaignName | undefined => {
  const now = new Date();

  return (
    Object.entries(CAMPAIGN_LIST) as [
      CampaignName,
      { dateFin: Date; name: string }
    ][]
  )
    .filter(([, infos]) => infos.name === typeName && infos.dateFin < now)
    .sort(([, a], [, b]) => b.dateFin.getTime() - a.dateFin.getTime())[0]?.[0];
};

export const LAST_MID_YEAR_CAMPAIGN_NAME =
  getLastCompletedCampaignByType("MID_YEAR");
export const LAST_END_YEAR_CAMPAIGN_NAME =
  getLastCompletedCampaignByType("END_OF_YEAR");
