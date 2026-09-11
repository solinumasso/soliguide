import i18next, {
  type BackendModule,
  type i18n,
  type InitOptions,
  type ReadCallback
} from 'i18next';
import { createI18nStore } from 'svelte-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { SUPPORTED_LANGUAGES, SupportedLanguagesCode } from '@soliguide/common';
import { changeDesignSystemLocale } from '@soliguide/design-system';

import type { I18nStore } from './types';

type Catalog = Record<string, string>;

/**
 * Catalogs are loaded one language at a time.
 *
 * Importing them statically put every locale in the bundle, around 2 MB for a
 * visitor who reads a single language, and no country needs them all: France
 * offers eleven languages, Spain and Andorra seven.
 */
const catalogModules = import.meta.glob<{ default: Catalog }>('$locales/*.json', {
  eager: false
});

type CatalogLoader = () => Promise<{ default: Catalog }>;

const catalogLoaders: Map<string, CatalogLoader> = Object.entries(catalogModules).reduce(
  (loaders, [path, loader]) => {
    const match = /\/(?<language>[^/]+)\.json$/u.exec(path);

    if (match?.groups) {
      loaders.set(match.groups.language, loader);
    }

    return loaders;
  },
  new Map<string, CatalogLoader>()
);

/**
 * Minimal i18next backend reading from the lazy catalog map, so that i18next
 * owns the loading, the caching and the promise a language change returns.
 */
const lazyCatalogBackend: BackendModule = {
  type: 'backend',
  // Nothing to set up: the catalogs are resolved by the bundler
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  init: () => {},
  read: (language: string, _namespace: string, callback: ReadCallback) => {
    const loader = catalogLoaders.get(language);

    if (!loader) {
      callback(new Error(`No translation catalog for language ${language}`), false);
      return;
    }

    loader()
      .then((catalog) => callback(null, catalog.default))
      .catch((error) => callback(error, false));
  }
};

// eslint-disable-next-line fp/no-let
export let i18nInstance: i18n;

/** Resolves once the initial language catalog has been loaded. */
// eslint-disable-next-line fp/no-let
export let i18nReady: Promise<unknown> = Promise.resolve();

/**
 * Initialize i18n and put it in a store
 */
export const getI18nStore = (
  defaultLanguage = SupportedLanguagesCode.EN,
  supportedLanguages = SUPPORTED_LANGUAGES
): I18nStore => {
  const options: InitOptions = {
    fallbackLng: defaultLanguage,
    supportedLngs: supportedLanguages,
    // Only the requested language, never its regional variants
    load: 'currentOnly',
    interpolation: {
      escapeValue: false // not needed for svelte as it escapes by default
    },
    detection: {
      order: ['path', 'localStorage'],
      caches: ['localStorage']
    }
  };

  // eslint-disable-next-line fp/no-mutation
  i18nInstance = i18next.use(lazyCatalogBackend).use(LanguageDetector);

  // eslint-disable-next-line fp/no-mutation
  i18nReady = i18nInstance.init(options);

  i18nInstance.on('languageChanged', (lng) => {
    changeDesignSystemLocale(lng);
  });

  return createI18nStore(i18next);
};

/**
 * Guarantees a language is available on the shared instance before translating.
 *
 * Server routes build place details outside of any layout render, and translate
 * publics with an explicit language. Without this, a process that never served
 * that language would return raw translation keys.
 */
export const ensureLanguageLoaded = async (language: string): Promise<i18n> => {
  if (!i18nInstance) {
    getI18nStore(language as SupportedLanguagesCode);
  }

  await i18nReady;
  await i18nInstance.loadLanguages(language);

  return i18nInstance;
};

export const I18N_CTX_KEY = Symbol('i18nContext');
