// Helpers related to languages
import { SUPPORTED_LANGUAGES, SupportedLanguagesCode } from '@soliguide/common';

import { getStorageItem, setStorageItem } from './storage';

const STORAGE_KEY_LANGUAGE_CHOOSEN = 'lngSet';
const STORAGE_KEY_CURRENT_LANGUAGE = 'i18nextLng';

const WEB_APP_SUPPORTED_LANGUAGES: SupportedLanguagesCode[] = SUPPORTED_LANGUAGES.filter(
  (lang) => lang !== SupportedLanguagesCode.PT
);

/**
 * lang is among supported languages
 */
export const isLangValid = (lang: string | SupportedLanguagesCode): boolean => {
  return WEB_APP_SUPPORTED_LANGUAGES.includes(lang as SupportedLanguagesCode);
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
