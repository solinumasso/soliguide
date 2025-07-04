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
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import {
  type AbstractControl,
  UntypedFormBuilder,
  UntypedFormControl,
  type UntypedFormGroup,
  type ValidationErrors,
  type ValidatorFn,
  Validators,
} from "@angular/forms";
import { Title } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";

import * as ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { ToastrService } from "ngx-toastr";
import { Subscription } from "rxjs";
import { TranslateService } from "@ngx-translate/core";

import {
  CAMPAIGN_DEFAULT_NAME,
  TEMP_INFOS_CONTEXT,
  type TempInfo,
  type ApiTempInfoResponse,
  type TempInfoContext,
  TempInfoType,
  BasePlaceTempInfo,
  type OpeningHours,
} from "@soliguide/common";
import type { PosthogProperties } from "@soliguide/common-angular";

import { FormStartAndEndDateFicheComponent } from "../../_shared/start-and-date/start-and-end-date.component";
import { AdminTempInfosService } from "../../../services/admin-temp-infos.service";
import { CampaignService } from "../../../../campaign/services/campaign.service";
import { CurrentLanguageService } from "../../../../general/services/current-language.service";

import { CK_EDITOR_CONF } from "../../../../../shared/constants/ckeditor";
import {
  endDateAfterBeginDateCheck,
  noWhiteSpace,
} from "../../../../../shared/validators";
import { regexp } from "../../../../../shared";
import { PosthogService } from "../../../../analytics/services/posthog.service";
import { Place } from "../../../../../models/place/classes";

import type { ApiError } from "../../../../../models/api";
import {
  type CampaignFormSection,
  CAMPAIGN_LIST,
} from "../../../../../models/campaign";
import cloneDeep from "lodash.clonedeep";

@Component({
  selector: "app-parent-temp-infos-form",
  templateUrl: "./parent-temp-infos-form.component.html",
  styleUrls: ["./parent-temp-infos-form.component.css"],
})
export class ParentTempInfosFormComponent implements OnInit, OnDestroy {
  private readonly subscription = new Subscription();
  // Info dedicated to update campaigns
  @Input() public place!: Place;

  @Output() public readonly placeChange = new EventEmitter<Place>();

  public routePrefix: string;
  public isCampaign!: boolean;

  public noChanges: boolean | null;

  public readonly CAMPAIGN_ADJECTIVE =
    CAMPAIGN_LIST[CAMPAIGN_DEFAULT_NAME].adjective;
  public readonly CAMPAIGN_NAME = CAMPAIGN_LIST[CAMPAIGN_DEFAULT_NAME].name;
  public readonly CAMPAIGN_PERIOD = CAMPAIGN_LIST[CAMPAIGN_DEFAULT_NAME].period;

  public readonly TempInfoType = TempInfoType;

  public tempInfos: TempInfo[];
  public tempInfosForm!: UntypedFormGroup;

  // Ckeditor
  public editor = ClassicEditor;
  public editorConfig = CK_EDITOR_CONF;

  public loading: boolean;
  public placeId!: number;
  public submitted: boolean;

  public tempInfoType!: TempInfoType;
  public tempInfoToEdit: BasePlaceTempInfo;

  public lastDateValue: string;

  public contextData!: TempInfoContext;
  public actualHours!: OpeningHours;

  public readonly TEMP_INFOS_CONTEXT = TEMP_INFOS_CONTEXT;

  @ViewChild("formStartEnd")
  public formStartEnd!: FormStartAndEndDateFicheComponent;

  constructor(
    protected readonly adminTempInfosService: AdminTempInfosService,
    protected readonly campaignService: CampaignService,
    protected readonly formBuilder: UntypedFormBuilder,
    protected readonly route: ActivatedRoute,
    protected readonly router: Router,
    protected readonly titleService: Title,
    protected readonly toastr: ToastrService,
    protected readonly currentLanguageService: CurrentLanguageService,
    protected readonly posthogService: PosthogService,
    protected readonly translateService: TranslateService
  ) {
    this.loading = false;
    this.submitted = false;
    this.tempInfos = [];
    this.isCampaign = false;
    this.lastDateValue = "";
    this.noChanges = null;
    this.place = new Place();
    this.tempInfoToEdit = new BasePlaceTempInfo();
    this.editorConfig.placeholder = "";
    this.routePrefix = this.currentLanguageService.routePrefix;
    this.posthogService = posthogService;

    this.initTempInfosForm();
  }

  public get f(): Record<string, AbstractControl> {
    return this.tempInfosForm?.controls;
  }

  public ngOnInit(): void {
    this.subscription.add(
      this.currentLanguageService.subscribe(
        () => (this.routePrefix = this.currentLanguageService.routePrefix)
      )
    );
    // Access from the campaign form
    if (this.isCampaign) {
      this.placeId = this.place.lieu_id;
    }
    // Access from the URL
    else {
      this.subscription.add(
        this.route.params.subscribe((params) => {
          this.placeId = params.lieu_id;
          const tempInfoTypeFromUrl = params.tempInfoType;
          if (
            tempInfoTypeFromUrl !== TempInfoType.MESSAGE &&
            tempInfoTypeFromUrl !== TempInfoType.HOURS &&
            tempInfoTypeFromUrl !== TempInfoType.CLOSURE
          ) {
            this.router.navigate([
              this.currentLanguageService.routePrefix,
              "404",
            ]);
            return;
          }
          this.tempInfoType = tempInfoTypeFromUrl;
        })
      );
    }

    this.contextData = TEMP_INFOS_CONTEXT[this.tempInfoType];

    this.editorConfig.placeholder = this.contextData.descriptionPlaceHolder
      ? this.translateService.instant(this.contextData.descriptionPlaceHolder)
      : "";

    this.subscription.add(
      this.adminTempInfosService
        .getTempInfos(this.placeId, this.tempInfoType)
        .subscribe({
          next: (apiResponse: ApiTempInfoResponse) => {
            this.tempInfos = apiResponse.tempInfo;

            this.place = new Place(apiResponse.place, true);
            this.initTempInfosForm();
            this.setTitle();
          },
          error: () => {
            this.toastr.error(this.translateService.instant("ERROR_OCCURRED"));
          },
        })
    );
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private setTitle() {
    if (!this.isCampaign) {
      let title = this.translateService.instant(this.contextData.planTitle);
      if (this.tempInfos?.length > 0) {
        title = this.translateService.instant(
          this.contextData.planTitleWithPlace,
          {
            placeName: this.tempInfos[0]?.place.name,
          }
        );
      }
      this.titleService.setTitle(title);
    }
  }

  public initTempInfosForm = (tempInfo?: TempInfo): void => {
    this.submitted = false;

    this.tempInfoToEdit = new BasePlaceTempInfo(tempInfo, true);

    // For a creation, we add place data
    if (this.tempInfoType === TempInfoType.HOURS) {
      this.actualHours = cloneDeep(this.place.newhours);

      // If no timetables defined, we take those of the place
      if (!tempInfo?.hours) {
        this.tempInfoToEdit.hours = cloneDeep(this.actualHours);
      }
    }

    this.tempInfosForm = this.formBuilder.group(
      {
        _id: new UntypedFormControl(this.tempInfoToEdit._id, []),
        name: [
          this.tempInfoToEdit.name,
          this.tempInfoType === TempInfoType.MESSAGE
            ? [Validators.required, noWhiteSpace]
            : [],
        ],
        description: new UntypedFormControl(
          this.tempInfoToEdit.description,
          (this.isCampaign && this.tempInfoType === TempInfoType.MESSAGE) ||
          (!this.isCampaign && this.tempInfoType !== TempInfoType.HOURS)
            ? [
                Validators.required,
                Validators.minLength(2),
                this.descriptionValidator,
              ]
            : []
        ),
        hours: new UntypedFormControl(
          this.tempInfoToEdit.hours,
          this.tempInfoType !== TempInfoType.HOURS ? [] : [Validators.required]
        ),
        dateDebut: new UntypedFormControl(this.tempInfoToEdit.dateDebut, [
          Validators.required,
        ]),
        dateFin: new UntypedFormControl(this.tempInfoToEdit.dateFin, []),
        isCampaign: new UntypedFormControl(this.isCampaign, [
          Validators.required,
        ]),
      },
      {
        validators: [this.checkTempInfosInterval],
      }
    );

    if (this.formStartEnd) {
      this.formStartEnd.refreshDates(
        this.tempInfoToEdit.dateDebut,
        this.tempInfoToEdit.dateFin
      );
    }

    window.scroll({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  };

  public descriptionValidator(
    control: AbstractControl
  ): { [key: string]: boolean } | null {
    if (
      control.value != null // !null and !undefined
    ) {
      const description = control.value.replace(regexp.htmlTag, "").trim();
      if (description.length < 5) {
        return { minLength: true };
      } else if (description.length > 4000) {
        return { maxLength: true };
      }
    }
    return null;
  }

  private keepTypingAfterDeletion() {
    this.tempInfosForm?.get("dateDebut")?.updateValueAndValidity();
    this.tempInfosForm?.get("dateFin")?.updateValueAndValidity();
  }

  public deleteTempInfo = (tempInfo: TempInfo): void => {
    this.loading = true;
    this.subscription.add(
      this.adminTempInfosService
        .deleteOneTempInfo(this.placeId, tempInfo._id, this.tempInfoType)
        .subscribe({
          next: (apiResponse: ApiTempInfoResponse) => {
            this.tempInfos = apiResponse.tempInfo;
            this.keepTypingAfterDeletion();
            this.loading = false;
            this.submitted = false;
            this.toastr.success(
              this.translateService.instant("DELETION_COMPLETED_SUCCESSFULLY")
            );
          },

          error: () => {
            this.loading = false;
            this.toastr.error(
              this.translateService.instant("DELETION_COULD_NOT_BE_COMPLETED")
            );
          },
        })
    );
  };

  public saveTempInfosForCampaign = (section: CampaignFormSection): void => {
    this.submitted = true;

    if (this.noChanges === true) {
      this.captureEvent("click-save", {
        changes: false,
      });
      this.loading = true;

      this.subscription.add(
        this.campaignService
          .setNoChangeForSection(this.place.lieu_id, section)
          .subscribe({
            next: (place: Place) => {
              this.toastr.success(
                this.translateService.instant("INFORMATION_SAVED_SUCCESSFULLY")
              );
              this.place = place;
              this.placeChange.emit(this.place);
              this.loading = false;
              this.submitted = false;
            },
            error: () => {
              this.loading = false;
              this.toastr.error(
                this.translateService.instant("PLEASE_CHECK_FORM_FIELDS")
              );
            },
          })
      );
    } else if (this.noChanges === false) {
      if (this.tempInfosForm.invalid) {
        this.captureEvent("click-save-with-invalid-form", {
          changes: true,
        });

        this.toastr.error(
          this.translateService.instant("PLEASE_CHECK_FORM_FIELDS")
        );
        return;
      } else if (
        this.tempInfoType === TempInfoType.HOURS &&
        this.checkHoursChanged()
      ) {
        this.captureEvent("click-save-with-invalid-form", {
          changes: true,
        });
        this.toastr.error(this.translateService.instant("NO_HOURS_CHANGED"));
        return;
      }

      this.captureEvent("click-save", {
        changes: true,
        formValue: this.tempInfosForm.value,
      });

      this.loading = true;

      this.subscription.add(
        this.adminTempInfosService
          .patchTempInfo(
            this.placeId,
            this.tempInfosForm.value as BasePlaceTempInfo,
            this.tempInfoType
          )
          .subscribe({
            next: (response: ApiTempInfoResponse) => {
              this.tempInfos = response.tempInfo;
              this.place = new Place(response.place, true);
              this.placeChange.emit(this.place);
              this.tempInfosForm.reset();
              this.toastr.success(
                this.translateService.instant("SUCCESSFUL_ADDITION")
              );
              this.loading = false;
              this.submitted = false;
            },
            error: (e: ApiError) => {
              this.loading = false;
              this.checkDateOverLapping(e);
              this.toastr.error(
                this.translateService.instant("PLEASE_CHECK_FORM_FIELDS")
              );
            },
          })
      );
    } else {
      this.loading = false;
    }
  };

  public saveTempInfos = (): void => {
    this.submitted = true;

    if (this.tempInfosForm.invalid) {
      this.captureEvent("click-save-with-invalid-form", {
        changes: true,
      });

      this.toastr.error(
        this.translateService.instant("PLEASE_CHECK_FORM_FIELDS")
      );
      return;
    } else if (
      this.tempInfoType === TempInfoType.HOURS &&
      this.checkHoursChanged()
    ) {
      this.captureEvent("click-save-with-invalid-form", {
        changes: true,
      });

      this.toastr.error(this.translateService.instant("NO_HOURS_CHANGED"));
      return;
    }

    this.captureEvent("click-save", {
      changes: true,
      formValue: this.tempInfosForm.value,
    });

    this.loading = true;

    this.subscription.add(
      this.adminTempInfosService
        .patchTempInfo(
          this.placeId,
          this.tempInfosForm.value as BasePlaceTempInfo,
          this.tempInfoType
        )
        .subscribe({
          next: (response: ApiTempInfoResponse) => {
            this.tempInfos = response.tempInfo;
            this.place = new Place(response.place, true);

            this.tempInfosForm.reset();
            this.initTempInfosForm();

            this.toastr.success(
              this.translateService.instant("SUCCESSFUL_ADDITION")
            );
            this.loading = false;
            this.submitted = false;
          },
          error: (e: ApiError) => {
            this.checkDateOverLapping(e);
            this.loading = false;
            this.toastr.error(
              this.translateService.instant("PLEASE_CHECK_FORM_FIELDS")
            );
          },
        })
    );
  };

  private checkDateOverLapping(e: ApiError) {
    for (const errorMessage of e.error) {
      if (errorMessage.msg === "TEMP_INFOS_DATE_OVERLAPPING") {
        this.tempInfosForm.controls?.dateDebut.setErrors({
          dateOverlapping: true,
        });
        this.tempInfosForm.controls?.dateFin.setErrors({
          dateOverlapping: true,
        });
      }
    }
  }

  private readonly checkHoursChanged = (): boolean => {
    if (
      JSON.stringify({ ...this.actualHours }) ===
      JSON.stringify({ ...this.tempInfosForm.controls.hours.value })
    ) {
      return true;
    }
    return false;
  };

  public checkTempInfosInterval: ValidatorFn = (
    control: AbstractControl
  ): ValidationErrors | null => {
    if (!this.tempInfosForm) {
      return null;
    }

    const isValidInterval = endDateAfterBeginDateCheck(
      control.get("dateDebut"),
      control.get("dateFin")
    );

    if (isValidInterval !== null) {
      return isValidInterval;
    }

    const _id: string = control.get("_id")?.value;
    const dateDebut: Date = control.get("dateDebut")?.value as Date;
    const dateFin: Date = control.get("dateFin")?.value as Date;

    if (
      JSON.stringify({
        _id,
        dateDebut,
        dateFin,
      }) !== this.lastDateValue &&
      dateDebut
    ) {
      this.lastDateValue = JSON.stringify({
        _id,
        dateDebut,
        dateFin,
      });

      this.subscription.add(
        this.adminTempInfosService
          .checkTempInfosInterval(
            this.placeId,
            {
              _id,
              dateDebut,
              dateFin,
            },
            this.tempInfoType
          )
          .subscribe({
            next: (isOk: boolean) => {
              if (!isOk) {
                this.tempInfosForm.controls?.dateDebut.setErrors({
                  dateOverlapping: true,
                });
                this.tempInfosForm.controls?.dateFin.setErrors({
                  dateOverlapping: true,
                });
              } else {
                this.tempInfosForm.controls?.dateDebut.setErrors(null);
                this.tempInfosForm.controls?.dateFin.setErrors(null);
              }
            },
            error: () => {
              this.toastr.error(
                this.translateService.instant("ERROR_OCCURRED")
              );
            },
          })
      );
    }
    return null;
  };

  public captureEvent(eventName: string, properties?: PosthogProperties): void {
    this.posthogService.capture(
      `temp-infos-form-${this.tempInfoType}-${eventName}`,
      {
        ...properties,
        campaign: this.isCampaign ? CAMPAIGN_DEFAULT_NAME : null,
        campaignIsActive: this.isCampaign,
        placeId: this.place.lieu_id,
      }
    );
  }
}
