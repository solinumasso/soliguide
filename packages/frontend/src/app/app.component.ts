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
import {
  Component,
  OnInit,
  OnDestroy,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import { NavigationEnd, Router, RouterEvent } from "@angular/router";

import { Subscription, filter } from "rxjs";
import { NgbModalRef, NgbModal } from "@ng-bootstrap/ng-bootstrap";

import { CurrentLanguageService } from "./modules/general/services/current-language.service";
import { LanguageSetupService } from "./modules/general/services/language-setup.service";
import { User } from "./modules/users/classes";
import { AuthService } from "./modules/users/services/auth.service";
import { PosthogService } from "./modules/analytics/services/posthog.service";

import {
  DEFAULT_MODAL_OPTIONS,
  IS_BOT,
  IS_WEBVIEW_APP,
} from "./shared/constants";
import { ChatService, CookieManagerService } from "./modules/shared/services";
import { THEME_CONFIGURATION } from "./models";

@Component({
  selector: "app-root",
  styleUrls: ["./app.component.css"],
  templateUrl: "./app.component.html",
})
export class AppComponent implements OnInit, OnDestroy {
  private readonly subscription: Subscription = new Subscription();
  public readonly isChatEnabled = !!THEME_CONFIGURATION.chatWebsiteId;

  public readonly IS_WEBVIEW_APP = IS_WEBVIEW_APP;
  public readonly IS_BOT = IS_BOT;
  public me!: User | null;
  public currentUrl = "";
  public todayYear: number;
  public routePrefix: string;
  private isCookieModalOpen = false;

  public hasUserGivenConsent: boolean;

  @ViewChild("cookiesConsentModal", { static: true })
  public cookiesConsentModal!: TemplateRef<NgbModalRef>;

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly languageSetupService: LanguageSetupService,
    private readonly currentLanguageService: CurrentLanguageService,
    private readonly posthogService: PosthogService,
    private readonly chatService: ChatService,
    private readonly modalService: NgbModal,
    private readonly cookieManagerService: CookieManagerService
  ) {
    this.hasUserGivenConsent = false;

    // REFRESH TOKEN
    this.authService.isAuth().subscribe();

    const today = new Date();
    this.todayYear = today.getFullYear();
    this.routePrefix = this.currentLanguageService.routePrefix;
  }

  public ngOnInit(): void {
    this.currentUrl = this.router.url;
    this.languageSetupService.setupTranslations();

    this.subscription.add(
      this.authService.currentUserSubject.subscribe((user: User) => {
        this.me = user;
      })
    );

    this.subscription.add(
      this.currentLanguageService.subscribe(
        () => (this.routePrefix = this.currentLanguageService.routePrefix)
      )
    );

    this.subscription.add(
      this.router.events
        .pipe(filter((e: RouterEvent) => e instanceof NavigationEnd))
        .subscribe((event: NavigationEnd) => {
          const splitUrl = event?.url.split("#");
          this.currentUrl = splitUrl[0];

          if (typeof splitUrl[1] !== "undefined") {
            const fragment = splitUrl[1];
            const element = document.getElementById(fragment);
            if (element) {
              element.tabIndex = -1;
              element.focus();
            }
          } else {
            this.currentUrl = event.url;
            const mainHeader = document.getElementById("top-site");
            if (mainHeader) {
              mainHeader.tabIndex = -1;
              mainHeader.focus();
            }
          }

          window.scroll({
            behavior: "smooth",
            left: 0,
            top: 0,
          });
        })
    );

    this.subscription.add(
      this.cookieManagerService.consentSubject.subscribe((consent: boolean) => {
        this.hasUserGivenConsent = consent;
        if (consent) {
          this.chatService.loadScript();
        }
      })
    );
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.languageSetupService.tearDown();
  }

  private openCookieConsentModal(): void {
    if (!this.isCookieModalOpen) {
      this.modalService
        .open(this.cookiesConsentModal, DEFAULT_MODAL_OPTIONS)
        .result.then(
          () => {
            this.isCookieModalOpen = false;
          },
          () => {
            this.isCookieModalOpen = false;
          }
        );
      this.isCookieModalOpen = true;
    }
  }

  public openChatCookiesConsentModal(): void {
    this.posthogService.capture("chat-button");
    this.openCookieConsentModal();
  }

  public openFooterCookiesConsentModal(): void {
    this.openCookieConsentModal();
  }
}
