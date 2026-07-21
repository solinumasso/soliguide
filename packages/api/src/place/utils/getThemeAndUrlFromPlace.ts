import { type ApiPlace, getPosition, Themes } from "@soliguide/common";

import { COUNTRY_TO_THEME } from "../../_models/config/constants/domains/COUNTRY_TO_THEME.const";
import { FRONT_URLS_MAPPINGS } from "../../_models/config/constants/domains/THEMES_MAPPING.const";

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
