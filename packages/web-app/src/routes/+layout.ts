import { redirect } from '@sveltejs/kit';
import { isLangValid, isLanguageSelected, getCurrentLangInStorage, getRoutes } from '$lib/client';
import { browser } from '$app/environment';

export const load = ({ route, params, data }) => {
  const { theme } = data;

  // Because we need localStorage
  if (browser) {
    // Check in localStorage
    const currentLang = getCurrentLangInStorage();
    const routes = getRoutes(currentLang);

    const storedLangIsInvalid = !isLangValid(currentLang, theme.supportedLanguages);
    const langIsInvalid = params.lang && !isLangValid(params.lang, theme.supportedLanguages);
    const needToRedirectToHomeLang = route.id === '/' && isLanguageSelected();

    if (langIsInvalid || needToRedirectToHomeLang) {
      redirect(302, routes.ROUTE_HOME);
    }

    if (route.id !== routes.ROUTE_LANGUAGES && (!isLanguageSelected() || storedLangIsInvalid)) {
      redirect(302, routes.ROUTE_LANGUAGES);
    }
  }

  // Forwarded explicitly so components read the theme from `data.theme`
  return { theme };
};
