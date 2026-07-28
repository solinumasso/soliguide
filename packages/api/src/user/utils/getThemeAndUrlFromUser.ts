import {
  type CommonUser,
  getThemeFromCountry,
  type SoliguideCountries,
  Themes,
} from "@soliguide/common";

import { FRONT_URLS_MAPPINGS } from "../../_models/config/constants/domains/THEMES_MAPPING.const";

/**
 * @summary Derives the frontend theme and URL from a user's operational areas.
 *
 * Mirror of `getThemeAndUrlFromPlace`, used when emitting synchro events
 * outside of an HTTP request (e.g. the one-shot Brevo backfill script), where
 * the theme cannot be read from the request context.
 *
 * A user may operate in several countries; the first area country determines
 * the theme. Falls back to the French theme when no area is set.
 */
export function getThemeAndUrlFromUser(user: Pick<CommonUser, "areas">): {
  theme: Themes;
  frontendUrl: string;
} {
  const [firstAreaCountry] = Object.keys(
    user.areas ?? {}
  ) as SoliguideCountries[];
  const theme = getThemeFromCountry(firstAreaCountry);
  const frontendUrl = `${FRONT_URLS_MAPPINGS[theme]}/`;

  return { theme, frontendUrl };
}
