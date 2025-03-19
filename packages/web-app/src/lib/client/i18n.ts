/*
 * Soliguide: Useful information for those who need it
 *
 * SPDX-FileCopyrightText: © 2024 Solinum
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
import i18next, { type i18n, type InitOptions } from 'i18next';
import { createI18nStore } from 'svelte-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { SUPPORTED_LANGUAGES, SupportedLanguagesCode } from '@soliguide/common';
import { changeDesignSystemLocale } from '@soliguide/design-system';

import ar from '@soliguide/common/dist/esm/translations/locales/ar.json';
import ca from '@soliguide/common/dist/esm/translations/locales/ca.json';
import en from '@soliguide/common/dist/esm/translations/locales/en.json';
import es from '@soliguide/common/dist/esm/translations/locales/es.json';
import fa from '@soliguide/common/dist/esm/translations/locales/fa.json';
import fr from '@soliguide/common/dist/esm/translations/locales/fr.json';
import ka from '@soliguide/common/dist/esm/translations/locales/ka.json';
import ps from '@soliguide/common/dist/esm/translations/locales/ps.json';
import ro from '@soliguide/common/dist/esm/translations/locales/ro.json';
import ru from '@soliguide/common/dist/esm/translations/locales/ru.json';
import uk from '@soliguide/common/dist/esm/translations/locales/uk.json';

import type { I18nStore } from './types';

const resources = {
  ar: { translation: ar },
  ca: { translation: ca },
  en: { translation: en },
  es: { translation: es },
  fa: { translation: fa },
  fr: { translation: fr },
  ka: { translation: ka },
  ps: { translation: ps },
  ro: { translation: ro },
  ru: { translation: ru },
  uk: { translation: uk }
};

type TranslationResources = Record<string, { translation: Record<string, string> }>;

// We want to use only supported languages
const supportedResources = SUPPORTED_LANGUAGES.reduce(
  (acc: TranslationResources, lang: SupportedLanguagesCode) => {
    if (!resources[lang]) {
      console.warn('Cannot find translations for lang', lang);
      return acc;
    }
    return { ...acc, [lang]: resources[lang] };
  },
  {} as TranslationResources
);

// eslint-disable-next-line fp/no-let
export let i18nInstance: i18n;
/**
 * Initialize i18n and put it in a store
 */
export const getI18nStore = (
  defaultLanguage = SupportedLanguagesCode.EN,
  supportedLanguages = SUPPORTED_LANGUAGES
): I18nStore => {
  const options: InitOptions = {
    resources: supportedResources,
    fallbackLng: defaultLanguage,
    supportedLngs: supportedLanguages,
    interpolation: {
      escapeValue: false // not needed for svelte as it escapes by default
    },
    detection: {
      order: ['path', 'localStorage'],
      caches: ['localStorage']
    }
  };

  // eslint-disable-next-line fp/no-mutation
  i18nInstance = i18next.use(LanguageDetector);

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  i18nInstance.init(options).then(() => {});

  i18nInstance.on('languageChanged', (lng) => {
    changeDesignSystemLocale(lng);
  });

  return createI18nStore(i18next);
};

export const I18N_CTX_KEY = Symbol('i18nContext');
