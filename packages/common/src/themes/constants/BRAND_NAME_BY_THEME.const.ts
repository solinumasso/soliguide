import { Themes } from "../themes.enum";

/**
 * The brand a theme is published under. Interpolated into translations through
 * the `brandName` variable, so a single catalog serves every country.
 */
export const BRAND_NAME_BY_THEME: Record<Themes, string> = {
  [Themes.SOLIGUIDE_FR]: "Soliguide",
  [Themes.SOLIGUIA_ES]: "Soliguia",
  [Themes.SOLIGUIA_AD]: "Soliguia",
};
