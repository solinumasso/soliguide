import type { Routing } from './types';

/**
 * Routes as a pure function
 */
export const getRoutes = (lang: string): Routing => {
  return {
    ROUTE_LANGUAGES: '/languages',
    ROUTE_HOME: `/${lang}`,
    ROUTE_ONBOARDING: `/${lang}/onboarding`,
    ROUTE_SEARCH: `/${lang}/search`,
    ROUTE_PLACES: `/${lang}/places`,
    ROUTE_MORE_OPTIONS: `/${lang}/more-options`,
    ROUTE_TALK: `/${lang}/talk`,
    ROUTE_FAVORITES: `/${lang}/favorites`
  };
};

export const ROUTES_CTX_KEY = Symbol('routesContext');
