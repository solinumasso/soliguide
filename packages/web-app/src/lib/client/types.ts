import type { Readable, Writable } from 'svelte/store';
import type { i18n } from 'i18next';

export type I18nStore = Writable<i18n>;
export type Routes =
  | 'ROUTE_LANGUAGES'
  | 'ROUTE_HOME'
  | 'ROUTE_ONBOARDING'
  | 'ROUTE_SEARCH'
  | 'ROUTE_PLACES'
  | 'ROUTE_MORE_OPTIONS'
  | 'ROUTE_TALK'
  | 'ROUTE_FAVORITES';

export type Routing = Record<Routes, string>;
export type RoutingStore = Readable<Record<Routes, string>>;
export type CookieConsentStore = Writable<boolean>;
export type Fetcher<T> = (url: string, options?: RequestInit) => Promise<T>;
export type Fetch<T> = (input: RequestInfo | URL, init?: RequestInit) => Promise<T>;
