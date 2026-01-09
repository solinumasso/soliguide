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
  OnInit,
  ViewChild,
  TemplateRef,
  OnDestroy,
} from "@angular/core";
import { Title } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { Subscription } from "rxjs";

import {
  CAMPAIGN_DEFAULT_NAME,
  PlaceClosedHolidays,
  PlaceStatus,
  PlaceVisibility,
  TempInfoType,
  PlaceType,
  getDepartmentCodeFromPostalCode,
  UserRole,
  isDraftAndFormUncomplete,
  SoliguideCountries,
  CountryCodes,
  getPosition,
} from "@soliguide/common";

import { AdminPlaceService } from "../../../form-place/services/admin-place.service";

import { CurrentLanguageService } from "../../../general/services/current-language.service";

import { User } from "../../../users/classes";
import { AuthService } from "../../../users/services/auth.service";

import {
  type Place,
  ApiError,
  ApiMessage,
  MarkerOptions,
  THEME_CONFIGURATION,
} from "../../../../models";

import {
  generateMarkerOptions,
  campaignIsActiveWithTheme,
  DEFAULT_MODAL_OPTIONS,
  SyncService,
} from "../../../../shared";
import { PosthogService } from "../../../analytics/services/posthog.service";

@Component({
  selector: "app-admin-place",
  templateUrl: "./admin-place.component.html",
  styleUrls: [
    "./admin-place.component.css",
    "../helper-notification/helper-notification.component.css",
  ],
})
export class AdminPlaceComponent implements OnInit, OnDestroy {
  private readonly subscription = new Subscription();
  public place!: Place;
  public me!: User | null;
  public markers: MarkerOptions[];
  public campaignIsActive: boolean;
  public campaignIsActiveForPlace: boolean;
  public placeInOrga: boolean;

  public routePrefix: string;

  public readonly THEME_CONFIGURATION = THEME_CONFIGURATION;
  public readonly PlaceClosedHolidays = PlaceClosedHolidays;
  public readonly PlaceStatus = PlaceStatus;
  public readonly TempInfoType = TempInfoType;
  public readonly PlaceVisibility = PlaceVisibility;
  public readonly PlaceType = PlaceType;
  public readonly UserRole = UserRole;
  public isDraftAndFormUncomplete = true;

  @ViewChild("duplicatePlaceModal", { static: true })
  public duplicatePlaceModale!: TemplateRef<NgbModalRef>;

  @ViewChild("deletePlaceModal", { static: true })
  public deletePlaceModal!: TemplateRef<NgbModalRef>;

  @ViewChild("removePlaceModal", { static: true })
  public removePlaceModal!: TemplateRef<NgbModalRef>;
  public currentUrl: string;

  public syncLoading: boolean;

  constructor(
    private readonly adminPlaceService: AdminPlaceService,
    private readonly authService: AuthService,
    private readonly modalService: NgbModal,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly titleService: Title,
    private readonly toastr: ToastrService,
    private readonly translateService: TranslateService,
    private readonly currentLanguageService: CurrentLanguageService,
    protected readonly posthogService: PosthogService,
    private readonly syncService: SyncService
  ) {
    this.markers = [];

    this.campaignIsActive = false;
    this.campaignIsActiveForPlace = false;
    this.placeInOrga = false;
    this.routePrefix = this.currentLanguageService.routePrefix;

    this.syncLoading = false;
  }

  public ngOnInit(): void {
    this.subscription.add(
      this.currentLanguageService.subscribe(
        () => (this.routePrefix = this.currentLanguageService.routePrefix)
      )
    );
    this.me = this.authService.currentUserValue;
    this.currentUrl = this.router.url;
    const hashIndex = this.currentUrl.indexOf("#");
    if (hashIndex > -1) {
      this.currentUrl = this.currentUrl.slice(0, hashIndex);
    }

    this.campaignIsActive = campaignIsActiveWithTheme(this.me?.territories);

    this.subscription.add(
      this.route.params.subscribe((params) => {
        if (params.lieu_id) {
          const id = params.lieu_id;
          this.adminPlaceService.getPlace(id).subscribe({
            next: (place: Place) => {
              this.titleService.setTitle(place.name);
              this.place = place;
              this.checkPlaceInOrga(place.lieu_id);
              this.isDraftAndFormUncomplete = isDraftAndFormUncomplete(place);
              this.markers = generateMarkerOptions([place], this.me);
              this.campaignIsActiveForPlace = this.getIsCampaignActive();
            },
            error: () => {
              this.router.navigate([
                this.currentLanguageService.routePrefix,
                "fiche",
                id,
              ]);
            },
          });
        } else {
          this.router.navigate([
            this.currentLanguageService.routePrefix,
            "404",
          ]);
        }
      })
    );
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public checkPlaceInOrga = (lieu_id: number): void => {
    this.subscription.add(
      this.adminPlaceService
        .checkInOrga(lieu_id)
        .subscribe((retour: boolean) => {
          this.placeInOrga = retour;
        })
    );
  };

  public statusDropDown(status: PlaceStatus): void {
    if (status !== this.place.status) {
      this.subscription.add(
        this.adminPlaceService.patchStatus(this.place, status).subscribe({
          next: (place: Place) => {
            this.place = place;
            this.toastr.success(
              this.translateService.instant("NEW_PLACE_STATUS", {
                placeStatus: this.translateService.instant(place.status),
              })
            );
          },
          error: () => {
            this.toastr.error(
              this.translateService.instant("IMPOSSIBLE_TO_UPDATE_STATUS")
            );
          },
        })
      );
    }
  }

  public setNoChange(): void {
    this.captureEvent("click-no-change");

    this.subscription.add(
      this.adminPlaceService.patchNoChange(this.place.lieu_id).subscribe({
        next: (place: Place) => {
          this.place = place;
          this.toastr.success(
            this.translateService.instant("PLACE_UPDATE_SUCCESS")
          );
        },
        error: () => {
          this.toastr.error(this.translateService.instant("NO_CHANGE_FAIL"));
        },
      })
    );
  }

  // right nav scroll to element
  public static scroll(el: HTMLElement): void {
    el.scrollIntoView({ behavior: "smooth" });
  }
  public openDuplicateModal(): void {
    this.modalService.open(this.duplicatePlaceModale, DEFAULT_MODAL_OPTIONS);
  }

  public openDeleteModal(): void {
    this.modalService.open(this.deletePlaceModal, DEFAULT_MODAL_OPTIONS);
  }

  public changeVisibility = (visibility: PlaceVisibility): void => {
    this.subscription.add(
      this.adminPlaceService.patchVisibility(this.place, visibility).subscribe({
        next: (place: Place) => {
          this.place = place;

          this.toastr.success(
            this.place.visibility === PlaceVisibility.PRO
              ? this.translateService.instant("VISIBLE_PRO_ONLY")
              : this.translateService.instant("VISIBLE_ALL")
          );
        },
        error: () => {
          this.toastr.error(
            this.translateService.instant("VISIBILITY_UPDATE_FAIL")
          );
        },
      })
    );
  };

  public getIsCampaignActive = (): boolean => {
    const position = getPosition(this.place);
    const postalCode = position.postalCode;
    const country = position.country;

    return (
      THEME_CONFIGURATION.country === CountryCodes.FR &&
      postalCode &&
      country &&
      campaignIsActiveWithTheme([
        getDepartmentCodeFromPostalCode(
          country as SoliguideCountries,
          postalCode
        ),
      ])
    );
  };

  public syncPlace(): void {
    this.syncLoading = true;

    this.subscription.add(
      this.syncService.syncByIds([this.place.lieu_id], "places").subscribe({
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

  public captureEvent(eventName: string, properties?: Record<string, unknown>) {
    const placeId = this.place.lieu_id;
    const campaignIsActive = this.campaignIsActive;
    const campaign = campaignIsActive ? CAMPAIGN_DEFAULT_NAME : null;

    this.posthogService.capture(`admin-place-${eventName}`, {
      ...properties,
      placeId,
      campaignIsActive,
      campaign,
    });
  }
}
