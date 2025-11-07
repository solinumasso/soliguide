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
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { Subscription } from "rxjs";

import type { SupportedLanguagesCode, CommonUser } from "@soliguide/common";

import { InviteUserService } from "../../../admin-organisation/services/invite-user.service";
import { CurrentLanguageService } from "../../../general/services/current-language.service";
import type { Invitation } from "../../../users/classes";

import { OriginService } from "../../../shared/services";

@Component({
  selector: "app-display-invitation-table",
  templateUrl: "./display-invitation.component.html",
})
export class DisplayInvitationComponent implements OnInit, OnDestroy {
  @Input({ required: true }) public invitations: Invitation[];
  @Input({ required: true }) public indexTable: number;
  @Input({ required: true }) public tableName: "users" | "orgas";

  @Output() public readonly updateTable = new EventEmitter<{
    index: number;
    updatedUser: CommonUser;
  }>();

  private readonly subscription = new Subscription();
  public routePrefix: string;
  public currentLanguage: SupportedLanguagesCode;
  public loading: boolean;
  public readonly frontendUrl: string;

  constructor(
    private readonly inviteUserService: InviteUserService,
    private readonly toastr: ToastrService,
    private readonly currentLanguageService: CurrentLanguageService,
    private readonly translateService: TranslateService,
    private readonly originService: OriginService
  ) {
    this.routePrefix = this.currentLanguageService.routePrefix;
    this.currentLanguage = this.currentLanguageService.currentLanguage;
    this.frontendUrl = this.originService.getFrontendUrl();
  }

  public ngOnInit(): void {
    this.subscription.add(
      this.currentLanguageService.subscribe((language) => {
        this.routePrefix = this.currentLanguageService.routePrefix;
        this.currentLanguage = language;
      })
    );
    this.invitations.filter(
      (invitation: Invitation) => invitation.pending === true
    );
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public validateInvitation(indexInvitation: number): void {
    this.loading = true;
    this.subscription.add(
      this.inviteUserService
        .validateInvitation(this.invitations[indexInvitation].token)
        .subscribe({
          next: (updatedUser: CommonUser) => {
            this.loading = false;
            this.updateTable.emit({
              index: this.indexTable,
              updatedUser: updatedUser,
            });

            this.invitations.splice(indexInvitation, 1);

            this.toastr.success(
              this.translateService.instant("INVITE_CONFIRMATION")
            );
          },
          error: () => {
            this.loading = false;
            this.toastr.error(this.translateService.instant("ERROR_TRY_AGAIN"));
          },
        })
    );
  }

  public reSendInvite(invitation: Invitation): void {
    this.loading = true;
    this.subscription.add(
      this.inviteUserService
        .reSendInvite(invitation.organization, invitation)
        .subscribe({
          next: () => {
            this.loading = false;
            this.toastr.success(
              this.translateService.instant("INVITATION_HAS_BEEN_SENT")
            );
          },
          error: () => {
            this.loading = false;
            this.toastr.error(this.translateService.instant("ERROR_TRY_AGAIN"));
          },
        })
    );
  }

  public deleteInvitation(indexInvitation: number): void {
    this.loading = true;
    this.subscription.add(
      this.inviteUserService
        .deleteInvitation(this.invitations[indexInvitation].token)
        .subscribe({
          next: () => {
            this.loading = false;
            this.invitations.splice(indexInvitation, 1);
            this.toastr.success(
              this.translateService.instant("DELETION_COMPLETED_SUCCESSFULLY")
            );
          },
          error: () => {
            this.loading = false;
            this.toastr.error(
              this.translateService.instant("DELETION_COULD_NOT_BE_COMPLETED")
            );
          },
        })
    );
  }

  public showSuccessMessage() {
    this.toastr.success(
      this.translateService.instant("LINK_COPIED_SUCCESSFULLY")
    );
  }
}
