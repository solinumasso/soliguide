import { Component, OnDestroy, OnInit } from "@angular/core";
import { Title } from "@angular/platform-browser";

import {
  UserSearchContext,
  UserStatus,
  CommonUser,
  SearchResults,
} from "@soliguide/common";

import { ToastrService } from "ngx-toastr";

import { Subscription } from "rxjs";

import { SearchUsersObject } from "../../classes";
import { AdminUsersService } from "../../services/admin-users.service";
import { SearchUsersSortBy } from "../../types";

import { CurrentLanguageService } from "../../../general/services/current-language.service";

import { User } from "../../../users/classes";
import { AuthService } from "../../../users/services/auth.service";

import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-manage-api-users",
  templateUrl: "./manage-api-users.component.html",
  styleUrls: ["./manage-api-users.component.css"],
})
export class ManageApiUsersComponent implements OnInit, OnDestroy {
  private readonly subscription = new Subscription();

  public me!: User | null;
  public partners!: CommonUser[];

  public page: number;
  public name: string;
  public nbResults: number;
  public loading: boolean;

  public search: SearchUsersObject;
  public routePrefix: string;

  constructor(
    private readonly toastr: ToastrService,
    private readonly currentLanguageService: CurrentLanguageService,
    private readonly titleService: Title,
    private readonly authService: AuthService,
    private readonly adminUsersService: AdminUsersService,
    private readonly translateService: TranslateService
  ) {
    this.nbResults = 0;
    this.page = 1;
    this.routePrefix = this.currentLanguageService.routePrefix;
  }

  public ngOnInit(): void {
    this.subscription.add(
      this.currentLanguageService.subscribe(
        () => (this.routePrefix = this.currentLanguageService.routePrefix)
      )
    );
    this.titleService.setTitle(this.translateService.instant("API_PARTNERS"));

    this.me = this.authService.currentUserValue;

    this.search = new SearchUsersObject(
      {
        context: UserSearchContext.MANAGE_PARTNERS,
      },
      this.me
    );

    this.launchSearch();
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public launchSearch() {
    this.search.status = UserStatus.API_USER;
    this.loading = true;

    this.subscription.add(
      this.adminUsersService.searchUsers(this.search).subscribe({
        next: (searchResults: SearchResults<CommonUser>) => {
          this.partners = searchResults.results;
          this.nbResults = searchResults.nbResults;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          this.toastr.error(
            this.translateService.instant("THERE_WAS_A_PROBLEM")
          );
        },
      })
    );
  }

  public sortBy(sortByValue: SearchUsersSortBy): void {
    this.search.sort(this.search.options, sortByValue);
    this.launchSearch();
  }

  public removeFromDev(user: CommonUser, name: string): void {
    this.subscription.add(
      this.adminUsersService.removeFromDev(user._id).subscribe({
        next: () => {
          user.blocked = true;
          this.toastr.success(
            this.translateService.instant("USER_DELETED_FROM_PARTNERS", {
              userName: name,
            })
          );
        },
        error: () => {
          this.toastr.error(
            this.translateService.instant("THERE_WAS_A_PROBLEM")
          );
        },
      })
    );
  }

  public generateToken(user: CommonUser): void {
    this.subscription.add(
      this.adminUsersService.createDevToken(user._id).subscribe({
        next: (token: string) => {
          user.devToken = token;
          this.toastr.success(
            this.translateService.instant("TOKEN_SUCCESSFULLY_GENERATED")
          );
        },
        error: () => {
          this.toastr.error(
            this.translateService.instant("THERE_WAS_A_PROBLEM")
          );
        },
      })
    );
  }

  public showTokenCopiedMessage(): void {
    this.toastr.success(
      this.translateService.instant("TOKEN_SUCCESSFULLY_COPIED")
    );
  }
}
