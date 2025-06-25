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
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";

import {
  CAMPAIGN_DEFAULT_NAME,
  getCategoriesSpecificFields,
  type Categories,
  BasePlaceTempInfo,
} from "@soliguide/common";
import type { PosthogProperties } from "@soliguide/common-angular";

import { CampaignService } from "../../services/campaign.service";

import { AdminTempInfosService } from "../../../form-place/services/admin-temp-infos.service";

import { DateValidatorService } from "../../../shared/services/date-validator.service";

import { CAMPAIGN_LIST } from "../../../../models/campaign/constants";
import type { Place, Service } from "../../../../models/place/classes";
import { PosthogService } from "../../../analytics/services/posthog.service";
import {
  CATEGORIES_SPECIFIC_FIELDS_FIELD_TYPE,
  THEME_CONFIGURATION,
} from "../../../../models";

@Component({
  selector: "app-campaign-form-services",
  templateUrl: "./campaign-form-services.component.html",
  styleUrls: ["./campaign-form-services.component.css"],
})
export class CampaignFormServicesComponent implements OnInit {
  @Input() public place!: Place;

  @Output() public readonly updatePlace = new EventEmitter<Place>();

  public submitted: boolean;
  public noChanges: boolean;

  public loading: boolean;

  public closeServiceForm: {
    serviceObjectId: string;
    categorySpecificFields?: string;
    category: Categories;
    close: BasePlaceTempInfo;
  }[];

  public readonly CAMPAIGN_NAME = CAMPAIGN_LIST[CAMPAIGN_DEFAULT_NAME].name;
  public readonly CAMPAIGN_PERIOD = CAMPAIGN_LIST[CAMPAIGN_DEFAULT_NAME].period;
  public readonly CATEGORIES_SPECIFIC_FIELDS_CATEGORY_MAPPING =
    getCategoriesSpecificFields(THEME_CONFIGURATION.country);

  constructor(
    private readonly adminTempInfosService: AdminTempInfosService,
    private readonly campaignService: CampaignService,
    private readonly dateValidatorService: DateValidatorService,
    private readonly toastr: ToastrService,
    private readonly translateService: TranslateService,
    protected readonly posthogService: PosthogService
  ) {
    this.loading = false;
    this.noChanges = null;
    this.submitted = false;
    this.closeServiceForm = [];
  }

  public ngOnInit(): void {
    this.noChanges = this.place.campaigns.runningCampaign.sections.services.date
      ? !this.place.campaigns.runningCampaign.sections.services.changes // Attention si changes true alors noChanges false
      : null;

    this.closeServiceForm = this.place.services_all.map((service: Service) => {
      return {
        serviceObjectId: service.serviceObjectId,
        categorySpecificFields:
          this.generateCategorySpecificFieldsDisplay(service),
        category: service.category,
        close:
          service.close.actif || service.close.serviceActif
            ? { ...service.close, actif: service.close.serviceActif }
            : new BasePlaceTempInfo(),
      };
    });
  }

  public submitTempService(): void {
    this.loading = true;
    this.submitted = true;

    if (this.noChanges === true) {
      this.captureEvent("click-save", { changes: false });

      this.campaignService
        .setNoChangeForSection(this.place.lieu_id, "services")
        .subscribe({
          next: (place: Place) => {
            this.toastr.success(
              this.translateService.instant("INFORMATION_SAVED_SUCCESSFULLY")
            );
            this.place = place;
            this.updatePlace.emit(this.place);
            this.loading = false;
            this.submitted = false;
          },
          error: () => {
            this.loading = false;
            this.toastr.error(
              this.translateService.instant("PLEASE_CHECK_FORM_FIELDS")
            );
          },
        });
    } else if (this.noChanges === false) {
      this.closeServiceForm.forEach((service) => {
        if (
          service.close.actif &&
          !this.dateValidatorService.validDate(
            service.close.dateDebut,
            service.close.dateFin,
            false,
            false
          )
        ) {
          this.loading = false;
        }
      });

      if (this.loading) {
        const placeClosedServices: BasePlaceTempInfo[] =
          this.closeServiceForm.map((service) => {
            const newService = new BasePlaceTempInfo({
              actif: service.close.actif,
              dateDebut: new Date(service.close.dateDebut),
              dateFin: service.close.dateFin
                ? new Date(service.close.dateFin)
                : null,
              serviceObjectId: service.serviceObjectId,
              isCampaign: true,
            });

            newService.actif = newService.serviceActif;

            if (newService.serviceActif === false) {
              newService.dateDebut = null;
              newService.dateFin = null;
            }

            return newService;
          });

        this.captureEvent("click-save", { changes: true, placeClosedServices });

        this.adminTempInfosService
          .patchServicesClosed(this.place.lieu_id, placeClosedServices)
          .subscribe({
            next: (place: Place) => {
              this.toastr.success(
                this.translateService.instant("SUCCESSFUL_ADDITION")
              );
              this.place = place;
              this.updatePlace.emit(this.place);
              this.loading = false;
              this.submitted = false;
            },
            error: () => {
              this.loading = false;
              this.toastr.error(
                this.translateService.instant("SERVICES_CLOSURE_UNABLE_TO_SAVE")
              );
            },
          });
      } else {
        this.captureEvent("click-save-with-invalid-form", { changes: true });
      }
    } else {
      this.loading = false;
      this.toastr.error(
        this.translateService.instant("INDICATE_SERVICE_CLOSURES_CAMPAIGN")
      );
    }
  }

  private generateCategorySpecificFieldsDisplay = (service: Service) => {
    return this.CATEGORIES_SPECIFIC_FIELDS_CATEGORY_MAPPING[service.category]
      ? this.CATEGORIES_SPECIFIC_FIELDS_CATEGORY_MAPPING[service.category]
          .filter(
            (categorySpecificField) =>
              service.categorySpecificFields[categorySpecificField]
          )
          .map((categorySpecificField) =>
            CATEGORIES_SPECIFIC_FIELDS_FIELD_TYPE.enumType.includes(
              categorySpecificField
            )
              ? this.translateService.instant(
                  service.categorySpecificFields[
                    categorySpecificField
                  ].toUpperCase()
                )
              : CATEGORIES_SPECIFIC_FIELDS_FIELD_TYPE.checklist.includes(
                  categorySpecificField
                )
              ? service.categorySpecificFields[categorySpecificField]
                  .map((value) =>
                    this.translateService.instant(value.toUpperCase())
                  )
                  .join(", ")
              : service.categorySpecificFields[categorySpecificField]
          )
          .filter((categorySpecificFieldValue) => categorySpecificFieldValue)
          .join(" - ")
      : "";
  };

  private captureEvent(
    eventName: string,
    properties?: PosthogProperties
  ): void {
    this.posthogService.capture(`campaign-service-temp-closure-${eventName}`, {
      ...properties,
      campaign: CAMPAIGN_DEFAULT_NAME,
      campaignIsActive: true,
      placeId: this.place.lieu_id,
    });
  }
}
