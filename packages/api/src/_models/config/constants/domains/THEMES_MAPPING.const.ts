import { Themes } from "@soliguide/common";
import { CONFIG } from "../CONFIG.const";

export const THEME_MAPPINGS: { [key: string]: Themes } = {
  [CONFIG.SOLIGUIA_AD_URL]: Themes.SOLIGUIA_AD,
  [CONFIG.SOLIGUIA_ES_URL]: Themes.SOLIGUIA_ES,
  [CONFIG.SOLIGUIDE_FR_URL]: Themes.SOLIGUIDE_FR,
  [CONFIG.WEBAPP_AD_URL]: Themes.SOLIGUIA_AD,
  [CONFIG.WEBAPP_ES_URL]: Themes.SOLIGUIA_ES,
  [CONFIG.WEBAPP_FR_URL]: Themes.SOLIGUIDE_FR,
} as const;

export const FRONT_URLS_MAPPINGS: { [key: string]: string } = {
  [Themes.SOLIGUIA_AD]: CONFIG.SOLIGUIA_AD_URL,
  [Themes.SOLIGUIA_ES]: CONFIG.SOLIGUIA_ES_URL,
  [Themes.SOLIGUIDE_FR]: CONFIG.SOLIGUIDE_FR_URL,
};
