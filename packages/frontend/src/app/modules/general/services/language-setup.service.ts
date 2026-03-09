import { Injectable } from "@angular/core";
import { PRIMARY_OUTLET, Router } from "@angular/router";

import { TranslateService } from "@ngx-translate/core";

import {
  SUPPORTED_LANGUAGES,
  SupportedLanguagesCode,
  isSupportedLanguage,
} from "@soliguide/common";

import { Subscription } from "rxjs";

import { CurrentLanguageService } from "./current-language.service";

@Injectable({
  providedIn: "root",
})
export class LanguageSetupService {
  private readonly subscription: Subscription = new Subscription();

  constructor(
    private readonly translateService: TranslateService,
    private readonly router: Router,
    private readonly currentLanguageService: CurrentLanguageService
  ) {}

  public setupTranslations() {
    // Setup the translation service supported languages
    this.translateService.addLangs(SUPPORTED_LANGUAGES);

    // Update the translation service when our current language change
    this.subscription.add(
      this.currentLanguageService.subscribe((lang) => {
        this.translateService.use(lang);
      })
    );
  }

  public tearDown() {
    this.subscription.unsubscribe();
  }

  public setLanguageRoutePrefix(language: SupportedLanguagesCode | string) {
    if (!isSupportedLanguage(language)) throw new Error("BAD_LANGUAGE");
    const urlTree = this.router.parseUrl(this.router.url);
    // Replace the language prefix
    // see https://angular.io/api/router/UrlTree#usage-notes for usage
    urlTree.root.children[PRIMARY_OUTLET].segments[0].path = language;
    this.router.navigateByUrl(urlTree);
  }
}
