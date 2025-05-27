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
import { Component, OnDestroy, OnInit, SecurityContext } from "@angular/core";
import {
  UntypedFormGroup,
  UntypedFormBuilder,
  Validators,
  AbstractControl,
  UntypedFormArray,
} from "@angular/forms";
import { DomSanitizer, Title } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";

import { ChangeEvent } from "@ckeditor/ckeditor5-angular/ckeditor.component";
import * as ClassicEditor from "@ckeditor/ckeditor5-build-classic";

import { AdminPlaceMenuSteps, Phone, REGEXP } from "@soliguide/common";

import { ToastrService } from "ngx-toastr";

import { Observable, Subscription } from "rxjs";

import { AdminPlaceService } from "../../services/admin-place.service";
import { CurrentLanguageService } from "../../../general/services/current-language.service";

import { User } from "../../../users/classes";
import { Place, THEME_CONFIGURATION } from "../../../../models";
import { CK_EDITOR_CONF, regexp } from "../../../../shared";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-infos",
  templateUrl: "./infos.component.html",
  styleUrls: ["./infos.component.css"],
})
export class InfosComponent implements OnInit, OnDestroy {
  public readonly THEME_CONFIGURATION = THEME_CONFIGURATION;
  private readonly subscription = new Subscription();
  public routePrefix: string;
  public place: Place;
  public infosForm: UntypedFormGroup;
  public me!: User | null;

  public submitted: boolean;
  public loading: boolean;
  public success: boolean;

  public editor = ClassicEditor;
  public editorConfig = CK_EDITOR_CONF;

  public step: AdminPlaceMenuSteps;
  private orgaObjectId: string | null;

  constructor(
    private readonly formBuilder: UntypedFormBuilder,
    private readonly titleService: Title,
    private readonly adminPlaceService: AdminPlaceService,
    private readonly route: ActivatedRoute,
    private readonly toastr: ToastrService,
    private readonly _sanitizer: DomSanitizer,
    private readonly router: Router,
    private readonly currentLanguageService: CurrentLanguageService,
    protected readonly translateService: TranslateService
  ) {
    this.editorConfig.placeholder = this.translateService.instant(
      "STRUCTURE_DESCRIPTION"
    );

    this.submitted = false;
    this.loading = false;
    this.success = false;
    this.orgaObjectId = null;

    this.step = "infos";
    this.routePrefix = this.currentLanguageService.routePrefix;
  }

  public get f(): {
    [key: string]: AbstractControl;
  } {
    return this.infosForm.controls;
  }

  public get phonesForm(): UntypedFormArray {
    return this.f.entity.get("phones") as UntypedFormArray;
  }

  public get entity(): UntypedFormGroup {
    return this.f.entity as UntypedFormGroup;
  }

  public ngOnInit(): void {
    this.subscription.add(
      this.currentLanguageService.subscribe(
        () => (this.routePrefix = this.currentLanguageService.routePrefix)
      )
    );

    const params = this.route.snapshot.params;

    if (params?.lieu_id) {
      this.getAndSetPlace(params.lieu_id);
    } else {
      if (params?.orgaObjectId) {
        this.orgaObjectId = params.orgaObjectId;
      }
      this.setNewPlace();
    }
  }

  private getAndSetPlace(id: string): void {
    this.subscription.add(
      this.adminPlaceService.getPlace(id, true).subscribe({
        next: (place: Place) => {
          this.place = place;

          this.titleService.setTitle(
            this.translateService.instant("EDIT_PLACE_INFORMATION", {
              placeName: this.place.name,
            })
          );
          this.sanitizeDescription();
          this.initForm();
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
  }

  private setNewPlace(): void {
    this.titleService.setTitle(this.translateService.instant("CREATE_A_PLACE"));
    this.place = new Place();
    this.initForm();
  }

  private sanitizeDescription(): void {
    this.place.description = this._sanitizer.sanitize(
      SecurityContext.HTML,
      this.place.description
    );
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public initForm(): void {
    this.infosForm = this.formBuilder.group({
      lieu_id: [this.place.lieu_id],
      name: [
        this.place.name,
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(6000),
        ],
      ],
      description: [
        this.place.description,
        [
          Validators.required,
          Validators.minLength(2),
          this.descriptionValidator,
        ],
      ],
      entity: this.formBuilder.group({
        facebook: [
          this.place.entity.facebook,
          Validators.pattern(regexp.facebook),
        ],
        fax: [this.place.entity.fax, Validators.pattern(REGEXP.phone)],
        instagram: [
          this.place.entity.instagram,
          Validators.pattern(regexp.instagram),
        ],
        mail: [this.place.entity.mail, Validators.email],
        phones: this.formBuilder.array([]),
        website: [
          this.place.entity.website,
          Validators.pattern(regexp.website),
        ],
      }),
      country: [THEME_CONFIGURATION.country],
    });
  }

  public onDescriptionChange({ editor }: ChangeEvent): void {
    this.f.description.setValue(editor.getData());
    this.f.description.markAsDirty();
  }

  public descriptionValidator(
    control: AbstractControl
  ): { [key: string]: boolean } | null {
    if (typeof control.value !== "undefined") {
      const description = control.value.replace(regexp.htmlTag, "").trim();

      if (description.length < 10) {
        return { minLength: true };
      } else if (description.length > 4000) {
        return { maxLength: true };
      }
      return null;
    }
    return null;
  }

  public submitInfos(): void {
    this.f.lieu_id.setValue(this.place.lieu_id);
    this.submitted = true;

    if (this.infosForm.invalid) {
      this.toastr.error(this.translateService.instant("INCORRECT_FIELDS"));
      return;
    }

    const phones = this.infosForm.value.entity.phones.filter(
      (phone: Phone) =>
        (phone?.label && phone?.phoneNumber) || phone?.phoneNumber
    );

    this.infosForm.value.entity.phones = phones;
    this.loading = true;
    this.subscription.add(
      this.adminPlaceService
        .create(this.infosForm.value, this.orgaObjectId)
        .subscribe({
          next: (place: Place) => {
            this.toastr.success(
              this.translateService.instant("SUCCESSFUL_ADDITION")
            );
            this.loading = false;
            this.success = true;

            const route = place.stepsDone.emplacement
              ? `${this.currentLanguageService.routePrefix}/manage-place/${place.lieu_id}`
              : `${this.currentLanguageService.routePrefix}/admin-place/emplacement/${place.lieu_id}`;

            this.router.navigate([route]);
          },
          error: (error) => {
            this.loading = false;

            if (error.status && error.status === 400) {
              this.toastr.error(
                this.translateService.instant("PLEASE_CHECK_FORM_FIELDS")
              );
            }

            if (error.status && error.status === 401) {
              this.toastr.error(
                this.translateService.instant("PROHIBITED_ACTION")
              );
            }
          },
        })
    );
  }

  public canDeactivate(): Observable<boolean> | boolean {
    // insert logic to check if there are pending changes here;
    // returning true will navigate without confirmation
    // returning false will show a confirm alert before navigating away
    return !this.infosForm?.dirty || this.success;
  }
}
