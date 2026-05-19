import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";

import { type UserRightsForOrganizations, UserRole } from "@soliguide/common";
import type { PosthogProperties } from "@soliguide/common-angular";

import { CurrentLanguageService } from "../../../general/services/current-language.service";
import type { User } from "../../../users/classes";
import { USER_ROLES_COLORS } from "../../../users/constants";
import { PosthogService } from "../../../analytics/services/posthog.service";
import type { Organisation } from "../../interfaces";

@Component({
  selector: "app-list-user",
  templateUrl: "./list-user.component.html",
  styleUrls: ["./list-user.component.css"],
})
export class ListUserComponent implements OnInit, OnDestroy {
  @Input() public userRights: UserRightsForOrganizations[];
  @Input() public me!: User | null;
  @Input() private readonly organisation!: Organisation;

  public readonly UserRole = UserRole;
  public readonly USER_ROLES_COLORS = USER_ROLES_COLORS;
  private readonly subscription = new Subscription();

  public routePrefix: string;

  constructor(
    private readonly currentLanguageService: CurrentLanguageService,
    private readonly posthogService: PosthogService
  ) {
    this.userRights = [];
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

  public captureEvent(eventName: string, properties?: PosthogProperties): void {
    this.posthogService.capture(`admin-orga-list-user-${eventName}`, {
      ...properties,
      organizationId: this.organisation._id,
      organization_id: this.organisation.organization_id,
    });
  }
}
