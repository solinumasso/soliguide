import {
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import { Title } from "@angular/platform-browser";

import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";

import {
  AnyDepartmentCode,
  CommonUser,
  SearchResults,
  UserSearchContext,
  UserStatus,
} from "@soliguide/common";

import { ToastrService } from "ngx-toastr";

import { Subject, ReplaySubject, Subscription } from "rxjs";

import { SearchUsersObject } from "../../classes";
import { AdminUsersService } from "../../services/admin-users.service";
import { SearchUsersSortBy } from "../../types";

import { CurrentLanguageService } from "../../../general/services/current-language.service";

import { User } from "../../../users/classes";
import { AuthService } from "../../../users/services/auth.service";

import { TranslateService } from "@ngx-translate/core";

import {
  DEFAULT_MODAL_OPTIONS,
  fadeInOut,
  globalConstants,
  SyncService,
} from "../../../../shared";
import { ApiError, ApiMessage, THEME_CONFIGURATION } from "../../../../models";
import { OriginService } from "../../../shared/services";

@Component({
  animations: [fadeInOut],
  selector: "app-manage-users",
  templateUrl: "./manage-users.component.html",
  styleUrls: ["./manage-users.component.css"],
})
export class ManageUsersComponent implements OnInit, OnDestroy {
  public readonly THEME_CONFIGURATION = THEME_CONFIGURATION;
  private readonly subscription = new Subscription();
  public me!: User | null;
  public users: CommonUser[];
  public selectedUser: CommonUser;

  public nbResults: number;
  public loading: boolean;

  public syncLoading: boolean;
  public idSyncedUser: number | null;

  public search: SearchUsersObject;
  public searchSubject: Subject<SearchUsersObject> = new ReplaySubject(1);

  @ViewChild("deleteUserModal", { static: true })
  public deleteUserModal!: TemplateRef<NgbModalRef>;

  public readonly UserStatus = UserStatus;

  public routePrefix: string;

  constructor(
    private readonly adminUsersService: AdminUsersService,
    private readonly authService: AuthService,
    private readonly modalService: NgbModal,
    private readonly titleService: Title,
    private readonly toastr: ToastrService,
    private readonly currentLanguageService: CurrentLanguageService,
    private readonly translateService: TranslateService,
    private readonly originService: OriginService,
    private readonly syncService: SyncService
  ) {
    this.loading = false;
    this.syncLoading = false;
    this.idSyncedUser = null;
    this.users = [];
    this.nbResults = 0;
    this.search = new SearchUsersObject(
      {
        context: UserSearchContext.MANAGE_USERS,
      },
      this.me
    );
    this.selectedUser = null;
    this.me = null;
    this.routePrefix = this.currentLanguageService.routePrefix;
  }

  public ngOnInit(): void {
    this.subscription.add(
      this.currentLanguageService.subscribe(
        () => (this.routePrefix = this.currentLanguageService.routePrefix)
      )
    );
    this.titleService.setTitle(this.translateService.instant("MANAGE_USERS"));

    // Fetch user data to initiate the search
    this.me = this.authService.currentUserValue;

    this.search = new SearchUsersObject(
      {
        ...globalConstants.getItem("MANAGE_USERS"),
      },
      this.me
    );

    this.launchSearch();
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public launchSearch(resetPagination?: boolean): void {
    if (resetPagination) {
      this.search.options.page = 1;
    }

    this.loading = true;
    this.users = [];

    globalConstants.setItem("MANAGE_USERS", this.search);

    this.subscription.add(
      this.adminUsersService.searchUsers(this.search).subscribe({
        next: (retour: SearchResults<CommonUser>) => {
          this.users = retour.results;
          this.nbResults = retour.nbResults;
          this.loading = false;

          window.scroll({
            behavior: "smooth",
            left: 0,
            top: 0,
          });
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

  public setTerritories(selectedTerritories: string[]): void {
    this.search.territories = selectedTerritories as AnyDepartmentCode[];
    this.launchSearch();
  }

  public resetSearchArgument = (key: string): void => {
    this.search.resetSearchElement(key);
    this.launchSearch();
  };

  public sortBy(sortByValue: SearchUsersSortBy): void {
    this.search.sort(this.search.options, sortByValue);
    this.launchSearch();
  }

  public updateUserAfterInvitation(retour: {
    index: number;
    updatedUser: CommonUser;
  }): void {
    this.users[retour.index] = retour.updatedUser;
  }

  public deleteUser(): void {
    this.subscription.add(
      this.adminUsersService.deleteUser(this.selectedUser).subscribe({
        next: () => {
          this.launchSearch();
          this.toastr.success(
            this.translateService.instant("USER_DELETED_SUCCESSFULLY")
          );
          this.cancelDelete();
        },
        error: () => {
          this.toastr.error(
            this.translateService.instant("THERE_WAS_A_PROBLEM")
          );
          this.cancelDelete();
        },
      })
    );
  }

  public openDeleteModal(user: CommonUser): void {
    this.selectedUser = user;
    this.modalService.open(this.deleteUserModal, DEFAULT_MODAL_OPTIONS);
  }

  public cancelDelete(): void {
    this.modalService.dismissAll();
    this.selectedUser = null;
  }

  public generateResetPasswordLink(userMail: string): void {
    if (!userMail) {
      this.toastr.error(this.translateService.instant("USER_MAIL_NOT_FOUND"));
      return;
    }

    this.subscription.add(
      this.adminUsersService.generateResetPasswordToken(userMail).subscribe({
        next: (response: { passwordToken: string }) => {
          const resetLink = `${this.originService.getFrontendUrl()}${
            this.currentLanguageService.currentLanguage
          }/reset-password/${response.passwordToken}`;

          navigator.clipboard
            .writeText(resetLink)
            .then(() => {
              this.toastr.success(
                this.translateService.instant("LINK_COPIED_SUCCESSFULLY")
              );
            })
            .catch(() => {
              this.toastr.error(
                this.translateService.instant("ERROR_COPYING_LINK")
              );
            });
        },
        error: () => {
          this.toastr.error(
            this.translateService.instant("ERROR_GENERATING_RESET_LINK")
          );
        },
      })
    );
  }

  public syncUsersByIds(userId: number): void {
    this.idSyncedUser = userId;

    this.syncLoading = true;

    this.subscription.add(
      this.syncService.syncByIds([userId], "users").subscribe({
        next: (value: ApiMessage) => {
          this.syncLoading = false;
          this.toastr.success(this.translateService.instant(value.message));
        },
        error: (error: ApiError) => {
          this.syncLoading = false;
          this.toastr.error(this.translateService.instant(error.message));
        },
      })
    );
  }

  public syncUsersBySearch(): void {
    this.idSyncedUser = null;

    this.syncLoading = true;

    this.subscription.add(
      this.syncService.syncWithSearchParams(this.search, "users").subscribe({
        next: (value: ApiMessage) => {
          this.syncLoading = false;
          this.toastr.success(this.translateService.instant(value.message));
        },
        error: (error: ApiError) => {
          this.syncLoading = false;
          this.toastr.error(this.translateService.instant(error.message));
        },
      })
    );
  }
}
