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
import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import { Router } from "@angular/router";

import {
  NgbDropdownConfig,
  NgbModal,
  NgbModalRef,
} from "@ng-bootstrap/ng-bootstrap";

import { TranslateService } from "@ngx-translate/core";

import { CommonTimeslot, DayName, WEEK_DAYS } from "@soliguide/common";

import { ToastrService } from "ngx-toastr";

import { Observable, Subscription } from "rxjs";

import { AdminPlaceService } from "../../../services/admin-place.service";
import { UploadService } from "../../../services/upload.service";

import { CurrentLanguageService } from "../../../../general/services/current-language.service";

import {
  Photo,
  Place,
  PlaceParcours,
} from "../../../../../models/place/classes";
import { DEFAULT_MODAL_OPTIONS } from "../../../../../shared";
import cloneDeep from "lodash.clonedeep";

@Component({
  selector: "app-parcours-position-form",
  templateUrl: "./parcours-position-form.component.html",
  styleUrls: ["./parcours-position-form.component.css"],
})
export class ParcoursPositionFormComponent implements OnInit, OnDestroy {
  private readonly subscription = new Subscription();
  @Input() public place!: Place;

  public openingDays: DayName[];
  public timeslots: CommonTimeslot[];
  public loading: boolean;
  public submitted: boolean;
  public success: boolean;
  public isValid: boolean;
  public placeInOrga: boolean;

  @ViewChild("invalidParcoursModal", { static: true })
  public invalidParcoursModal: TemplateRef<NgbModalRef>;

  @Output() public readonly changeToLieu = new EventEmitter<void>();

  constructor(
    private readonly adminPlaceService: AdminPlaceService,
    private readonly modalService: NgbModal,
    private readonly router: Router,
    private readonly toastr: ToastrService,
    private readonly uploadService: UploadService,
    private readonly currentLanguageService: CurrentLanguageService,
    private readonly translateService: TranslateService,
    private readonly config: NgbDropdownConfig
  ) {
    this.loading = false;
    this.submitted = false;
    this.success = false;
    this.isValid = true;
    this.openingDays = [];
    this.timeslots = [];
    this.placeInOrga = false;

    this.config.autoClose = "outside";
  }

  public ngOnInit(): void {
    if (this.place.parcours.length) {
      for (const day of WEEK_DAYS) {
        if (this.place.parcours[0].hours[day].open) {
          this.openingDays.push(day as DayName);
        }
      }
    }

    for (const point of this.place.parcours) {
      if (this.openingDays.length) {
        const day = this.openingDays[0];
        const timeslot = point.hours[day].timeslot.length
          ? point.hours[day].timeslot[0]
          : null;
        this.timeslots.push(timeslot);
      }
    }

    if (!this.timeslots.length) {
      this.timeslots.push(null);
    }

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

  public submitParcours = (): void => {
    this.submitted = true;
    this.loading = true;

    this.buildPassageHours(
      this.place.parcours,
      this.openingDays,
      this.timeslots
    );

    if (
      this.place.parcours.length === 1 &&
      !this.place.parcours[0].position.address
    ) {
      this.loading = false;
      this.isValid = false;
      this.toastr.error(
        this.translateService.instant(
          "ERROR_ITINERARY_AT_LEAST_2_POINTS_AND_ADRESSES"
        )
      );
      return;
    }

    if (
      this.place.parcours.length === 1 &&
      this.place.parcours[0].position.address
    ) {
      this.loading = false;
      this.isValid = false;
      this.modalService.open(this.invalidParcoursModal, DEFAULT_MODAL_OPTIONS);
      return;
    }

    for (const [index, point] of this.place.parcours.entries()) {
      if (!point?.position?.address) {
        this.loading = false;
        this.isValid = false;
        this.toastr.error(
          this.translateService.instant("ERROR_ITINERARY_ADDRESS_NO_I", {
            index: index + 1,
          })
        );
        break;
      } else {
        this.isValid = true;
      }
    }

    if (!this.hasOneDayOpened(this.place.parcours)) {
      this.loading = false;
      this.isValid = false;
      this.toastr.error(
        this.translateService.instant("ERROR_ITINERARY_PASSING_DAY_MISSING")
      );
      return;
    }

    if (this.isValid) {
      this.subscription.add(
        this.adminPlaceService
          .patchParcours(this.place.lieu_id, this.place.parcours)
          .subscribe({
            next: (place: Place) => {
              this.toastr.success(
                this.translateService.instant("ITINERARY_SAVE_SUCCESSFUL")
              );

              this.loading = false;
              this.success = true;

              const route = this.placeInOrga
                ? place.stepsDone.contacts
                  ? `${this.currentLanguageService.routePrefix}/manage-place/${place.lieu_id}`
                  : `${this.currentLanguageService.routePrefix}/admin-place/contacts/${place.lieu_id}`
                : place.stepsDone.publics
                ? `${this.currentLanguageService.routePrefix}/manage-place/${place.lieu_id}`
                : `${this.currentLanguageService.routePrefix}/admin-place/public/${place.lieu_id}`;

              this.router.navigate([route]);
            },
            error: () => {
              this.loading = false;
              this.success = false;
              this.toastr.error(
                this.translateService.instant("ITINERARY_CHECK_FORM_VALID")
              );
            },
          })
      );
    } else {
      this.loading = false;
      this.success = false;
      this.toastr.error(
        this.translateService.instant("ITINERARY_CHECK_FORM_VALID")
      );
    }
  };

  public newPoint = (): void => {
    this.place.parcours.forEach((_, i) => {
      this.place.parcours[i].show = false;
    });

    const lastPointIndex = this.place.parcours.length - 1;
    const pointTmp = new PlaceParcours(
      {
        position: cloneDeep(this.place.parcours[lastPointIndex].position),
      },
      true
    );

    this.place.parcours.push(pointTmp);
    this.place.parcours[lastPointIndex + 1].show = true;

    const lastTimeslotIndex = this.timeslots.length - 1;

    if (lastTimeslotIndex > -1) {
      this.timeslots.push(cloneDeep(this.timeslots[lastTimeslotIndex]));
    } else {
      this.timeslots.push(null);
    }
  };

  public hasOneDayOpened = (parcours: PlaceParcours[]): boolean => {
    // On vérifie qu'au moins un jour est ouvert
    return parcours.reduce(
      (oneDayOpened: boolean, point: PlaceParcours): boolean => {
        for (const day of WEEK_DAYS) {
          if (!oneDayOpened && point.hours[day].open) {
            oneDayOpened = true;
          }
        }
        return oneDayOpened;
      },
      false
    );
  };

  public deletePoint = (index: number): void => {
    if (this.place.parcours.length === 1) {
      this.toastr.error(
        this.translateService.instant("ERROR_ITINERARY_AT_LEAST_1_POINT")
      );
      return;
    }
    if (this.place.parcours[index].photos?.length) {
      this.place.parcours[index].photos.forEach((photo: Photo, i: number) => {
        this.subscription.add(
          this.uploadService
            .delete(photo._id, this.place.lieu_id, "photos", index)
            .subscribe(() => {
              this.place.parcours[index].photos.splice(i, 1);
              this.place.parcours.splice(index, 1);
            })
        );
      });
    } else {
      this.place.parcours.splice(index, 1);
      this.timeslots.splice(index, 1);
    }
  };

  public showPoint = (index: number): void => {
    this.place.parcours.forEach((_, i) => {
      this.place.parcours[i].show = i === index;
    });
  };

  public handleError = (hasError: boolean): void => {
    this.isValid = !hasError;
  };

  public handlePassageTimeslot = (
    timeslot: CommonTimeslot,
    index: number
  ): void => {
    this.timeslots[index] = timeslot;
  };

  public buildPassageHours = (
    parcours: PlaceParcours[],
    openingDays: DayName[],
    timeslots: CommonTimeslot[]
  ): void => {
    for (let i = 0; i < parcours.length; i++) {
      for (const day of WEEK_DAYS) {
        if (openingDays.includes(day as DayName)) {
          parcours[i].hours[day].open = true;

          if (timeslots[i]) {
            parcours[i].hours[day].timeslot = [timeslots[i]];
          } else {
            parcours[i].hours[day].timeslot.pop();
          }
        } else {
          parcours[i].hours[day].open = false;
          parcours[i].hours[day].timeslot.pop();
        }
      }
    }
  };

  // TODO: créer une directive regroupant ces deux méthodes afin de simplifier les composants y faisant appel (celui-ci et celui dans le form-place)
  public canDeactivate = (): Observable<boolean> | boolean => {
    return this.success && this.isValid;
  };

  // TODO: créer une directive regroupant les méthodes liées aux éléments que l'on peut drag and drop dans les formulaires (celui-ci et ceux des services dans les places pour le moment)
  public drop(event: CdkDragDrop<string[]>): void {
    moveItemInArray(
      this.place.parcours,
      event.previousIndex,
      event.currentIndex
    );
    moveItemInArray(this.timeslots, event.previousIndex, event.currentIndex);
  }
}
