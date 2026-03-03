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
import { Component, OnDestroy, OnInit } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";

import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

import { TranslateService } from "@ngx-translate/core";

import { PlaceType } from "@soliguide/common";

import { Subscription } from "rxjs";

import { AdminPlaceService } from "../../services/admin-place.service";
import { UploadService } from "../../services/upload.service";

import { CurrentLanguageService } from "../../../general/services/current-language.service";

import { Photo, Place } from "../../../../models/place/classes";

@Component({
  selector: "app-place-position-form",
  templateUrl: "./place-emplacement-form.component.html",
  styleUrls: [
    "./place-emplacement-form.component.css",
    "../../styles/shared-form-place.css",
  ],
})
export class PlaceEmplacementFormComponent implements OnInit, OnDestroy {
  private readonly subscription = new Subscription();
  public routePrefix: string;
  public loading: boolean;
  public place!: Place;
  public readonly PlaceType = PlaceType;

  constructor(
    private readonly adminPlaceService: AdminPlaceService,
    private readonly modalService: NgbModal,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly titleService: Title,
    private readonly uploadService: UploadService,
    private readonly currentLanguageService: CurrentLanguageService,
    private readonly translateService: TranslateService
  ) {
    this.loading = false;
    this.routePrefix = this.currentLanguageService.routePrefix;
  }

  public ngOnInit(): void {
    this.subscription.add(
      this.currentLanguageService.subscribe(
        () => (this.routePrefix = this.currentLanguageService.routePrefix)
      )
    );
    this.subscription.add(
      this.route.params.subscribe((params) => {
        if (params.lieu_id) {
          const id = params.lieu_id;
          this.adminPlaceService.getPlace(id, true).subscribe({
            next: (place: Place) => {
              this.place = place;
              this.convertTypeIfNeeded();
              this.titleService.setTitle(
                this.translateService.instant("PLACE_NAME_LOCATION", {
                  placeName: place.name,
                })
              );
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

  private convertTypeIfNeeded(): void {
    if (
      this.place.placeType === PlaceType.PLACE &&
      this.place.parcours.length > 0
    ) {
      // User switched PARCOURS→LIEU in step 1: promote first waypoint to position
      this.place.position = JSON.parse(
        JSON.stringify(this.place.parcours[0].position)
      );
      this.place.parcours = [];
    }
    // LIEU→PARCOURS is handled by parcours-position-form initialising
    // the first waypoint from place.position when parcours is empty
  }

  public eraseParcours = (): void => {
    for (let i = 0; i < this.place.parcours.length; i++) {
      const point = this.place.parcours[i];
      point.photos.forEach((photo: Photo, index: number) => {
        this.subscription.add(
          this.uploadService
            .delete(photo._id, this.place.lieu_id, "photos", i)
            .subscribe(() => {
              point.photos.splice(index, 1);
            })
        );
      });
    }

    if (this.place.parcours.length) {
      this.place.position = JSON.parse(
        JSON.stringify(this.place.parcours[0].position)
      );
    }

    this.place.parcours = [];
    this.place.placeType = PlaceType.PLACE;
    this.modalService.dismissAll();
  };

  public handleParcoursToLieu = (): void => {
    this.place.placeType = PlaceType.PLACE;
    this.eraseParcours();
  };
}
