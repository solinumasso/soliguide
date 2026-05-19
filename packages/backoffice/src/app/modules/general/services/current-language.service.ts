import { Injectable } from "@angular/core";
import { BehaviorSubject, Subscription } from "rxjs";

import { SupportedLanguagesCode, isSupportedLanguage } from "@soliguide/common";

import { LanguageDirection } from "../../translations/enums";
import { THEME_CONFIGURATION } from "../../../models";

@Injectable({
  providedIn: "root",
})
export class CurrentLanguageService {
  private readonly currentLang: BehaviorSubject<SupportedLanguagesCode> =
    new BehaviorSubject(THEME_CONFIGURATION.defaultLanguage);

  public get currentLanguage(): SupportedLanguagesCode {
    return this.currentLang.value;
  }

  public get routePrefix(): string {
    return `/${this.currentLang.value}`;
  }

  public get direction(): LanguageDirection {
    const RTL_LANGUAGES: SupportedLanguagesCode[] = [
      SupportedLanguagesCode.FA,
      SupportedLanguagesCode.AR,
      SupportedLanguagesCode.PS,
    ];
    return RTL_LANGUAGES.includes(this.currentLang.value)
      ? LanguageDirection.RTL
      : LanguageDirection.LTR;
  }

  public setCurrentLanguage(language: SupportedLanguagesCode | string) {
    const rightSizeLanguage = language.substring(0, 2);
    if (!isSupportedLanguage(rightSizeLanguage))
      throw new Error("BAD_LANGUAGE");
    const newCurrentLanguage = rightSizeLanguage as SupportedLanguagesCode;
    if (this.currentLang.value !== newCurrentLanguage) {
      this.currentLang.next(newCurrentLanguage);
    }
  }

  public subscribe(
    next: (_lang: SupportedLanguagesCode) => void
  ): Subscription {
    return this.currentLang.subscribe(next);
  }
}
