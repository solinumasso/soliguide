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
import { writable } from 'svelte/store';
import { ALL_SUPPORTED_LANGUAGES_NAME, SupportedLanguagesCode } from '@soliguide/common';
import { EsCt, Fr, Gb, Es, Ir, Ge, Af, Ro, Ru, Ua, Xx } from 'svelte-circle-flags';
import { posthogService } from '$lib/services/posthogService';
import ArabicLanguage from './ArabicLanguage.svelte';
import type { LanguageOption, LanguagePageController, PageState } from './types';
import type { ComponentType, SvelteComponent } from 'svelte';
import type { PosthogCaptureFunction } from '$lib/services/types';

const flagsMap: Record<SupportedLanguagesCode, ComponentType<SvelteComponent>> = {
  [SupportedLanguagesCode.FR]: Fr,
  [SupportedLanguagesCode.AR]: ArabicLanguage,
  [SupportedLanguagesCode.CA]: EsCt,
  [SupportedLanguagesCode.EN]: Gb,
  [SupportedLanguagesCode.ES]: Es,
  [SupportedLanguagesCode.FA]: Ir,
  [SupportedLanguagesCode.KA]: Ge,
  [SupportedLanguagesCode.PS]: Af,
  [SupportedLanguagesCode.RO]: Ro,
  [SupportedLanguagesCode.RU]: Ru,
  [SupportedLanguagesCode.UK]: Ua
};

const initialState: PageState = {
  availableLanguages: [],
  selectedLanguage: null,
  canSubmit: false
};

/**
 * Build options for the page.
 * We show only languages supported by the theme
 * They follow the order of theme's supporter languages,
 * with theme's default language in first place
 */
const buildAvailableOptions = (
  supportedLanguages: SupportedLanguagesCode[],
  defaultLanguage: SupportedLanguagesCode
): LanguageOption[] => {
  return supportedLanguages
    .map((supportedLanguage): LanguageOption => {
      if (!flagsMap[supportedLanguage]) {
        console.warn('Flag has not been found for lang', supportedLanguage);
      }
      return {
        code: supportedLanguage,
        ...ALL_SUPPORTED_LANGUAGES_NAME[supportedLanguage],
        flag: flagsMap[supportedLanguage] || Xx
      };
    })
    .filter((item) => !!item)
    .reduce((acc: LanguageOption[], lang: LanguageOption) => {
      // Put theme's defaultLanguage in first place
      return lang.code === defaultLanguage ? [lang, ...acc] : [...acc, lang];
    }, []);
};

export const getController = (): LanguagePageController => {
  const myPageStore = writable(initialState);

  const init = (
    supportedLanguages: SupportedLanguagesCode[],
    defaultLanguage: SupportedLanguagesCode
  ) => {
    myPageStore.set({
      ...initialState,
      availableLanguages: buildAvailableOptions(supportedLanguages, defaultLanguage)
    });
  };

  /**
   * Change selected language. If a lang is selected again, it becomes unselected
   */
  const changeSelection = (lang: SupportedLanguagesCode) => {
    myPageStore.update((oldState): PageState => {
      const newLang = oldState.selectedLanguage === lang ? null : lang;
      return {
        ...oldState,
        selectedLanguage: newLang,
        canSubmit: !!newLang
      };
    });
  };

  /**
   * Capture an event with a prefix for route context
   */
  const captureEvent: PosthogCaptureFunction = (eventName, properties) => {
    posthogService.capture(`languages-${eventName}`, properties);
  };

  return {
    subscribe: myPageStore.subscribe,
    init,
    changeSelection,
    captureEvent
  };
};
