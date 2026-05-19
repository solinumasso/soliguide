import {
  AnyDepartmentCode,
  CAMPAIGN_DEFAULT_NAME,
  CountryCodes,
  CAMPAIGN_LIST,
  campaignIsActive,
  getDepartmentCodeFromPostalCode,
} from "@soliguide/common";

import { THEME_CONFIGURATION } from "../../../models";

export const campaignIsActiveWithTheme = (
  territories?: AnyDepartmentCode[]
): boolean => {
  //! Todo - Remove this when working on manage MAJ filters
  return (
    THEME_CONFIGURATION.country === CountryCodes.FR &&
    campaignIsActive(territories)
  );
};

export const campaignIsAvailable = (
  territories: AnyDepartmentCode[]
): boolean => {
  let isCampaignAvailable = false;
  for (const territory of territories) {
    if (CAMPAIGN_LIST[CAMPAIGN_DEFAULT_NAME].territories.includes(territory)) {
      isCampaignAvailable = true;
      break;
    }
  }
  return isCampaignAvailable;
};

export const getIsCampaignActive = (postalCode: string): boolean => {
  return (
    THEME_CONFIGURATION.country === CountryCodes.FR &&
    postalCode &&
    campaignIsActiveWithTheme([
      getDepartmentCodeFromPostalCode(CountryCodes.FR, postalCode),
    ])
  );
};
