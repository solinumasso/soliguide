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
  OnDestroy,
  OnInit,
  type TemplateRef,
  ViewChild,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Title } from "@angular/platform-browser";

import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { Subscription } from "rxjs";

import { type UserRightsForOrganizations, UserRole } from "@soliguide/common";
import type { PosthogProperties } from "@soliguide/common-angular";

import type { Organisation } from "../../interfaces";
import { OrganisationService } from "../../services/organisation.service";
import type { PlaceForOrganization } from "../../types";

import { CurrentLanguageService } from "../../../general/services/current-language.service";

import type { User } from "../../../users/classes/user.class";
import { AuthService } from "../../../users/services/auth.service";

import {
  DEFAULT_MODAL_OPTIONS,
  generateCompleteName,
  smoothCollapse,
} from "../../../../shared";
import { PosthogService } from "../../../analytics/services/posthog.service";
import { THEME_CONFIGURATION } from "../../../../models";

@Component({
  selector: "app-admin-organisation",
  templateUrl: "./admin-organisation.component.html",
  styleUrls: ["./admin-organisation.component.css"],
  animations: [smoothCollapse],
})
export class AdminOrganisationComponent implements OnInit, OnDestroy {
  private readonly subscription = new Subscription();
  public readonly UserRole = UserRole;
  public readonly THEME_CONFIGURATION = THEME_CONFIGURATION;

  public organisation!: Organisation;
  public me!: User | null;

  @ViewChild("manageRolesModal", { static: true })
  public manageRolesModal!: TemplateRef<NgbModalRef>;

  @ViewChild("sortPlacesModal", { static: true })
  public sortPlacesModal!: TemplateRef<NgbModalRef>;

  public routePrefix: string;
  public addPlaceRoute: string;
  public users: UserRightsForOrganizations[];

  constructor(
    private readonly authService: AuthService,
    private readonly modalService: NgbModal,
    private readonly organisationService: OrganisationService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly titleService: Title,
    private readonly toastr: ToastrService,
    private readonly currentLanguageService: CurrentLanguageService,
    private readonly translateService: TranslateService,
    private readonly posthogService: PosthogService
  ) {
    this.users = [];
    this.routePrefix = this.currentLanguageService.routePrefix;
  }
  public ngOnInit(): void {
    this.me = this.authService.currentUserValue;
    this.addPlaceRoute = `${this.routePrefix}/admin-place/infos`;

    if (this.route.snapshot.params.id) {
      const orgaId = this.route.snapshot.params.id;

      this.subscription.add(
        this.organisationService.get(orgaId).subscribe({
          next: (organisation: Organisation) => {
            this.organisation = organisation;
            this.titleService.setTitle(this.organisation.name);

            if (this.me.admin) {
              this.addPlaceRoute = `${this.addPlaceRoute}/organization/${organisation._id}`;
            }

            this.getUserRightsForOrganization();
          },
          error: () => {
            this.router.navigate([this.routePrefix, "404"]);
            this.toastr.warning(
              this.translateService.instant(
                "SEARCHED_ORGA_COULD_NOT_BE_IDENTIFIED"
              )
            );
          },
        })
      );
    }

    this.subscription.add(
      this.currentLanguageService.subscribe(
        () => (this.routePrefix = this.currentLanguageService.routePrefix)
      )
    );
  }

  public getUserRightsForOrganization(): void {
    this.subscription.add(
      this.organisationService
        .getRolesForOrga(this.organisation)
        .subscribe((userRights: UserRightsForOrganizations[]) => {
          this.users = userRights.filter((userRight) => userRight.verified);
        })
    );
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public openManageRolesModal = (): void => {
    this.captureEvent("click-open-role-modal");
    this.modalService.open(this.manageRolesModal, {
      ...DEFAULT_MODAL_OPTIONS,
      size: "lg",
    });
  };

  public sortPlaces = (by: "name" | "updatedAt" | "createdAt"): void => {
    this.captureEvent("click-sort-places", { sortBy: by });
    this.organisation.places.sort(
      (place1: PlaceForOrganization, place2: PlaceForOrganization) => {
        if (typeof place1[by] === "string") {
          return place1[by].localeCompare(place2[by]);
        }
        return place1[by] - place2[by];
      }
    );
  };

  public sortUsers = (by: "name" | "role"): void => {
    this.captureEvent("click-sort-users", { sortBy: by });
    this.users.sort(
      (
        user1: UserRightsForOrganizations,
        user2: UserRightsForOrganizations
      ) => {
        if (by === "role") {
          if (
            (user1.role === UserRole.OWNER && user2.role !== UserRole.OWNER) ||
            (user1.role === UserRole.EDITOR && user2.role === UserRole.READER)
          ) {
            return -1;
          } else if (
            (user1.role === UserRole.EDITOR && user2.role === UserRole.OWNER) ||
            (user1.role === UserRole.READER && user2.role !== UserRole.READER)
          ) {
            return 1;
          }
        }
        return generateCompleteName(user1.name, user1.lastname).localeCompare(
          generateCompleteName(user2.name, user2.lastname)
        );
      }
    );
  };

  public captureEvent(eventName: string, properties?: PosthogProperties) {
    this.posthogService.capture(`admin-orga-${eventName}`, {
      organizationId: this.organisation._id,
      organization_id: this.organisation.organization_id,
      ...properties,
    });
  }
}
