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
import { ActivatedRoute, Params, Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { EMPTY, Subscription, switchMap, tap } from "rxjs";

import { PlaceType, isOneDayOpen } from "@soliguide/common";

import { SoligareSearchService } from "../../services/soligare-search.service";
import { CurrentLanguageService } from "../../../general/services/current-language.service";
import { Place, MarkerOptions } from "../../../../models";

@Component({
  selector: "app-soligare-preview",
  templateUrl: "./soligare-preview.component.html",
})
export class SoligarePreviewComponent implements OnInit, OnDestroy {
  public sourceId: string;
  public sourcePlace: Place;
  private routePrefix: string;

  public marker: MarkerOptions[];

  public placeType = PlaceType.PLACE;

  private readonly subscription = new Subscription();

  constructor(
    private readonly router: Router,
    private readonly soligareSearchService: SoligareSearchService,
    private readonly currentLanguageService: CurrentLanguageService,
    private readonly translateService: TranslateService,
    private readonly toastr: ToastrService,
    private readonly activatedRoute: ActivatedRoute
  ) {
    this.marker = [];

    this.routePrefix = this.currentLanguageService.routePrefix;
  }

  ngOnInit(): void {
    this.subscription.add(
      this.activatedRoute.params
        .pipe(
          tap((params: Params) => {
            this.sourceId = params?.source_id;
          }),
          switchMap(() => {
            if (!this.sourceId) {
              this.router.navigate([this.routePrefix, "404"]);
              return EMPTY;
            }
            return this.soligareSearchService.getExternalStructure(
              this.sourceId
            );
          })
        )
        .subscribe({
          next: (place: Place) => {
            this.sourcePlace = place;
            this.sourcePlace.newhours.isOpeningHoursSet = isOneDayOpen(
              place.newhours
            );
            setTimeout(() => {}, 10000);
            this.initMarker(this.sourcePlace);
          },
          error: () => {
            this.toastr.warning(
              this.translateService.instant("SEARCH_EXTERNAL_STRUCTURE_FAILED")
            );
            this.router.navigate([this.routePrefix, "404"]);
          },
        })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private initMarker(sourcePlace: Place): void {
    this.marker = [
      {
        lng: sourcePlace.position.location.coordinates[0],
        lat: sourcePlace.position.location.coordinates[1],
        options: {
          id: 1,
          title: this.translateService.instant("DOT_ON_MAP"),
          icon: {
            url: "../../../../../assets/images/maps/new_pin.svg",
            scaledSize: {
              width: 32,
              height: 44,
            },
          },
        },
      },
    ];
  }
}
