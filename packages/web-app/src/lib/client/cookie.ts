import {
  getStorageItem,
  setStorageItem,
  removeStorageItem,
  removeStorageItemsByPattern
} from '$lib/client/storage';
import { writable } from 'svelte/store';

const ZD_COOKIE_CONSENT_KEY = 'zdCookieConsent';

export const COOKIE_CTX_KEY = Symbol('cookie consent context key');
export const cookieConsent = writable(false);

export const setZDCookieConsent = (consent: boolean): void => {
  if (consent) {
    const expirationDate = new Date();
    expirationDate.setMonth(expirationDate.getMonth() + 3);
    setStorageItem(ZD_COOKIE_CONSENT_KEY, expirationDate.toString());
  } else {
    removeStorageItem(ZD_COOKIE_CONSENT_KEY);
    removeStorageItemsByPattern(/^ZD/u);
    removeStorageItemsByPattern(/\.appUserId$/u);
    removeStorageItemsByPattern(/\.clientId$/u);
    removeStorageItemsByPattern(/\.conversationStartedAt$/u);
    removeStorageItemsByPattern(/\.sessionToken$/u);
  }
};

export const getZDCookieConsent = (): boolean => {
  const storageValue = getStorageItem(ZD_COOKIE_CONSENT_KEY);
  if (storageValue) {
    const expirationDate = new Date(storageValue);
    return !isNaN(Number(expirationDate)) && new Date() < expirationDate;
  }
  return false;
};
