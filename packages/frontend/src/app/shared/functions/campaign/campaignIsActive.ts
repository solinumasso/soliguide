import {
  AnyDepartmentCode,
  CAMPAIGN_DEFAULT_NAME,
  CountryCodes,
  CAMPAIGN_LIST,
  campaignIsActive,
  getDepartmentCodeFromPostalCode,
  type SoliguideCountries,
} from "@soliguide/common";

import { THEME_CONFIGURATION } from "../../../models";

const CAMPAIGN_SUPPORTED_COUNTRIES: SoliguideCountries[] = [
  CountryCodes.FR,
  CountryCodes.ES,
  CountryCodes.AD,
];

export const campaignIsActiveWithTheme = (
  territories?: AnyDepartmentCode[]
): boolean => {
  //! Todo - Remove this when working on manage MAJ filters
  return (
    CAMPAIGN_SUPPORTED_COUNTRIES.includes(THEME_CONFIGURATION.country) &&
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
    CAMPAIGN_SUPPORTED_COUNTRIES.includes(THEME_CONFIGURATION.country) &&
    !!postalCode &&
    campaignIsActiveWithTheme([
      getDepartmentCodeFromPostalCode(THEME_CONFIGURATION.country, postalCode),
    ])
  );
};
