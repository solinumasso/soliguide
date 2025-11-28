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
  ViewChild,
  TemplateRef,
} from "@angular/core";
import { Title } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";
import { DEFAULT_MODAL_OPTIONS } from "./../../../../shared/constants/DEFAULT_MODAL_OPTIONS.const";

import {
  AdminPlaceMenuSteps,
  DietaryRegimesType,
  PlaceType,
  WelcomedPublics,
  publicsValuesAreCoherent,
} from "@soliguide/common";

import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";

import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";

import { Observable, Subscription } from "rxjs";

import { AdminPlaceService } from "../../services/admin-place.service";

import { CurrentLanguageService } from "../../../general/services/current-language.service";

import { User } from "../../../users/classes";

import { ApiError } from "../../../../models/api/interfaces";
import { Place, Service } from "../../../../models/place/classes";
import { DateValidatorService } from "../../../shared/services/date-validator.service";

import { PUBLICS_KEYS_ERRORS } from "../../../../models";

@Component({
  selector: "app-form-services",
  templateUrl: "./form-services.component.html",
  styleUrls: ["./form-services.component.css"],
})
export class FormServicesComponent implements OnInit, OnDestroy {
  @ViewChild("falsyUnconditionalPublic", { static: true })
  public falsyUnconditionalPublic!: TemplateRef<NgbModalRef>;
  private readonly subscription = new Subscription();
  public routePrefix: string;
  public place: Place;
  public me!: User | null;
  public loading: boolean;
  public submitted: boolean;
  public isDescriptionInvalid: boolean;

  public oldService: Partial<Service[]>;

  public step: AdminPlaceMenuSteps;

  public typeError: string[];

  public idWarningServicePublic: number[];

  public servicesWithoutCategory: number[] = [];

  public typeErrorForm: {
    error: string;
    serviceIndex: number;
    location: "publics" | "modalities" | "hours" | "description" | "service";
  }[];

  constructor(
    private readonly titleService: Title,
    private readonly adminPlaceService: AdminPlaceService,
    private readonly route: ActivatedRoute,
    private readonly toastr: ToastrService,
    private readonly router: Router,
    private readonly modalService: NgbModal,
    private readonly dateValidatorService: DateValidatorService,
    private readonly currentLanguageService: CurrentLanguageService,
    private readonly translateService: TranslateService
  ) {
    this.step = "services";
    this.loading = false;
    this.submitted = false;
    this.isDescriptionInvalid = false;
    this.typeError = [];
    this.typeErrorForm = [];
    this.routePrefix = this.currentLanguageService.routePrefix;
    this.idWarningServicePublic = [];
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
          this.subscription.add(
            this.adminPlaceService.getPlace(id, true).subscribe({
              next: (place: Place) => {
                this.place = place;
                this.titleService.setTitle(
                  this.translateService.instant("EDITING_SERVICES_OF", {
                    placeName: this.place.name,
                  })
                );

                this.oldService = JSON.parse(
                  JSON.stringify(place.services_all)
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

  public chooseUnconditionalPublic = (change: boolean): void => {
    if (change) {
      this.idWarningServicePublic.forEach((id: number) => {
        this.place.services_all[id - 1].publics.accueil =
          WelcomedPublics.UNCONDITIONAL;
      });
      this.submitServices();
    } else {
      this.loading = false;
    }

    this.modalService.dismissAll();
  };

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public descriptionHasError(isInvalid: boolean): void {
    this.isDescriptionInvalid = isInvalid;
  }

  public submitServices(): void {
    this.loading = true;
    this.submitted = true;
    this.typeError = [];
    this.servicesWithoutCategory = [];

    if (this.isPublicInvalid()) {
      this.modalService.open(this.falsyUnconditionalPublic, {
        size: "lg",
        ...DEFAULT_MODAL_OPTIONS,
      });
      this.loading = false;
      return;
    }

    for (let i = 0; i < this.place.services_all.length; i++) {
      const service = this.place.services_all[i];

      service.close.actif = service.close.serviceActif;

      if (!service.category) {
        this.servicesWithoutCategory.push(i + 1);
      }

      if (
        service.categorySpecificFields?.dietaryRegimesType &&
        service.categorySpecificFields.dietaryRegimesType ===
          DietaryRegimesType.WE_ADAPT &&
        service.categorySpecificFields.dietaryAdaptationsType.length === 0
      ) {
        this.toastr.error(
          this.translateService.instant("DIETARY_ADAPTATIONS_PRECISIONS")
        );
        this.loading = false;
      }

      if (
        service.close.actif &&
        !this.dateValidatorService.validDate(
          service.close.dateDebut,
          service.close.dateFin,
          false,
          false
        )
      ) {
        this.toastr.error(
          this.translateService.instant(
            "THE_DATES_FOR_SERVICE_CLOSURE_CONTAIN_ERRORS",
            { number: i + 1 }
          )
        );
        this.loading = false;
      }
    }

    if (this.servicesWithoutCategory.length > 0) {
      this.servicesWithoutCategory.forEach((serviceNumber) => {
        this.toastr.error(
          this.translateService.instant("CHOOSE_CATEGORY_FOR_SERVICE", {
            number: serviceNumber,
          })
        );
      });
      this.loading = false;
      return;
    }

    this.subscription.add(
      this.adminPlaceService
        .patchServices(this.place.lieu_id, this.place.services_all)
        .subscribe({
          next: (place: Place) => {
            this.toastr.success(
              this.translateService.instant("SAVE_SERVICES_SUCCESS")
            );
            this.loading = false;
            const route =
              !place.stepsDone.photos && place.placeType === PlaceType.PLACE
                ? `${this.currentLanguageService.routePrefix}/admin-place/photos/${place.lieu_id}`
                : `${this.currentLanguageService.routePrefix}/manage-place/${place.lieu_id}`;
            this.router.navigate([route]);
          },
          error: (e: ApiError) => {
            if (e.status && e.status === 400) {
              this.loading = false;
              this.typeErrorForm = [];
              this.displayServicesErrors(e);
            } else {
              this.loading = false;
              this.toastr.error(
                this.translateService.instant("UNEXPECTED_ERROR")
              );
            }
          },
        })
    );
  }

  private isPublicInvalid(): boolean {
    return this.place.services_all.some((service: Service, i: number) => {
      let incorrectPublic = false;
      if (!publicsValuesAreCoherent(service.publics)) {
        incorrectPublic = true;
        this.idWarningServicePublic.push(i + 1);
      }

      return incorrectPublic;
    });
  }

  public canDeactivate(): Observable<boolean> | boolean {
    // insert logic to check if there are pending changes here;
    // returning true will navigate without confirmation
    // returning false will show a confirm alert before navigating away
    return (
      JSON.stringify(this.oldService) ===
        JSON.stringify(this.place?.services_all) || this.submitted
    );
  }

  public displayServicesErrors(e: ApiError): void {
    for (const errorMessage of e.error) {
      const badServiceIndex = /\d+/.exec(errorMessage.path);
      this.typeErrorForm.push({
        error: errorMessage.msg,
        serviceIndex:
          badServiceIndex !== null ? parseInt(badServiceIndex[0]) + 1 : null,
        location: errorMessage.path.includes("publics")
          ? "publics"
          : errorMessage.path.includes("modalities")
          ? "modalities"
          : errorMessage.path.includes("hours")
          ? "hours"
          : errorMessage.path.includes("description")
          ? "description"
          : "service",
      });
    }

    for (const element of this.typeErrorForm) {
      let message = "";
      if (element.location === "publics") {
        if (
          !this.place.services_all[element.serviceIndex - 1].differentPublics
        ) {
          message = this.translateService.instant("ERROR_PUBLICS_IN_PLACE");
        } else if (PUBLICS_KEYS_ERRORS.includes(element.error)) {
          message = this.translateService.instant(element.error);
        } else {
          message = this.translateService.instant(
            "ERROR_OCCURRED_EDITING_PUBLICS"
          );
        }
      } else if (element.location === "modalities") {
        if (
          !this.place.services_all[element.serviceIndex - 1].differentModalities
        ) {
          message = this.translateService.instant("ERROR_ACCESS_CONDITIONS");
        } else {
          message = this.translateService.instant(
            "ERROR_OCCURRED_ACCESS_CONDITIONS"
          );
        }
      } else if (element.location === "hours") {
        if (!this.place.services_all[element.serviceIndex - 1].differentHours) {
          message = this.translateService.instant("ERROR_HOURS");
        } else {
          message = this.translateService.instant("ERROR_OCCURRED_HOURS");
        }
      } else if (element.location === "description") {
        message = this.translateService.instant("CHECK_DESCRIPTION");
      } else {
        message = this.translateService.instant("ERROR_OCCURRED");
      }

      message =
        element.serviceIndex === null || message.includes("structure")
          ? message
          : `${message} ${this.translateService.instant("IN_SERVICE")} ${
              element.serviceIndex
            }`;

      this.toastr.error(message);
    }
  }
}
