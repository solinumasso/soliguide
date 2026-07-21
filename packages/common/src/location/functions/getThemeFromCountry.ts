import { Themes } from "../../themes";
import { CountryCodes } from "../enums";

/**
 * Maps a Soliguide country to its frontend theme.
 *
 * Inverse of `getCountryFromTheme`. A lookup table is required because the
 * theme names are not derivable from the country code by concatenation
 * (`soliguide_fr` but `soliguia_es` / `soliguia_ad`).
 *
 * Accepts any `CountryCodes` (e.g. French overseas codes) and defaults to the
 * French theme when the country is missing or has no dedicated theme.
 */
const THEME_BY_COUNTRY: Partial<Record<CountryCodes, Themes>> = {
  [CountryCodes.FR]: Themes.SOLIGUIDE_FR,
  [CountryCodes.ES]: Themes.SOLIGUIA_ES,
  [CountryCodes.AD]: Themes.SOLIGUIA_AD,
};

export const getThemeFromCountry = (country?: CountryCodes): Themes =>
  (country && THEME_BY_COUNTRY[country]) || Themes.SOLIGUIDE_FR;
