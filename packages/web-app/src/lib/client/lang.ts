// Helpers related to languages
import type { SupportedLanguagesCode } from '@soliguide/common';

import { getStorageItem, setStorageItem } from './storage';

const STORAGE_KEY_LANGUAGE_CHOOSEN = 'lngSet';
const STORAGE_KEY_CURRENT_LANGUAGE = 'i18nextLng';

/**
 * lang is among the languages the current theme offers.
 *
 * The supported languages differ per country, so they are passed in from the
 * resolved theme rather than read from a global list.
 */
export const isLangValid = (
  lang: string | SupportedLanguagesCode,
  supportedLanguages: SupportedLanguagesCode[]
): boolean => {
  return supportedLanguages.includes(lang as SupportedLanguagesCode);
};

// Lang has been choosen
export const isLanguageSelected = (): boolean => {
  return Boolean(getStorageItem(STORAGE_KEY_LANGUAGE_CHOOSEN));
};

export const markLanguageAsSelected = (): void => {
  setStorageItem(STORAGE_KEY_LANGUAGE_CHOOSEN, '1');
};

export const getCurrentLangInStorage = (): string => {
  return String(getStorageItem(STORAGE_KEY_CURRENT_LANGUAGE));
};
