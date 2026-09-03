import { LegalPage } from "@soliguide/common";
import { Component, EventEmitter, OnInit, Output } from "@angular/core";

import type { PosthogProperties } from "@soliguide/common-angular";

import { CurrentLanguageService } from "../../services/current-language.service";
import { PosthogService } from "../../../analytics/services/posthog.service";

import { IS_WEBVIEW_APP } from "../../../../shared";
import { THEME_CONFIGURATION } from "../../../../models";
import { getPathFromTheme } from "../../../../shared/functions/getPathFromTheme";

@Component({
  selector: "app-footer",
  styleUrls: ["./footer.component.css"],
  templateUrl: "./footer.component.html",
})
export class FooterComponent implements OnInit {
  public readonly IS_WEBVIEW_APP = IS_WEBVIEW_APP;
  public readonly becomeTranslatorFormLink? =
    THEME_CONFIGURATION.becomeTranslatorFormLink;
  public readonly donateLink? = THEME_CONFIGURATION.donateLink;
  public readonly THEME_CONFIGURATION = THEME_CONFIGURATION;
  public readonly todayYear = new Date().getFullYear();
  public routePrefix: string;
  public policyPrivacyLink: string;
  public dataProcessingAgreementLink: string;
  public gcuLink: string;
  public legalNoticesLink: string;
  public privacyPolicyLink: string;

  @Output() public readonly openCookieConsentModal =
    new EventEmitter<boolean>();

  constructor(
    private readonly currentLanguageService: CurrentLanguageService,
    private readonly posthogService: PosthogService
  ) {
    this.routePrefix = this.currentLanguageService.routePrefix;
  }

  ngOnInit() {
    this.policyPrivacyLink = getPathFromTheme(LegalPage.COOKIE_POLICY);
    this.dataProcessingAgreementLink = getPathFromTheme(
      LegalPage.DATA_PROCESSING_AGREEMENT
    );
    this.gcuLink = getPathFromTheme(LegalPage.GCU);
    this.legalNoticesLink = getPathFromTheme(LegalPage.LEGAL_NOTICES);
    this.privacyPolicyLink = getPathFromTheme(LegalPage.PRIVACY_POLICY);
  }

  public openCookiesConsentModal(): void {
    this.captureEvent("manage-cookies");
    this.openCookieConsentModal.emit(true);
  }

  public captureEvent(eventName: string, properties?: PosthogProperties): void {
    this.posthogService.capture(`footer-${eventName}`, properties);
  }
}
