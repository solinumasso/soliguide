import {
  type ApiPlace,
  getPosition,
  getThemeFromCountry,
  Themes,
} from "@soliguide/common";

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
  const theme = getThemeFromCountry(position?.country);
  const frontendUrl = `${FRONT_URLS_MAPPINGS[theme]}/`;

  return { theme, frontendUrl };
}
