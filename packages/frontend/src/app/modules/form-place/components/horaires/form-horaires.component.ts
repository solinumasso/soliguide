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

import {
  CAMPAIGN_DEFAULT_NAME,
  CAMPAIGN_LIST,
  WEEK_DAYS,
  AdminPlaceMenuSteps,
  DayName,
  PlaceClosedHolidays,
  CommonTimeslot,
  OpeningHoursContext,
  OpeningHours,
} from "@soliguide/common";

import { ToastrService } from "ngx-toastr";

import { Observable, Subscription } from "rxjs";

import { AdminPlaceService } from "../../services/admin-place.service";

import { CurrentLanguageService } from "../../../general/services/current-language.service";

import { User } from "../../../users/classes";

import { Place } from "../../../../models/place/classes";
import cloneDeep from "lodash.clonedeep";

import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-form-horaires",
  templateUrl: "./form-horaires.component.html",
  styleUrls: ["./form-horaires.component.css"],
})
export class FormHorairesComponent implements OnInit, OnDestroy {
  private readonly subscription = new Subscription();
  public routePrefix: string;
  public place: Place;

  public me!: User | null;

  public h24: boolean;
  public step: AdminPlaceMenuSteps;
  public loading: boolean;
  public submitted: boolean;

  public oldHours: OpeningHours;
  public tempFormHours: OpeningHours;

  public CAMPAIGN_NAME = CAMPAIGN_LIST[CAMPAIGN_DEFAULT_NAME].name;

  public PlaceClosedHolidays = PlaceClosedHolidays;

  constructor(
    private readonly titleService: Title,
    private readonly adminPlaceService: AdminPlaceService,
    private readonly route: ActivatedRoute,
    private readonly toastr: ToastrService,
    private readonly translateService: TranslateService,
    private readonly router: Router,
    private readonly currentLanguageService: CurrentLanguageService
  ) {
    this.h24 = false;
    this.loading = false;
    this.submitted = false;
    this.step = "horaires";
    this.routePrefix = this.currentLanguageService.routePrefix;
  }

  public ngOnInit(): void {
    this.subscription.add(
      this.currentLanguageService.subscribe(
        () => (this.routePrefix = this.currentLanguageService.routePrefix)
      )
    );

    this.subscription.add(
      this.translateService.onLangChange.subscribe({
        next: () => {
          this.titleService.setTitle(
            this.translateService.instant("EDIT_PLACE_HOURS", {
              placeName: this.place.name,
            })
          );
        },
      })
    );

    this.subscription.add(
      this.route.params.subscribe((params) => {
        if (params.lieu_id) {
          const id = params.lieu_id;

          this.subscription.add(
            this.adminPlaceService.getPlace(id, true).subscribe({
              next: (place: Place) => {
                this.place = place;

                this.oldHours = cloneDeep(place.newhours);
                this.tempFormHours = cloneDeep(place.newhours);

                delete this.tempFormHours.h24;
                delete this.tempFormHours.description;

                if (place.newhours.h24) {
                  WEEK_DAYS.forEach((day: DayName) => {
                    this.tempFormHours[day] = {
                      open: false,
                      timeslot: [],
                    };
                  });
                }

                this.titleService.setTitle(
                  this.translateService.instant("EDIT_PLACE_HOURS", {
                    placeName: this.place.name,
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
            })
          );
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

  public submitHoraires(): void {
    this.submitted = true;
    this.loading = true;

    this.subscription.add(
      this.adminPlaceService
        .patchHoraires(this.place.lieu_id, this.place.newhours)
        .subscribe({
          next: (place: Place) => {
            this.toastr.success(
              this.translateService.instant("HOURS_SAVED_SUCCESSFULLY")
            );

            this.loading = false;
            const route = place.stepsDone.publics
              ? `${this.currentLanguageService.routePrefix}/manage-place/${place.lieu_id}`
              : `${this.currentLanguageService.routePrefix}/admin-place/public/${place.lieu_id}`;
            this.router.navigate([route]);
          },
          error: () => {
            this.submitted = false;
            this.loading = false;
            this.toastr.error(
              this.translateService.instant("CHECK_HOURS_CONSISTENCY")
            );
          },
        })
    );
  }

  public setH24(): void {
    if (this.place.newhours.h24) {
      this.tempFormHours = cloneDeep(this.place.newhours);
      delete this.tempFormHours.h24;
      delete this.tempFormHours.description;

      WEEK_DAYS.forEach((day: DayName) => {
        this.place.newhours[day] = {
          open: true,
          timeslot: [
            new CommonTimeslot(
              { end: 2359, start: 0 },
              OpeningHoursContext.ADMIN
            ),
          ],
        };
      });
    } else {
      this.place.newhours = cloneDeep(this.tempFormHours);
    }
  }

  public canDeactivate(): Observable<boolean> | boolean {
    // insert logic to check if there are pending changes here;
    // returning true will navigate without confirmation
    // returning false will show a confirm alert before navigating away
    return (
      JSON.stringify(this.oldHours) === JSON.stringify(this.place?.newhours) ||
      this.submitted
    );
  }
}
