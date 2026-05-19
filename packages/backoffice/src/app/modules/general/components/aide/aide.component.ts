import { Component, OnInit } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { TranslateService } from "@ngx-translate/core";

import type { PosthogProperties } from "@soliguide/common-angular";

import { ChatService } from "../../../shared/services";
import { PosthogService } from "../../../analytics/services/posthog.service";
import { AuthService } from "../../../users/services/auth.service";
import { THEME_CONFIGURATION } from "../../../../models";

@Component({
  selector: "app-aide",
  templateUrl: "./aide.component.html",
  styleUrls: ["./aide.component.css"],
})
export class AideComponent implements OnInit {
  public readonly isChatEnabled = !!THEME_CONFIGURATION.chatWebsiteId;
  public readonly THEME_CONFIGURATION = THEME_CONFIGURATION;

  constructor(
    private readonly chatService: ChatService,
    private readonly posthogService: PosthogService,
    private readonly titleService: Title,
    private readonly authService: AuthService,
    private readonly translateService: TranslateService
  ) {}

  public ngOnInit(): void {
    this.titleService.setTitle(
      this.translateService.instant("HELP_AND_TUTORIALS_FOR_USERS", {
        brandName: THEME_CONFIGURATION.brandName,
      })
    );
  }

  private readonly captureEvent = (
    eventName: string,
    properties?: PosthogProperties
  ): void => {
    this.posthogService.capture(`help-${eventName}`, properties);
  };

  public openCookiesConsentModalOrChat(): void {
    this.captureEvent("click-open-chat");
    this.chatService.openChat(this.authService.currentUserValue);
  }

  public clickEmailToContact = (): void => {
    this.captureEvent("click-email-to-contact");
  };

  public clickRegisterWebinar = (): void => {
    this.captureEvent("click-register-webinar");
  };

  public clickOnTutorial = (tutorialName: string): void => {
    this.captureEvent("click-tutorial", { tutorialName });
  };
}
