import type { Writable } from 'svelte/store';
import type { SupportedLanguagesCode } from '@soliguide/common';
import type { ComponentType, SvelteComponent } from 'svelte';
import type { PosthogCaptureFunction } from '$lib/services/types';

// flag should be of type `import('svelte').SvelteComponent`
// but it uses the deprecated type `SvelteComponentType`
export interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  flag: ComponentType<SvelteComponent>;
}

export interface PageState {
  availableLanguages: LanguageOption[];
  selectedLanguage: SupportedLanguagesCode | null;
  canSubmit: boolean;
}

export interface LanguagePageController {
  subscribe: Writable<PageState>['subscribe'];
  init(supportedLanguages: SupportedLanguagesCode[], defaultLanguage: SupportedLanguagesCode): void;
  changeSelection(lang: SupportedLanguagesCode): void;
  captureEvent: PosthogCaptureFunction;
}
