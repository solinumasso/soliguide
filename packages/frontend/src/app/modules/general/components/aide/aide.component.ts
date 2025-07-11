/*
 * Soliguide: Useful information for those who need it
 *
 * SPDX-FileCopyrightText: © 2024 Solinum
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
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
