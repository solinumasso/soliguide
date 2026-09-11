import { posthogService } from '$lib/services/posthogService';
import { type PosthogCaptureFunction } from '$lib/services/types';
import { writable } from 'svelte/store';
import type { PageController, PageState } from './types';

const initialState: PageState = {
  cookieModalOpen: false
};

/**
 * The links displayed on this page come straight from the resolved theme and
 * from the legal links store, so the controller only owns the modal state.
 */
export const getPageController = (): PageController => {
  const pageStore = writable(initialState);

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
    openCookieModal,
    closeCookieModal,
    captureEvent
  };
};
