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
import {
  type UntypedFormGroup,
  UntypedFormBuilder,
  Validators,
  type AbstractControl,
} from "@angular/forms";
import { Title } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";

import { TranslateService } from "@ngx-translate/core";
import { Subscription } from "rxjs";
import { ChangeEvent } from "@ckeditor/ckeditor5-angular/ckeditor.component";
import * as ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { ToastrService } from "ngx-toastr";

import { REGEXP, RELATIONS } from "@soliguide/common";
import type { PosthogProperties } from "@soliguide/common-angular";

import { Organisation } from "../../interfaces";
import { OrganisationService } from "../../services/organisation.service";

import { CurrentLanguageService } from "../../../general/services/current-language.service";

import type { User } from "../../../users/classes";
import { AuthService } from "../../../users/services/auth.service";

import { regexp, CK_EDITOR_CONF, EmailValidator } from "../../../../shared";
import { PosthogService } from "../../../analytics/services/posthog.service";
import { phoneValidator } from "../../../shared/components/form-phone-input/validators";
import { THEME_CONFIGURATION } from "../../../../models";

@Component({
  selector: "app-form-organisation",
  templateUrl: "./form-organisation.component.html",
  styleUrls: ["./form-organisation.component.css"],
})
export class FormOrganisationComponent implements OnInit, OnDestroy {
  private readonly subscription = new Subscription();
  public organisation: Organisation;
  public me!: User | null;

  public orgaForm!: UntypedFormGroup;

  public submitted: boolean;
  public loading: boolean;

  public editor = ClassicEditor;
  public editorConfig = CK_EDITOR_CONF;

  public readonly RELATIONS = RELATIONS;
  public readonly THEME_CONFIGURATION = THEME_CONFIGURATION;

  constructor(
    private readonly authService: AuthService,
    private readonly formBuilder: UntypedFormBuilder,
    private readonly organisationService: OrganisationService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly titleService: Title,
    private readonly toastr: ToastrService,
    private readonly currentLanguageService: CurrentLanguageService,
    private readonly translateService: TranslateService,
    private readonly posthogService: PosthogService
  ) {
    this.submitted = false;
    this.loading = false;
    this.me = null;
    this.organisation = new Organisation();
  }

  public ngOnInit(): void {
    this.me = this.authService.currentUserValue;

    if (this.route.snapshot.params.id) {
      const id = this.route.snapshot.params.id;

      this.subscription.add(
        this.organisationService
          .get(id)
          .subscribe((organisation: Organisation) => {
            this.titleService.setTitle(
              this.translateService.instant("ORGANIZATION_UPDATE")
            );
            this.organisation = organisation;
            this.initForm();
          })
      );
    } else {
      this.titleService.setTitle(
        this.translateService.instant("CREATION_ORGANIZATION")
      );
      this.initForm();
    }
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public initForm = (): void => {
    this.orgaForm = this.formBuilder.group({
      name: [
        this.organisation.name,
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(80),
        ],
      ],
      territories: [
        this.organisation.territories,
        this.me.admin ? [Validators.required] : [],
      ],
      description: [this.organisation.description, []],
      phone: [this.organisation.phone, [phoneValidator]],
      mail: [this.organisation.mail, [EmailValidator]],
      website: [
        this.organisation.website,
        [Validators.pattern(regexp.website)],
      ],
      facebook: [
        this.organisation.facebook,
        [Validators.pattern(regexp.facebook)],
      ],
      fax: [this.organisation.fax, [Validators.pattern(REGEXP.phone)]],
      relations: [
        this.organisation.relations,
        this.me.admin ? [Validators.required] : [],
      ],
      country: [THEME_CONFIGURATION.country],
    });
  };

  public get f(): Record<string, AbstractControl> {
    return this.orgaForm.controls;
  }

  public submitInfos = (): void => {
    this.captureEvent("click-submit-info", {
      oldValue: this.organisation,
      newValue: this.orgaForm.value,
    });

    this.submitted = true;

    if (this.orgaForm.invalid) {
      this.toastr.error(this.translateService.instant("INCORRECT_FIELDS"));
      return;
    }

    this.loading = true;

    this.subscription.add(
      this.organisationService
        .create(this.organisation._id, this.orgaForm.value)
        .subscribe({
          next: (organisation: Organisation) => {
            this.submitted = false;
            this.loading = false;
            this.toastr.success(
              this.translateService.instant("SUCCESSFUL_ADDITION")
            );
            this.router.navigate([
              this.currentLanguageService.routePrefix,
              "organisations",
              organisation.organization_id,
            ]);
          },
          error: () => {
            this.loading = false;
            this.toastr.error(
              this.translateService.instant("CHECK_THE_FORM_FIELDS")
            );
          },
        })
    );
  };

  public onDescriptionChange = ({ editor }: ChangeEvent): void => {
    this.f.description.setValue(editor.getData());
    this.f.description.markAsDirty();
  };

  // TODO: use this function for all toggleCheckBoxButton
  public toggleCheckboxButton(control: string, key: string): void {
    const array = this.f[control].value;
    const index = array.indexOf(key);

    if (index !== -1) {
      array.splice(index, 1);
      this.f[control].setValue(array);
    } else {
      array.push(key);
      this.f[control].setValue(array);
    }
    this.f[control].markAsDirty();
    this.f[control].markAsTouched();
  }

  public captureEvent(eventName: string, properties?: PosthogProperties): void {
    this.posthogService.capture(`form-orga-${eventName}`, {
      organizationId: this.organisation._id,
      organization_id: this.organisation.organization_id,
      ...properties,
    });
  }
}
