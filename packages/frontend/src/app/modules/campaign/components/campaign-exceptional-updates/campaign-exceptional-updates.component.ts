import { Component, OnDestroy, OnInit } from "@angular/core";
import { Title } from "@angular/platform-browser";

import { forkJoin, Subscription } from "rxjs";

import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";

import {
  Campaign,
  CommonUser,
  SearchResults,
  UserSearchContext,
  UserStatus,
} from "@soliguide/common";
import type { PosthogProperties } from "@soliguide/common-angular";

import { SearchUsersObject } from "../../../admin-users/classes";
import { AdminUsersService } from "../../../admin-users/services/admin-users.service";
import { AdminCampaignsService } from "../../services/admin-campaigns.service";

import { AuthService } from "../../../users/services/auth.service";
import { CurrentLanguageService } from "../../../general/services/current-language.service";
import { PosthogService } from "../../../analytics/services/posthog.service";
import { User } from "../../../users/classes";

import { THEME_CONFIGURATION } from "../../../../models";

const USERS_LIMIT = 50;

@Component({
  selector: "app-campaign-exceptional-updates",
  templateUrl: "./campaign-exceptional-updates.component.html",
  styleUrls: ["./campaign-exceptional-updates.component.css"],
})
export class CampaignExceptionalUpdatesComponent implements OnInit, OnDestroy {
  public readonly THEME_CONFIGURATION = THEME_CONFIGURATION;
  private readonly subscription = new Subscription();

  public loading = true;
  public campaigns: Campaign[] = [];
  public users: CommonUser[] = [];
  public routePrefix: string;

  constructor(
    private readonly adminCampaignsService: AdminCampaignsService,
    private readonly adminUsersService: AdminUsersService,
    private readonly authService: AuthService,
    private readonly currentLanguageService: CurrentLanguageService,
    private readonly posthogService: PosthogService,
    private readonly toastr: ToastrService,
    private readonly titleService: Title,
    private readonly translateService: TranslateService
  ) {
    this.routePrefix = this.currentLanguageService.routePrefix;
  }

  public captureEvent(eventName: string, properties?: PosthogProperties): void {
    this.posthogService.capture(
      `exceptional-campaigns-${eventName}`,
      properties
    );
  }

  public ngOnInit(): void {
    this.titleService.setTitle(
      this.translateService.instant("EXCEPTIONAL_UPDATE_CAMPAIGNS_TITLE")
    );

    this.subscription.add(
      this.currentLanguageService.subscribe(
        () => (this.routePrefix = this.currentLanguageService.routePrefix)
      )
    );

    const me: User | null = this.authService.currentUserValue;

    const search = new SearchUsersObject(
      {
        context: UserSearchContext.MANAGE_CAMPAIGN_USERS,
        status: UserStatus.PRO,
        options: { limit: USERS_LIMIT, page: 1 },
      },
      me
    );

    this.subscription.add(
      forkJoin({
        campaigns: this.adminCampaignsService.getActiveCampaigns(
          THEME_CONFIGURATION.country
        ),
        users: this.adminUsersService.searchUsers(search),
      }).subscribe({
        next: ({
          campaigns,
          users,
        }: {
          campaigns: Campaign[];
          users: SearchResults<CommonUser>;
        }) => {
          this.campaigns = campaigns;
          this.users = users.results;
          this.loading = false;
          this.captureEvent("page-view", {
            campaignsCount: campaigns.length,
            usersCount: users.results.length,
          });
        },
        error: () => {
          this.loading = false;
          this.captureEvent("load-error");
          this.toastr.error(
            this.translateService.instant("THERE_WAS_A_PROBLEM")
          );
        },
      })
    );
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public trackByCampaignSlug(_: number, campaign: Campaign): string {
    return campaign.slug;
  }

  public trackByUserId(_: number, user: CommonUser): number {
    return user.user_id;
  }
}
