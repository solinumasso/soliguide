import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";

import {
  SupportedLanguagesCode,
  ALL_SUPPORTED_LANGUAGES_NAME,
  SUPPORTED_LANGUAGES_BY_COUNTRY,
  CountryCodes,
} from "@soliguide/common";
import type { PosthogProperties } from "@soliguide/common-angular";

import { LanguageSetupService } from "../../services/language-setup.service";
import { CurrentLanguageService } from "../../services/current-language.service";

import {
  IS_BOT,
  IS_WEBVIEW_APP,
  LANGUAGE_FOR_PRACTICAL_FILES,
} from "../../../../shared";

import { PosthogService } from "../../../analytics/services/posthog.service";
import { THEME_CONFIGURATION } from "../../../../models";

@Component({
  selector: "app-nav",
  templateUrl: "./nav.component.html",
  styleUrls: ["./nav.component.css"],
})
export class NavComponent implements OnInit, OnDestroy {
  private readonly subscription: Subscription = new Subscription();

  public routePrefix: string;
  public isNavbarCollapsed = true;
  public currentLang: SupportedLanguagesCode;

  public readonly IS_WEBVIEW_APP = IS_WEBVIEW_APP;
  public readonly IS_BOT = IS_BOT;
  public readonly backofficeUrl = THEME_CONFIGURATION.backofficeUrl;
  public readonly praticalFilesLink = THEME_CONFIGURATION.praticalFilesLink;
  public readonly ALL_SUPPORTED_LANGUAGES_NAME = ALL_SUPPORTED_LANGUAGES_NAME;
  public readonly SUPPORTED_LANGUAGES =
    SUPPORTED_LANGUAGES_BY_COUNTRY[THEME_CONFIGURATION.country];
  public readonly LANGUAGE_FOR_PRACTICAL_FILES = LANGUAGE_FOR_PRACTICAL_FILES;

  public readonly THEME_CONFIGURATION = THEME_CONFIGURATION;
  public readonly CountryCodes = CountryCodes;
  public readonly SupportedLanguagesCode = SupportedLanguagesCode;

  constructor(
    private readonly posthogService: PosthogService,
    private readonly languageSetupService: LanguageSetupService,
    private readonly currentLanguageService: CurrentLanguageService
  ) {
    this.currentLang = this.currentLanguageService.currentLanguage;
    this.routePrefix = this.currentLanguageService.routePrefix;
  }

  public ngOnInit(): void {
    this.currentLang = this.currentLanguageService.currentLanguage;
    this.subscription.add(
      this.currentLanguageService.subscribe((language) => {
        this.currentLang = language;
        this.routePrefix = this.currentLanguageService.routePrefix;
      })
    );
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public useLanguage(language: SupportedLanguagesCode): void {
    this.captureEvent("click-language", { language });
    this.languageSetupService.setLanguageRoutePrefix(language);
  }

  public captureEvent(eventName: string, properties?: PosthogProperties): void {
    this.posthogService.capture(`topbar-${eventName}`, {
      ...properties,
      isNavbarCollapsed: this.isNavbarCollapsed,
    });
  }

  public clickOnHomeLogo(): void {
    this.captureEvent("click-home-logo", { link: this.routePrefix });
  }

  public clickOnPracticalFiles(): void {
    this.captureEvent("click-practical-files", {
      link: this.praticalFilesLink,
    });
  }
}
