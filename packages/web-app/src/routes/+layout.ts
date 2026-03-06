import { redirect, error } from '@sveltejs/kit';
import { isLangValid, isLanguageSelected, getCurrentLangInStorage, getRoutes } from '$lib/client';
import { browser } from '$app/environment';
import { resolveTheme } from '$lib/theme';

export const load = ({ route, params, url }) => {
  const theme = resolveTheme(url.origin);
  if (!theme) {
    error(500, `No theme found for ${url.origin}`);
  }

  // Because we need localStorage
  if (browser) {
    // Check in localStorage
    const currentLang = getCurrentLangInStorage();
    const routes = getRoutes(currentLang);

    const storedLangIsInvalid = !isLangValid(currentLang);
    const langIsInvalid = params.lang && !isLangValid(params.lang);
    const needToRedirectToHomeLang = route.id === '/' && isLanguageSelected();

    if (langIsInvalid || needToRedirectToHomeLang) {
      redirect(302, routes.ROUTE_HOME);
    }

    if (route.id !== routes.ROUTE_LANGUAGES && (!isLanguageSelected() || storedLangIsInvalid)) {
      redirect(302, routes.ROUTE_LANGUAGES);
    }
  }
};
