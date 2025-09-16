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
import { Component, OnInit, OnDestroy } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { ActivatedRoute } from "@angular/router";

import { PlaceStatus, PlaceType, SearchResults } from "@soliguide/common";
import { PosthogProperties } from "@soliguide/common-angular";

import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { Subscription } from "rxjs";

import { Organisation } from "../../interfaces/organisation.interface";
import { OrganisationService } from "../../services/organisation.service";
import { PlaceForOrganization } from "../../types";

import { ManagePlacesService } from "../../../admin-place/services/manage-places.service";

import { Place, THEME_CONFIGURATION } from "../../../../models";

import { PosthogService } from "../../../analytics/services/posthog.service";
import { AdminSearchPlaces } from "../../../admin-place/classes";
import { AuthService } from "../../../users/services/auth.service";

@Component({
  selector: "app-add-place-to-orga",
  templateUrl: "./add-place-to-orga.component.html",
  styleUrls: ["./add-place-to-orga.component.css"],
})
export class AddPlaceToOrgaComponent implements OnInit, OnDestroy {
  public organisation: Organisation;

  public foundPlaces: Place[];
  public orgaPlaces: string[];
  public noPlaces: boolean;

  public search: AdminSearchPlaces;
  public loading: boolean;

  private readonly subscription = new Subscription();

  public readonly AVAILABLE_PLACE_TYPES = Object.values(PlaceType);
  public readonly PlaceType = PlaceType;
  public readonly PlaceStatus = PlaceStatus;
  public readonly THEME_CONFIGURATION = THEME_CONFIGURATION;

  constructor(
    private readonly managePlacesService: ManagePlacesService,
    private readonly organisationService: OrganisationService,
    private readonly route: ActivatedRoute,
    private readonly titleService: Title,
    private readonly toastr: ToastrService,
    private readonly translateService: TranslateService,
    private readonly posthogService: PosthogService,
    private readonly authService: AuthService
  ) {
    this.foundPlaces = [];
    this.orgaPlaces = [];
    this.noPlaces = false;
    this.search = new AdminSearchPlaces(
      { placeType: PlaceType.PLACE },
      this.authService.currentUserValue
    );

    this.loading = false;
    this.organisation = new Organisation();
  }

  public ngOnInit(): void {
    this.titleService.setTitle(
      this.translateService.instant("ADD_PLACE_TO_ORGANIZATION")
    );

    if (this.route.snapshot.params.id) {
      const id = this.route.snapshot.params.id;
      this.subscription.add(
        this.organisationService.get(id).subscribe({
          next: (organisation: Organisation) => {
            this.organisation = new Organisation(organisation);
            this.getPlacesFromOrga();
          },
          error: () => {
            this.toastr.error(
              this.translateService.instant("LOST_ORGANIZATION")
            );
          },
        })
      );
    }

    this.subscription.add(
      this.translateService.onLangChange.subscribe({
        next: () => {
          this.titleService.setTitle(
            this.translateService.instant("ADD_PLACE_TO_ORGANIZATION")
          );
        },
      })
    );
  }

  public getPlacesFromOrga = (): void => {
    this.orgaPlaces = this.organisation.places.map(
      (place: PlaceForOrganization) => {
        return place._id;
      }
    );
  };

  public searchPlacebyName = (val: string): void => {
    if (!val) {
      this.toastr.warning(
        this.translateService.instant("PLACE_CHOOSE_NAME_ID")
      );
      return;
    }
    this.search = new AdminSearchPlaces(
      { placeType: PlaceType.PLACE },
      this.authService.currentUserValue
    );

    this.search.word = val;
    this.search.options.limit = 100;
    this.captureEvent("search-place-by-name");
    this.launchSearch();
  };

  public searchPlacebyId = (lieu_id: string): void => {
    if (!lieu_id) {
      this.toastr.warning(
        this.translateService.instant("PLACE_CHOOSE_NAME_ID")
      );
      return;
    }
    this.search = new AdminSearchPlaces(
      { placeType: PlaceType.PLACE },
      this.authService.currentUserValue
    );
    this.search.lieu_id = parseInt(lieu_id, 10);
    this.captureEvent("search-place-by-id");
    this.launchSearch();
  };

  public placeTypeSearch = (type: PlaceType): void => {
    this.search.placeType = type;

    this.captureEvent("search-place-by-place-type", {
      searchIsLaunched: this.search.word || this.search.lieu_id !== null,
    });

    if (this.search.word || this.search.lieu_id !== null) {
      this.launchSearch();
    }
  };

  private readonly launchSearch = (): void => {
    this.foundPlaces = [];
    this.loading = true;
    this.subscription.add(
      this.managePlacesService
        .launchSearch(this.search, "admin-search-to-add-place-in-orga")
        .subscribe({
          next: (results: SearchResults<Place>) => {
            this.loading = false;
            if (results.nbResults > 0) {
              this.noPlaces = false;
              this.foundPlaces = results.results;
            } else {
              this.noPlaces = true;
              this.foundPlaces = [];
            }
          },
          error: () => {
            this.loading = false;
            this.toastr.error(this.translateService.instant("NO_PLACE_FOUND"));
          },
        })
    );
  };

  public addPlaceToOrga = (place: Place): void => {
    this.captureEvent("click-add-place-to-orga-button", {
      placeId: place.lieu_id,
    });
    this.loading = true;
    this.subscription.add(
      this.organisationService
        .addPlaceToOrga(this.organisation, place)
        .subscribe({
          next: (updatedOrga: Organisation) => {
            this.organisation = updatedOrga;
            this.getPlacesFromOrga();
            this.toastr.success(
              this.translateService.instant("SUCCESS_ADD_PLACE_TO_ORGA")
            );
            this.loading = false;
          },
          error: () => {
            this.loading = false;
            this.toastr.error(
              this.translateService.instant("ERROR_ADD_PLACE_TO_ORGA")
            );
          },
        })
    );
  };

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public captureEvent(eventName: string, properties?: PosthogProperties): void {
    this.posthogService.capture(`add-place-orga-${eventName}`, {
      organizationId: this.organisation._id,
      search: this.search,
      ...properties,
    });
  }
}
