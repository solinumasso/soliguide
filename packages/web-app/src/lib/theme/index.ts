export { DEFAULT_THEME_NAME, THEME_BLUEPRINTS } from './blueprints';
export { buildThemeDefinition, getHostnamesEnvKey } from './buildThemeDefinition';
export {
  getLegalLinksContext,
  getThemeContext,
  setLegalLinksContext,
  setThemeContext
} from './context';
export { getCanonicalOrigin } from './getCanonicalOrigin';
export { getRequestLanguage } from './getRequestLanguage';
export { matchThemeByHostname, normalizeHostname, parseHostnameList } from './hostnameMatching';
export { buildLegalLinks } from './legalLinks';
export { getDefaultTheme, resolveTheme } from './resolveTheme';
export { getRequestHostname, resolveThemeFromRequest } from './resolveThemeFromRequest';
export { isSeasonalThermalComfortVisible } from './thermalComfort';
export type {
  ThemeBlueprint,
  ThemeCapabilities,
  ThemeDefinition,
  ThemeLegalLinks,
  ThemeLinks,
  ThemeMedia,
  ThemeOrganization
} from './types';
