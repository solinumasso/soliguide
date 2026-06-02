import { CampaignName } from "../enums/CampaignName.enum";
import { CampaignInfos } from "../types/CampaignInfos.type";
import { CAMPAIGN_LIST } from "./CAMPAIGN_LIST.const";

const getLastCompletedCampaignByType = (
  typeName: string
): CampaignName | undefined => {
  const now = new Date();
  const campaignEntries = Object.entries(CAMPAIGN_LIST) as Array<
    [CampaignName, CampaignInfos]
  >;

  const completedCampaignsOfType = campaignEntries.filter(
    ([, campaign]) => campaign.name === typeName && campaign.dateFin < now
  );

  const [mostRecentEntry] = completedCampaignsOfType.sort(
    ([, a], [, b]) => b.dateFin.getTime() - a.dateFin.getTime()
  );

  return mostRecentEntry?.[0];
};

export const LAST_MID_YEAR_CAMPAIGN_NAME =
  getLastCompletedCampaignByType("MID_YEAR");
export const LAST_END_YEAR_CAMPAIGN_NAME =
  getLastCompletedCampaignByType("END_OF_YEAR");
