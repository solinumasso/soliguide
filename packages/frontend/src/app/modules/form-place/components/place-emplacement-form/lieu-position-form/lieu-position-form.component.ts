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

import { SupportedLanguagesCode } from "@soliguide/common";

import { ToastrService } from "ngx-toastr";

import { Observable, Subscription } from "rxjs";

import { AdminPlaceService } from "../../../services/admin-place.service";

import { CurrentLanguageService } from "../../../../general/services/current-language.service";

import { Place, PlacePosition } from "../../../../../models";

@Component({
  selector: "app-lieu-position-form",
  templateUrl: "./lieu-position-form.component.html",
  styleUrls: ["./lieu-position-form.component.css"],
})
export class LieuPositionFormComponent implements OnInit, OnDestroy {
  private readonly subscription = new Subscription();
  public currentLanguage: SupportedLanguagesCode;
  @Input() public place!: Place;

  private isInvalid: boolean;
  private isDirty: boolean;
  public submitted: boolean;
  public loading: boolean;
  public success: boolean;
  public placeInOrga: boolean;

  public duplicates: boolean;
  public duplicatedPlaces: Place[];

  constructor(
    private readonly adminPlaceService: AdminPlaceService,
    private readonly router: Router,
    private readonly toastr: ToastrService,
    private readonly currentLanguageService: CurrentLanguageService,
    private readonly translateService: TranslateService
  ) {
    this.isInvalid = false;
    this.isDirty = false;
    this.submitted = false;
    this.loading = false;
    this.success = false;
    this.placeInOrga = false;

    this.duplicates = false;
    this.duplicatedPlaces = [];
    this.currentLanguage = this.currentLanguageService.currentLanguage;
  }

  public ngOnInit(): void {
    this.subscription.add(
      this.currentLanguageService.subscribe(
        (language) => (this.currentLanguage = language)
      )
    );
    this.subscription.add(
      this.adminPlaceService
        .checkInOrga(this.place.lieu_id)
        .subscribe((value: boolean) => {
          this.placeInOrga = value;
        })
    );
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public checkDuplicates(position: PlacePosition): void {
    this.place.position = position;

    this.subscription.add(
      this.adminPlaceService
        .checkDuplicates(this.place.lieu_id, position)
        .subscribe((places: Place[]) => {
          this.duplicates = places.length >= 1;
          this.duplicatedPlaces = places;
        })
    );
  }

  public isAddressInvalid(isInvalid: boolean): void {
    this.isInvalid = isInvalid;
    this.isDirty = true;
  }

  public submitPosition(): void {
    this.submitted = true;

    if (this.isInvalid) {
      this.toastr.error(this.translateService.instant("INCORRECT_FIELDS"));
    } else {
      this.loading = true;

      const positionData = new PlacePosition(this.place.position);

      this.subscription.add(
        this.adminPlaceService
          .patchPosition(this.place.lieu_id, positionData)
          .subscribe({
            next: (place: Place) => {
              this.toastr.success(
                this.translateService.instant("SUCCESSFUL_ADDITION")
              );
              this.loading = false;
              this.success = true;

              const route = this.placeInOrga
                ? place.stepsDone.contacts
                  ? `${this.currentLanguageService.routePrefix}/manage-place/${place.lieu_id}`
                  : `${this.currentLanguageService.routePrefix}/admin-place/contacts/${place.lieu_id}`
                : place.stepsDone.horaires
                ? `${this.currentLanguageService.routePrefix}/manage-place/${place.lieu_id}`
                : `${this.currentLanguageService.routePrefix}/admin-place/horaires/${place.lieu_id}`;

              this.router.navigate([route]);
            },
            error: () => {
              this.toastr.error(
                this.translateService.instant("POSITION_UPDATE_FAIL")
              );
              this.loading = false;
            },
          })
      );
    }
  }

  public canDeactivate(): Observable<boolean> | boolean {
    // insert logic to check if there are pending changes here;
    // returning true will navigate without confirmation
    // returning false will show a confirm alert before navigating away
    return !this.isDirty || this.success;
  }
}
