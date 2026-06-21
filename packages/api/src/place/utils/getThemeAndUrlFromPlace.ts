import {
  type ApiPlace,
  CountryCodes,
  getPosition,
  Themes,
} from "@soliguide/common";

import { FRONT_URLS_MAPPINGS } from "../../_models/config/constants/domains/THEMES_MAPPING.const";

const COUNTRY_TO_THEME: Record<string, Themes> = {
  [CountryCodes.FR]: Themes.SOLIGUIDE_FR,
  [CountryCodes.ES]: Themes.SOLIGUIA_ES,
  [CountryCodes.AD]: Themes.SOLIGUIA_AD,
};

/**
 * @summary Derives the frontend theme and URL from a place's country.
 * Used when emitting Airtable synchro events outside of an HTTP request
 * (e.g. cron jobs), where the theme cannot be read from the request context.
 */
export function getThemeAndUrlFromPlace(place: ApiPlace): {
  theme: Themes;
  frontendUrl: string;
} {
  const position = getPosition(place);
  const country = position?.country;
  const theme = (country && COUNTRY_TO_THEME[country]) || Themes.SOLIGUIDE_FR;
  const frontendUrl = `${FRONT_URLS_MAPPINGS[theme]}/`;

  return { theme, frontendUrl };
}
