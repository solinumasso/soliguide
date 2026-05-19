import { LOCAL_PATH_ROUTES_BY_THEME } from "../../modules/static-pages/static-pages.routes";
import { themeService } from "../services";

export const getPathFromTheme = (pathKey: string): string => {
  return LOCAL_PATH_ROUTES_BY_THEME[pathKey][themeService.getTheme()];
};
