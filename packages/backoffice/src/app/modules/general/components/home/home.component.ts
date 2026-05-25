import { Component, OnDestroy, OnInit } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { TranslateService } from "@ngx-translate/core";
import { Subscription } from "rxjs";

import { UserRole } from "@soliguide/common";

import type { User } from "../../../users/classes/user.class";
import { AuthService } from "../../../users/services/auth.service";
import { Organisation } from "../../../admin-organisation/interfaces/organisation.interface";
import { OrganisationService } from "../../../admin-organisation/services/organisation.service";
import { CurrentLanguageService } from "../../services/current-language.service";
import {
  campaignIsActiveWithTheme,
  campaignIsAvailable,
} from "../../../../shared";
import { THEME_CONFIGURATION } from "../../../../models";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit, OnDestroy {
  private readonly subscription = new Subscription();

  public me: User | null = null;
  public routePrefix: string;
  public campaignIsActive = campaignIsActiveWithTheme();
  public isCampaignAvailable = false;
  public showSoligareMenu = false;
  public showTranslationMenuDropdown = false;
  public singleOrganisation: Organisation | null = null;

  public readonly UserRole = UserRole;
  public readonly THEME_CONFIGURATION = THEME_CONFIGURATION;

  public get headerStyle(): Record<string, string> {
    return {
      background: `linear-gradient(rgba(62, 58, 113, 0.75), rgba(62, 58, 113, 0.95)), url(/assets/images/homepage/background-home-search-${THEME_CONFIGURATION.country}.jpg)`,
      "background-size": "cover",
      "background-position": "center",
    };
  }

  constructor(
    private readonly authService: AuthService,
    private readonly organisationService: OrganisationService,
    private readonly currentLanguageService: CurrentLanguageService,
    private readonly titleService: Title,
    private readonly translateService: TranslateService
  ) {
    this.routePrefix = this.currentLanguageService.routePrefix;
  }

  public ngOnInit(): void {
    this.titleService.setTitle(
      this.translateService.instant("BACKOFFICE_HOME_TITLE", {
        brandName: THEME_CONFIGURATION.brandName,
      })
    );

    this.subscription.add(
      this.currentLanguageService.subscribe(() => {
        this.routePrefix = this.currentLanguageService.routePrefix;
      })
    );

    this.subscription.add(
      this.authService.currentUserSubject.subscribe((user: User) => {
        this.me = user;
        this.showSoligareMenu = THEME_CONFIGURATION.showSoligareMenu
          ? user?.admin
          : false;
        this.showTranslationMenuDropdown =
          (THEME_CONFIGURATION.showTranslationMenuDropdown && user?.admin) ||
          user?.translator;
        if (
          user?.admin ||
          user?.role === UserRole.OWNER ||
          user?.role === UserRole.EDITOR
        ) {
          this.campaignIsActive = campaignIsActiveWithTheme();
          this.isCampaignAvailable = campaignIsAvailable(user.territories);
        }
        if (user?.pro && user.organizations.length === 1) {
          this.fetchSingleOrganisation(
            String(user.organizations[0].organization_id)
          );
        }
      })
    );
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private fetchSingleOrganisation(organizationId: string): void {
    this.subscription.add(
      this.organisationService.get(organizationId).subscribe({
        next: (organisation: Organisation) => {
          this.singleOrganisation = organisation;
        },
      })
    );
  }
}
