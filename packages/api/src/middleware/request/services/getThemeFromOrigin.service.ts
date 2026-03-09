import { Themes } from "@soliguide/common";
import { THEME_MAPPINGS } from "../../../_models";
import { cleanUrl } from "./cleanUrl.service";

export const getThemeFromOrigin = (origin: string | null): Themes | null => {
  if (!origin) {
    return null;
  }

  try {
    const cleanedOrigin = cleanUrl(origin);
    if (!cleanedOrigin) {
      return null;
    }

    const hostname = new URL(cleanedOrigin).hostname;
    for (const [url, theme] of Object.entries(THEME_MAPPINGS)) {
      if (new URL(url).hostname === hostname) {
        return theme;
      }
    }

    return null;
  } catch {
    return null;
  }
};
