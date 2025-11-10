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
import { Component, OnInit, Input, OnDestroy } from "@angular/core";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { Organization, WithContext } from "schema-dts";
import { Subscription } from "rxjs";

import {
  CAMPAIGN_LIST,
  PlaceClosedHolidays,
  PlaceStatus,
  slugLocation,
  PlaceType,
  PlaceVisibility,
  CAMPAIGN_DEFAULT_NAME,
  TempInfoType,
  PlaceOpeningStatus,
  type AnyDepartmentCode,
  getPosition,
} from "@soliguide/common";

import { PlaceService } from "../../../place/services/place.service";
import { CurrentLanguageService } from "../../../general/services/current-language.service";
import { SeoService } from "../../../shared/services/seo.service";

import type { User } from "../../../users/classes";
import { AuthService } from "../../../users/services/auth.service";

import {
  type MarkerOptions,
  Place,
  THEME_CONFIGURATION,
} from "../../../../models";

import {
  campaignIsActiveWithTheme,
  displayCampaignInfo,
  generateMarkerOptions,
  globalConstants,
} from "../../../../shared/functions";
import { PosthogService } from "../../../analytics/services/posthog.service";
import { PosthogComponent } from "../../../analytics/components/posthog.component";

@Component({
  selector: "app-place",
  templateUrl: "./place.component.html",
  styleUrls: ["./place.component.css"],
})
export class PlaceComponent
  extends PosthogComponent
  implements OnInit, OnDestroy
{
  private readonly subscription = new Subscription();
  public routePrefix: string;
  public place!: Place;
  public me!: User | null;

  public marker: MarkerOptions[];

  public showAddress: boolean;

  public structuredData: WithContext<Organization> | null = null;

  public displayInfo: boolean;
  public displayTempHours: boolean;

  public canEdit: boolean;

  public isTempClosed: boolean;

  public campaignIsActive: boolean;

  public lastSearchUrl: {
    url: string | null;
    queryParams?: Params | null;
  };

  @Input() public placePreview!: Place;
  @Input() public dateForTest!: Date;

  public readonly PlaceClosedHolidays = PlaceClosedHolidays;
  public readonly PlaceType = PlaceType;
  public readonly PlaceVisibility = PlaceVisibility;
  public readonly TempInfoType = TempInfoType;
  public readonly PlaceOpeningStatus = PlaceOpeningStatus;

  public readonly CAMPAIGN_NAME = CAMPAIGN_LIST[CAMPAIGN_DEFAULT_NAME].name;
  public readonly THEME_CONFIGURATION = THEME_CONFIGURATION;

  public territories: AnyDepartmentCode[] = [];

  constructor(
    private readonly authService: AuthService,
    private readonly placeService: PlaceService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly seoService: SeoService,
    private readonly currentLanguageService: CurrentLanguageService,
    posthogService: PosthogService
  ) {
    super(posthogService, "place");
    this.marker = [];

    this.showAddress = false;

    this.lastSearchUrl = {
      url: this.currentLanguageService.routePrefix + "/search",
    };

    this.displayInfo = false;
    this.canEdit = false;
    this.me = null;
    this.isTempClosed = false;
    this.displayTempHours = false;

    this.lastSearchUrl = {
      url: null,
      queryParams: null,
    };
    this.routePrefix = this.currentLanguageService.routePrefix;

    this.campaignIsActive = false;
  }

  public ngOnInit(): void {
    this.me = this.authService.currentUserValue;

    this.subscription.add(
      this.currentLanguageService.subscribe(
        () => (this.routePrefix = this.currentLanguageService.routePrefix)
      )
    );

    this.subscription.add(
      this.route.params.subscribe((params) => {
        if (this.placePreview) {
          this.place = this.placePreview;
          this.updateMarkers();
          this.getDepartmentCodes();
          this.showAddress = true;
          this.campaignIsActive = campaignIsActiveWithTheme(this.territories);

          this.updateDefaultPosthogProperties({
            campaign: this.campaignIsActive ? this.CAMPAIGN_NAME : null,
            campaignIsActive: this.campaignIsActive,
            place: this.place,
          });
        } else if (params.lieu_id) {
          this.getPlace(params.lieu_id);
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

  public getPlace(id: string) {
    // Loading the place
    this.subscription.add(
      this.placeService.getPlace(id).subscribe({
        next: (place: Place) => {
          // define maker option
          this.place = place;
          this.getDepartmentCodes();

          this.campaignIsActive = campaignIsActiveWithTheme(this.territories);

          this.updateDefaultPosthogProperties({
            campaign: this.campaignIsActive ? this.CAMPAIGN_NAME : null,
            campaignIsActive: this.campaignIsActive,
            place: this.place,
          });

          // Update tags
          this.updateTitleAndTags();

          // Generate a barycenter to center the map
          this.updateMarkers();

          // Display campaign panel
          this.displayInfo = displayCampaignInfo(place);

          // Display or not the address
          this.showAddress =
            !this.place.modalities?.orientation ||
            !this.place.modalities.orientation?.checked ||
            this.me !== null;

          // Is the structure temporarily closed
          this.isTempClosed =
            this.place.openingTagStatus ===
            PlaceOpeningStatus.TEMPORARILY_CLOSED;

          // Scroll Top
          window.scroll({
            behavior: "smooth",
            left: 0,
            top: 0,
          });

          this.lastSearchUrl = this.getLastSearchUrl();

          if (this.me && (this.me.pro || this.me.admin)) {
            this.subscription.add(
              this.placeService
                .canEditPlace(id)
                .subscribe((canEdit: boolean) => {
                  this.canEdit = canEdit;
                })
            );
          }

          this.displayTempHours = this.place.tempInfos.hours.actif;
        },

        error: () => {
          this.router.navigate([
            this.currentLanguageService.routePrefix,
            "404",
          ]);
        },
      })
    );
  }

  public getLastSearchUrl = (): {
    url: string;
    queryParams?: Params;
  } => {
    const lastSearchUrl = globalConstants.getItem("LAST_SEARCH_URL");

    if (lastSearchUrl) {
      return {
        url:
          lastSearchUrl.url ??
          `${this.currentLanguageService.routePrefix}/search`,
        queryParams: lastSearchUrl.queryParams ?? {},
      };
    } else {
      const position = getPosition(this.place);
      return {
        url: `${this.currentLanguageService.routePrefix}/search/${slugLocation(
          position.address
        )}`,
        queryParams: {},
      };
    }
  };

  private readonly updateTitleAndTags = (): void => {
    this.seoService.updateTitleAndTags(
      this.place.name,
      this.place.descriptionExtract,
      this.place.status === PlaceStatus.ONLINE
    );

    const telephone: string =
      this.place.entity.phones.length > 0
        ? this.place.entity.phones[0].phoneNumber.toString()
        : "";

    const position = getPosition(this.place);

    this.structuredData = {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: this.place.name,
      description: this.place.descriptionExtract,
      email: this.place.entity.mail,
      address: {
        "@type": "PostalAddress",
        streetAddress: position.address,
        addressLocality: position.city,
        postalCode: position.postalCode,
        addressCountry: "France",
      },
      telephone,
    };
  };

  private readonly updateMarkers = (): void => {
    this.marker = generateMarkerOptions([this.place], this.me);
  };

  public toogleDisplayTempHours = (value: boolean): void => {
    this.displayTempHours = value;
    this.isTempClosed = false;
  };

  public displayRegularHours = (): void => {
    this.isTempClosed = false;
  };

  private getDepartmentCodes(): void {
    const departmentCodes =
      this.place.placeType === PlaceType.PLACE
        ? [this.place?.position?.departmentCode]
        : this.place?.parcours.map(
            (parcours) => parcours.position?.departmentCode
          );

    this.territories = departmentCodes.filter(
      (departmentCode) => departmentCode
    );
  }
}
