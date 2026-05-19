import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";

import { UserRole } from "@soliguide/common";
import type { PosthogProperties } from "@soliguide/common-angular";

import { InviteUserService } from "../../services/invite-user.service";
import type { Organisation } from "../../interfaces";
import { CurrentLanguageService } from "../../../general/services/current-language.service";
import type { Invitation, User } from "../../../users/classes";

import { PosthogService } from "../../../analytics/services/posthog.service";
import { OriginService } from "../../../shared/services";

@Component({
  selector: "app-list-invitations",
  templateUrl: "./list-invitations.component.html",
  styleUrls: ["./list-invitations.component.css"],
})
export class ListInvitationsComponent implements OnInit, OnDestroy {
  @Input() public me!: User | null;
  @Input() public organisation: Organisation;

  private readonly subscription = new Subscription();
  public readonly UserRole = UserRole;

  public currentLanguage: string;
  public frontendUrl: string;

  constructor(
    private readonly inviteUserService: InviteUserService,
    private readonly toastr: ToastrService,
    private readonly currentLanguageService: CurrentLanguageService,
    private readonly translateService: TranslateService,
    private readonly posthogService: PosthogService,
    private readonly originService: OriginService
  ) {
    this.currentLanguage = this.currentLanguageService.currentLanguage;
    this.frontendUrl = this.originService.getFrontendUrl();
  }

  public ngOnInit(): void {
    this.subscription.add(
      this.currentLanguageService.subscribe(
        (language) => (this.currentLanguage = language)
      )
    );
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public reSendInvite(invitation: Invitation): void {
    this.captureEvent("click-re-send", {
      invitationId: invitation._id,
      createdBy: invitation.createdBy,
      user_id: invitation.user_id,
    });

    this.subscription.add(
      this.inviteUserService
        .reSendInvite(this.organisation, invitation)
        .subscribe({
          next: () => {
            this.toastr.success(
              this.translateService.instant("INVITATION_SENT")
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

  public deleteInvitation(invitation: Invitation): void {
    this.captureEvent("click-delete", {
      invitationId: invitation._id,
      createdBy: invitation.createdBy,
      user_id: invitation.user_id,
    });

    this.subscription.add(
      this.inviteUserService.deleteInvitation(invitation.token).subscribe({
        next: () => {
          this.toastr.success(
            this.translateService.instant("DELETION_COMPLETED_SUCCESSFULLY")
          );
          this.organisation.invitations.splice(
            this.organisation.invitations.indexOf(invitation),
            1
          );
        },
        error: () => {
          this.toastr.error(
            this.translateService.instant("DELETION_COULD_NOT_BE_COMPLETED")
          );
        },
      })
    );
  }

  public onCopiedLinkClick(): void {
    this.toastr.success(
      this.translateService.instant("LINK_COPIED_SUCCESSFULLY")
    );
  }

  public captureEvent(eventName: string, properties?: PosthogProperties): void {
    this.posthogService.capture(`admin-orga-list-invitations-${eventName}`, {
      organizationId: this.organisation._id,
      organization_id: this.organisation.organization_id,
      ...properties,
    });
  }
}
