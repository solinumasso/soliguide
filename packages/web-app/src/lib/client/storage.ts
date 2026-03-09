// Localstorage stuff
import { browser } from '$app/environment';

/**
 * Read localStorage
 */
export const getStorageItem = (key: string): string | null => {
  if (browser) {
    return window.localStorage.getItem(key);
  }
  return null;
};

/**
 * Write into localStorage
 */
export const setStorageItem = (key: string, value: string): void => {
  if (browser) {
    window.localStorage.setItem(key, value);
  }
};

/**
 * Read localStorage
 */
export const removeStorageItem = (key: string): void => {
  if (browser) {
    window.localStorage.removeItem(key);
  }
};

/**
 * Delete localStorage entries that have the key matching the regex
 */
export const removeStorageItemsByPattern = (regex: RegExp): void => {
  if (browser) {
    const keys = Object.keys(window.localStorage);
    const filteredKeys = keys.filter((key) => regex.test(key));
    filteredKeys.forEach((key) => removeStorageItem(key));
  }
};
