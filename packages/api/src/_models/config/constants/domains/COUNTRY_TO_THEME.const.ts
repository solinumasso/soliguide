import { CountryCodes, Themes } from "@soliguide/common";

/**
 * Maps a Soliguide country to its frontend theme.
 *
 * Used outside of an HTTP request context (cron jobs, one-shot scripts) where
 * the theme cannot be read from `req.requestInformation`, and must instead be
 * derived from the country of a place or a user.
 */
export const COUNTRY_TO_THEME: Record<string, Themes> = {
  [CountryCodes.FR]: Themes.SOLIGUIDE_FR,
  [CountryCodes.ES]: Themes.SOLIGUIA_ES,
  [CountryCodes.AD]: Themes.SOLIGUIA_AD,
};
