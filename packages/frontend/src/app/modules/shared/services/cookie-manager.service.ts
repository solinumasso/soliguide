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
import { Injectable } from "@angular/core";
import { BehaviorSubject, Subscription } from "rxjs";
import { TranslateService } from "@ngx-translate/core";

import { globalConstants } from "../../../shared/functions/global-constants.class";
import { THEME_CONFIGURATION } from "../../../models";

@Injectable({
  providedIn: "root",
})
export class CookieManagerService {
  private readonly subscription: Subscription;

  public analyticsConsentSubject: BehaviorSubject<boolean>;
  public chatConsentSubject: BehaviorSubject<boolean>;

  constructor(private readonly translateService: TranslateService) {
    this.analyticsConsentSubject = new BehaviorSubject<boolean>(
      globalConstants.getItem("silktideCookieChoice_analytics") === true
    );
    this.chatConsentSubject = new BehaviorSubject<boolean>(
      globalConstants.getItem("silktideCookieChoice_chat") === true
    );

    this.subscription = new Subscription();

    this.subscription.add(
      this.translateService.onLangChange.subscribe(() => {
        this.translateCookieBanner();
      })
    );
  }

  public openCookiesConsentModal(): void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).silktideCookieBannerManager.toggleModal(true);
  }

  public translateCookieBanner(): void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const config = (window as any).silktideConfig;

    if (config) {
      config.cookieTypes[0].name = this.translateService.instant(
        "COOKIE_TYPES_NECESSARY_NAME"
      );
      config.cookieTypes[0].description = this.translateService.instant(
        "COOKIE_TYPES_NECESSARY_DESCRIPTION"
      );
      config.cookieTypes[1].name = this.translateService.instant(
        "COOKIE_TYPES_ANALYTICS_NAME"
      );
      config.cookieTypes[1].description = this.translateService.instant(
        "COOKIE_TYPES_ANALYTICS_DESCRIPTION"
      );
      config.cookieTypes[2].name = this.translateService.instant(
        "COOKIE_TYPES_CHAT_NAME"
      );
      config.cookieTypes[2].description = this.translateService.instant(
        "COOKIE_TYPES_CHAT_DESCRIPTION"
      );

      config.text.banner.description = this.translateService.instant(
        "COOKIE_BANNER_DESCRIPTION",
        {
          website: THEME_CONFIGURATION.websiteUrl,
          lang: this.translateService.currentLang,
        }
      );
      config.text.banner.acceptAllButtonText = this.translateService.instant(
        "COOKIE_BANNER_ACCEPT_ALL_BUTTON"
      );
      config.text.banner.acceptAllButtonAccessibleLabel =
        this.translateService.instant(
          "COOKIE_BANNER_ACCEPT_ALL_BUTTON_ACCESSIBLE_LABEL"
        );
      config.text.banner.rejectNonEssentialButtonText =
        this.translateService.instant(
          "COOKIE_BANNER_REJECT_NON_ESSENTIAL_BUTTON"
        );
      config.text.banner.rejectNonEssentialButtonAccessibleLabel =
        this.translateService.instant(
          "COOKIE_BANNER_REJECT_NON_ESSENTIAL_BUTTON_ACCESSIBLE_LABEL"
        );
      config.text.banner.preferencesButtonText = this.translateService.instant(
        "COOKIE_BANNER_PREFERENCES_BUTTON"
      );
      config.text.banner.preferencesButtonAccessibleLabel =
        this.translateService.instant(
          "COOKIE_BANNER_PREFERENCES_BUTTON_ACCESSIBLE_LABEL"
        );

      config.text.preferences.title = this.translateService.instant(
        "COOKIE_PREFERENCES_BANNER_TITLE"
      );
      config.text.preferences.description = this.translateService.instant(
        "COOKIE_PREFERENCES_BANNER_DESCRIPTION"
      );

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).silktideCookieBannerManager?.updateCookieBannerConfig(
        config
      );
    }
  }
}
