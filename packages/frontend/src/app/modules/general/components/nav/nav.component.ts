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
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { Subscription } from "rxjs";

import {
  SupportedLanguagesCode,
  UserRole,
  UserStatus,
  ALL_SUPPORTED_LANGUAGES_NAME,
  SUPPORTED_LANGUAGES_BY_COUNTRY,
  CountryCodes,
} from "@soliguide/common";
import type { PosthogProperties } from "@soliguide/common-angular";

import { LanguageSetupService } from "../../services/language-setup.service";
import { CurrentLanguageService } from "../../services/current-language.service";

import type { User } from "../../../users/classes/user.class";
import { AuthService } from "../../../users/services/auth.service";

import {
  campaignIsActive,
  campaignIsAvailable,
  fadeInOut,
  IS_BOT,
  IS_WEBVIEW_APP,
  LANGUAGE_FOR_PRACTICAL_FILES,
} from "../../../../shared";

import { PosthogService } from "../../../analytics/services/posthog.service";
import { THEME_CONFIGURATION } from "../../../../models";

@Component({
  animations: [fadeInOut],
  selector: "app-nav",
  templateUrl: "./nav.component.html",
  styleUrls: ["./nav.component.css"],
})
export class NavComponent implements OnInit, OnDestroy {
  private readonly subscription: Subscription = new Subscription();

  public routePrefix: string;
  public isNavbarCollapsed = true;
  public campaignIsActive = campaignIsActive();
  public isAdmin = false;
  public isCampaignAvailable = false;
  public me: User | null = null;
  public currentLang: SupportedLanguagesCode;
  public showTranslationMenuDropdown = false;
  public showSoligareMenu = false;

  public readonly displaySolidataSearchTracking = Boolean(
    THEME_CONFIGURATION.solidata?.searchTracking
  );
  public readonly displaySolidataSeasonalAnalysis = Boolean(
    THEME_CONFIGURATION.solidata?.seasonalAnalysis
  );
  public readonly displaySolidataTerritorialAnalysis = Boolean(
    THEME_CONFIGURATION.solidata?.territorialAnalysis
  );
  public readonly displaySolidataFoodAccess = Boolean(
    THEME_CONFIGURATION.solidata?.foodAccess
  );
  public readonly displaySolidataDemoFoodAccess = Boolean(
    THEME_CONFIGURATION.solidata?.demoFoodAccess
  );
  public readonly displaySolidataNavButtons = Boolean(
    THEME_CONFIGURATION.solidata
  );

  public readonly IS_WEBVIEW_APP = IS_WEBVIEW_APP;
  public readonly IS_BOT = IS_BOT;
  public readonly praticalFilesLink = THEME_CONFIGURATION.praticalFilesLink;
  public readonly ALL_SUPPORTED_LANGUAGES_NAME = ALL_SUPPORTED_LANGUAGES_NAME;
  public readonly SUPPORTED_LANGUAGES =
    SUPPORTED_LANGUAGES_BY_COUNTRY[THEME_CONFIGURATION.country];
  public readonly LANGUAGE_FOR_PRACTICAL_FILES = LANGUAGE_FOR_PRACTICAL_FILES;

  public readonly UserRole = UserRole;
  public readonly UserStatus = UserStatus;
  public readonly THEME_CONFIGURATION = THEME_CONFIGURATION;
  public readonly CountryCodes = CountryCodes;
  public readonly SupportedLanguagesCode = SupportedLanguagesCode;

  constructor(
    private readonly authService: AuthService,
    private readonly posthogService: PosthogService,
    private readonly toastr: ToastrService,
    private readonly languageSetupService: LanguageSetupService,
    private readonly currentLanguageService: CurrentLanguageService,
    private readonly translateService: TranslateService,
    private readonly router: Router
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

    // Check whether the user is connected and belongs to an organization
    this.subscription.add(
      this.authService.currentUserSubject.subscribe((user: User) => {
        this.me = user;
        this.isAdmin = this.me ? this.me.admin : false;
        this.showTranslationMenuDropdown =
          (THEME_CONFIGURATION.showTranslationMenuDropdown && this.isAdmin) ||
          this.me?.translator;
        this.showSoligareMenu = THEME_CONFIGURATION.showSoligareMenu
          ? this.isAdmin
          : false;
        if (
          this.isAdmin ||
          this.me?.role === UserRole.OWNER ||
          this.me?.role === UserRole.EDITOR
        ) {
          this.campaignIsActive = campaignIsActive();
          this.isCampaignAvailable = campaignIsAvailable(this.me.territories);
        }
      })
    );
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public logout(): void {
    this.authService.logoutAndRedirect();
  }

  public changeCurrentOrganization(index: number): void {
    const selectedOrganization = this.me.organizations[index];

    if (
      this.me.organizations[index].organization_id ===
      this.me.currentOrga.organization_id
    ) {
      // The selected organization is already the current organization
      this.router.navigate([
        this.currentLanguageService.routePrefix,
        "organisations",
        selectedOrganization.organization_id,
      ]);
      return;
    }

    this.captureEvent("click-change-current-organization", {
      newOrganization: selectedOrganization,
      oldOrganization: this.me.currentOrga,
    });

    this.authService.changeCurrentOrga(index).subscribe({
      next: () => {
        this.router
          .navigate([
            this.currentLanguageService.routePrefix,
            "organisations",
            selectedOrganization.organization_id,
          ])
          .then(() => {
            window.location.reload();
          });
      },
      error: () => {
        this.toastr.error(this.translateService.instant("ERROR_OCCURRED"));
      },
    });
  }

  public useLanguage(language: SupportedLanguagesCode): void {
    this.captureEvent("click-language", { language });

    this.languageSetupService.setLanguageRoutePrefix(language);
  }

  public captureEvent(eventName: string, properties?: PosthogProperties): void {
    this.posthogService.capture(`topbar-${eventName}`, {
      ...properties,
      isNavbarCollapsed: this.isNavbarCollapsed,
      isUpdateCampaignAvailable: this.isCampaignAvailable,
      isUpdateCampaignActive: this.campaignIsActive,
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
