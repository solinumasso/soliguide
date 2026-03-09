import { posthogService } from '$lib/services/posthogService';
import { type PosthogCaptureFunction } from '$lib/services/types';
import { writable } from 'svelte/store';
import type { PageController, PageLinks, PageState } from './types';

const initialLinks: PageLinks = {
  fichesPratiquesLink: '#',
  solinumSiteLink: '#',
  becomeTranslatorLink: '#',
  cookiePolicyLink: '#',
  privacyPolicyLink: '#',
  dataProtectionAgreementLink: '#',
  legalNoticeLink: '#',
  termsAndConditionsLink: '#'
};

/**
 * Avoid null values
 */
const initialState: PageState = {
  ...initialLinks,
  cookieModalOpen: false
};

export const getPageController = (): PageController => {
  const pageStore = writable(initialState);

  const init = (links = initialLinks) => {
    pageStore.set({ ...initialState, ...links });
  };

  const openCookieModal = () => {
    pageStore.update((oldValue): PageState => ({ ...oldValue, cookieModalOpen: true }));
  };

  const closeCookieModal = () => {
    pageStore.update((oldValue): PageState => ({ ...oldValue, cookieModalOpen: false }));
  };

  /**
   * Capture an event with a prefix for route context
   */
  const captureEvent: PosthogCaptureFunction = (eventName, properties) => {
    posthogService.capture(`more-options-${eventName}`, properties);
  };

  return {
    subscribe: pageStore.subscribe,
    init,
    openCookieModal,
    closeCookieModal,
    captureEvent
  };
};
