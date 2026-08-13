import { Themes } from "../themes.enum";

/**
 * Public hostname of the website serving a theme's institutional and legal
 * pages. Bare hostnames: consumers add the scheme they need.
 *
 * Note that the Spanish theme is served on `soliguia.cat`, not `soliguia.es`.
 */
export const WEBSITE_URL_BY_THEME: Record<Themes, string> = {
  [Themes.SOLIGUIDE_FR]: "soliguide.fr",
  [Themes.SOLIGUIA_ES]: "soliguia.cat",
  [Themes.SOLIGUIA_AD]: "soliguia.ad",
};
