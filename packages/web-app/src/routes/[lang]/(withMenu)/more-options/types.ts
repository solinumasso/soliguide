import type { PosthogCaptureFunction } from '$lib/services/types';
import type { Writable } from 'svelte/store';

export interface PageState {
  cookieModalOpen: boolean;
}

export interface PageController {
  subscribe: Writable<PageState>['subscribe'];
  openCookieModal(): void;
  closeCookieModal(): void;
  captureEvent: PosthogCaptureFunction;
}
