import { Component } from "@angular/core";

import { TranslateService } from "@ngx-translate/core";

import { SupportedLanguagesCode } from "@soliguide/common";

import { environment } from "../../../../../environments/environment";
import { IframeGeneratorStep } from "../../types";
import { AnalyticsService } from "../../services/analytics.service";

@Component({
  selector: "app-intro-form",
  templateUrl: "./intro-form.component.html",
  styleUrls: ["./intro-form.component.scss"],
})
export class IntroFormComponent {
  public frontendUrl = `${environment.frontendUrl}/`;
  public currentLang: string;
  public readonly SupportedLanguagesCode = SupportedLanguagesCode;

  constructor(
    private readonly analyticsService: AnalyticsService,
    private readonly translateService: TranslateService
  ) {
    this.currentLang = this.translateService.currentLang;
  }

  public async captureClickSoliguideLink() {
    this.analyticsService.capture(
      "click-link-soliguide",
      IframeGeneratorStep.INTRO
    );
  }

  public async captureClickContactEmail() {
    this.analyticsService.capture(
      "click-contact-email",
      IframeGeneratorStep.INTRO
    );
  }
}
