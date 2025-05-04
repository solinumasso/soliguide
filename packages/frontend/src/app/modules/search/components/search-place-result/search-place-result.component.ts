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
import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { format } from "date-fns";
import { Subscription, concatMap } from "rxjs";

import {
  PlaceClosedHolidays,
  PlaceStatus,
  PlaceType,
  TempInfoType,
  PlaceVisibility,
  GeoTypes,
  PlaceOpeningStatus,
  type ExternalStructure,
  type SearchResults,
} from "@soliguide/common";
import type { PosthogProperties } from "@soliguide/common-angular";

import { CurrentLanguageService } from "../../../general/services/current-language.service";
import type { Place } from "../../../../models/place";
import { fadeInOut } from "../../../../shared/animations";
import { PosthogService } from "../../../analytics/services/posthog.service";
import type { Search } from "../../interfaces";

import { SoligarePairService } from "../../../soligare/services/soligare-pair.service";
import { globalConstants } from "../../../../shared/functions";
import { SoligareSearchService } from "../../../soligare/services/soligare-search.service";

@Component({
  animations: [fadeInOut],
  selector: "app-search-place-result",
  templateUrl: "./search-place-result.component.html",
  styleUrls: [
    "./search-place-result.component.css",
    "../search/search.component.scss",
  ],
})
export class SearchPlaceResultComponent implements OnInit, OnDestroy {
  private readonly subscription = new Subscription();
  @Input() public place: Place;
  @Input() public search: Search;
  @Input() public placeIndex: number;
  @Input() public isInSoligare: boolean;
  @Input() public sourceName: string;
  @Input() public sourceId: string;

  public routePrefix: string;

  public todayDate: Date;
  public today: string;
  public isPhoneNumberVisible: boolean[] = [];

  public readonly PlaceStatus = PlaceStatus;
  public readonly PlaceVisibility = PlaceVisibility;
  public readonly PlaceClosedHolidays = PlaceClosedHolidays;
  public readonly TempInfoType = TempInfoType;
  public readonly PlaceType = PlaceType;
  public readonly GeoTypes = GeoTypes;
  public readonly PlaceOpeningStatus = PlaceOpeningStatus;

  constructor(
    private readonly currentLanguageService: CurrentLanguageService,
    private readonly posthogService: PosthogService,
    private readonly toastr: ToastrService,
    private readonly router: Router,
    private readonly translateService: TranslateService,
    private readonly soligarePairService: SoligarePairService,
    private readonly soligareSearchService: SoligareSearchService
  ) {
    this.todayDate = new Date();
    this.today = format(this.todayDate, "EEEE").toLowerCase();
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
    this.posthogService.capture(`search-place-result-${eventName}`, {
      ...properties,
      search: this.search,
    });
  }

  public togglePhoneNumber(phoneIndex: number): void {
    this.isPhoneNumberVisible[phoneIndex] =
      !this.isPhoneNumberVisible[phoneIndex];
  }

  public pairPlaces(place: Place): void {
    this.subscription.add(
      this.soligarePairService
        .pair(this.sourceId, place.lieu_id)
        .pipe(
          concatMap(() =>
            this.soligarePairService.sourceDetails(this.sourceId)
          ),
          concatMap((response) =>
            this.soligarePairService.putSource(place.lieu_id, response)
          )
        )
        .subscribe({
          next: () => {
            this.toastr.success(this.translateService.instant("PAIR_SUCCESS"));
            const searchInLocalstorage =
              globalConstants.getItem("SOLIGARE_SEARCH");

            if (!searchInLocalstorage) {
              this.router.navigate([
                this.currentLanguageService.routePrefix,
                "soligare",
              ]);
            }

            this.subscription.add(
              this.soligareSearchService
                .launchSearch(searchInLocalstorage)
                .subscribe({
                  next: (response: SearchResults<ExternalStructure>) => {
                    const nextPotentialDuplicate: ExternalStructure =
                      response.results[0];

                    if (!nextPotentialDuplicate) {
                      this.router.navigate([
                        this.currentLanguageService.routePrefix,
                        "soligare",
                      ]);
                    }

                    this.router.navigate([
                      this.currentLanguageService.routePrefix,
                      "soligare",
                      "matching",
                      nextPotentialDuplicate.id,
                    ]);
                  },
                  error: () => {
                    this.router.navigate([
                      this.currentLanguageService.routePrefix,
                      "soligare",
                    ]);
                  },
                })
            );
          },
          error: () => {
            this.toastr.warning(this.translateService.instant("PAIRING_FAIL"));
          },
        })
    );
  }
}
