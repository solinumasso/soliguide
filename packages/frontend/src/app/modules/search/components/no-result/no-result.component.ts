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
import { Component, OnDestroy, OnInit } from "@angular/core";

import { Subscription } from "rxjs";

import type { PosthogProperties } from "@soliguide/common-angular";

import { PosthogService } from "../../../analytics/services/posthog.service";
import { THEME_CONFIGURATION } from "../../../../models";
import { CurrentLanguageService } from "../../../general/services/current-language.service";
import { ChatService } from "../../../shared/services/chat.service";

@Component({
  selector: "app-no-result",
  templateUrl: "./no-result.component.html",
  styleUrls: ["./no-result.component.css"],
})
export class NoResultComponent implements OnInit, OnDestroy {
  private readonly subscription = new Subscription();
  public routePrefix: string;

  public readonly THEME_CONFIGURATION = THEME_CONFIGURATION;

  constructor(
    private readonly currentLanguageService: CurrentLanguageService,
    private readonly posthogService: PosthogService,
    private readonly chatService: ChatService
  ) {
    this.routePrefix = this.currentLanguageService.routePrefix;
  }

  public ngOnInit(): void {
    this.subscription.add(
      this.currentLanguageService.subscribe(
        () => (this.routePrefix = this.currentLanguageService.routePrefix)
      )
    );
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public openChat = (): void => {
    this.chatService.openChat();
  };

  public captureEvent(eventName: string, properties?: PosthogProperties): void {
    this.posthogService.capture(`search-${eventName}`, properties);
  }
}
