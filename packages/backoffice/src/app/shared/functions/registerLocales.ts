import { registerLocaleData } from "@angular/common";
import { SUPPORTED_LANGUAGES, SupportedLanguagesCode } from "@soliguide/common";

async function loadAndRegisterLocale(localeId: string) {
  try {
    const localeModule = await import(
      /* webpackInclude: /\b(fr|ar|en|es|ru|ps|fa|uk|ca|ka)\.mjs/ */
      `../../../../node_modules/@angular/common/locales/${localeId}.mjs`
    );
    registerLocaleData(localeModule.default);
  } catch {
    console.warn("Translation file error found for Angular pipes.");
  }
}

export function registerLocales(): void {
  SUPPORTED_LANGUAGES.forEach((value: SupportedLanguagesCode) => {
    loadAndRegisterLocale(value);
  });
}
