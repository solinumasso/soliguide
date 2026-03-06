import { SupportedLanguagesCode, Themes } from "@soliguide/common";

const THEME_LANGUAGE_MAPPINGS: Record<Themes, SupportedLanguagesCode> = {
  [Themes.SOLIGUIA_AD]: SupportedLanguagesCode.CA,
  [Themes.SOLIGUIA_ES]: SupportedLanguagesCode.CA,
  [Themes.SOLIGUIDE_FR]: SupportedLanguagesCode.FR,
} as const;

export const handleLanguageByTheme = (
  theme: Themes | null
): SupportedLanguagesCode | undefined => {
  return theme && Object.keys(THEME_LANGUAGE_MAPPINGS).includes(theme)
    ? THEME_LANGUAGE_MAPPINGS[theme]
    : undefined;
};
