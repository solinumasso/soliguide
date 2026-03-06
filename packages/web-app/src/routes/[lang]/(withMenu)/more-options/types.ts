import type { PosthogCaptureFunction } from '$lib/services/types';
import type { Writable } from 'svelte/store';

export interface PageLinks {
  fichesPratiquesLink: string;
  solinumSiteLink: string;
  becomeTranslatorLink: string;
  cookiePolicyLink: string;
  privacyPolicyLink: string;
  dataProtectionAgreementLink: string;
  legalNoticeLink: string;
  termsAndConditionsLink: string;
}

export interface PageState extends PageLinks {
  cookieModalOpen: boolean;
}

export interface PageController {
  subscribe: Writable<PageState>['subscribe'];
  init(links: PageLinks): void;
  openCookieModal(): void;
  closeCookieModal(): void;
  captureEvent: PosthogCaptureFunction;
}
