import {
  CAMPAIGN_DEFAULT_NAME,
  CAMPAIGN_LIST,
  campaignIsActive,
  CampaignStatus,
  getDepartmentCodeFromPostalCode,
  getPosition,
  type ApiPlace,
  type SoliguideCountries
} from '@soliguide/common';

import { differenceInHours } from 'date-fns';

export const displayCampaignInfo = (place: ApiPlace, isExternal: boolean): boolean => {
  const campaignInfo = CAMPAIGN_LIST[CAMPAIGN_DEFAULT_NAME];
  const campaign = place.campaigns[CAMPAIGN_DEFAULT_NAME];
  const hasCampaignDisplayStarted =
    differenceInHours(new Date(), campaignInfo.dateDebutAffichage) > 0;

  if (isExternal) {
    const position = getPosition(place);

    if (!position?.postalCode || !position?.country) {
      return false;
    }
    const { postalCode } = position;
    const { country } = position;

    return (
      campaignIsActive([
        getDepartmentCodeFromPostalCode(country as SoliguideCountries, postalCode)
      ]) && hasCampaignDisplayStarted
    );
  }

  return (
    campaignIsActive() &&
    hasCampaignDisplayStarted &&
    campaign.toUpdate &&
    campaign.status !== CampaignStatus.FINISHED
  );
};
