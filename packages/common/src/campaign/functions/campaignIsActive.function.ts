import type { AnyDepartmentCode } from "../../location/types/DepartmentCode.type";
import { CAMPAIGN_LIST } from "../constants/CAMPAIGN_LIST.const";
import { CAMPAIGN_DEFAULT_NAME } from "../constants/CAMPAIGN_DEFAULT_NAME.const";

export const campaignIsActive = (
  territories?: AnyDepartmentCode[]
): boolean => {
  const today = new Date();
  const campaign = CAMPAIGN_LIST[CAMPAIGN_DEFAULT_NAME];

  if (campaign.dateDebutCampagne > today || today > campaign.dateFin) {
    return false;
  }

  const isTerritoryInCampaign = territories?.length
    ? territories.some((territory) => campaign.territories.includes(territory))
    : true;

  return isTerritoryInCampaign;
};
