import { LegalPage } from "../enums";
import { Themes } from "../themes.enum";

/**
 * URL slug of every legal page, per theme. The slugs are localized in the
 * theme's own language, which is why they cannot be derived from the page key.
 */
export const LEGAL_PAGE_SLUGS_BY_THEME: Record<
  LegalPage,
  Record<Themes, string>
> = {
  [LegalPage.LEGAL_NOTICES]: {
    [Themes.SOLIGUIDE_FR]: "mentions-legales",
    [Themes.SOLIGUIA_ES]: "informacion-legal",
    [Themes.SOLIGUIA_AD]: "avis-legal",
  },
  [LegalPage.PRIVACY_POLICY]: {
    [Themes.SOLIGUIDE_FR]: "politique-confidentialite",
    [Themes.SOLIGUIA_ES]: "politica-privacidad",
    [Themes.SOLIGUIA_AD]: "politica-privacitat",
  },
  [LegalPage.DATA_PROCESSING_AGREEMENT]: {
    [Themes.SOLIGUIDE_FR]: "accord-protection-donnees",
    [Themes.SOLIGUIA_ES]: "acuerdo-proteccion-datos",
    [Themes.SOLIGUIA_AD]: "acord-proteccio-dades",
  },
  [LegalPage.COOKIE_POLICY]: {
    [Themes.SOLIGUIDE_FR]: "politique-cookies",
    [Themes.SOLIGUIA_ES]: "politica-cookies",
    [Themes.SOLIGUIA_AD]: "politica-cookies",
  },
  [LegalPage.GCU]: {
    [Themes.SOLIGUIDE_FR]: "cgu",
    [Themes.SOLIGUIA_ES]: "cgu",
    [Themes.SOLIGUIA_AD]: "cgu",
  },
};
