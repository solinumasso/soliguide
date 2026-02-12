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
  AbstractControl,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";

import { ToastrService } from "ngx-toastr";

import { Subscription } from "rxjs";

import {
  DEPARTMENTS_MAP,
  DEPARTMENT_CODES,
  DepartmentInfo,
} from "@soliguide/common";
import { GeneralService } from "../../services/general.services";
import { AuthService } from "../../../users/services/auth.service";
import { SeoService } from "../../../shared/services";
import { generateCompleteName, EmailValidator } from "../../../../shared";
import { CurrentLanguageService } from "../../services/current-language.service";
import { PosthogService } from "../../../analytics/services/posthog.service";
import { TranslateService } from "@ngx-translate/core";
import { THEME_CONFIGURATION } from "../../../../models";

@Component({
  selector: "app-contact",
  templateUrl: "./contact.component.html",
  styleUrls: ["./contact.component.css"],
})
export class ContactComponent implements OnInit, OnDestroy {
  public readonly THEME_CONFIGURATION = THEME_CONFIGURATION;
  private readonly subscription = new Subscription();
  public contactForm!: UntypedFormGroup;

  public title: string;
  public description: string;
  public organization?: string;
  public department: string;

  public loading: boolean;
  public submitted: boolean;

  public departmentNumbers = DEPARTMENT_CODES[THEME_CONFIGURATION.country]
    .slice()
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  public departmentsList: DepartmentInfo<typeof THEME_CONFIGURATION.country> =
    DEPARTMENTS_MAP[THEME_CONFIGURATION.country];

  constructor(
    private readonly authService: AuthService,
    private readonly formBuilder: UntypedFormBuilder,
    private readonly generalService: GeneralService,
    private readonly router: Router,
    private readonly seoService: SeoService,
    private readonly toastr: ToastrService,
    private readonly posthogService: PosthogService,
    private readonly currentLanguageService: CurrentLanguageService,
    private readonly translateService: TranslateService
  ) {
    this.loading = false;
    this.submitted = false;
  }

  public ngOnInit(): void {
    const title = this.translateService.instant(
      "CONTACT_SOLIGUIDE_TEAM_TITLE",
      { brandName: THEME_CONFIGURATION.brandName }
    );
    const description = this.translateService.instant(
      "SOLIGUIDE_TEAM_ANSWER_YOUR_MESSAGES",
      { brandName: THEME_CONFIGURATION.brandName }
    );

    this.seoService.updateTitleAndTags(title, description, true);

    this.initForm();
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public get f(): {
    [key: string]: AbstractControl;
  } {
    return this.contactForm.controls;
  }

  public initForm = (): void => {
    this.contactForm = this.formBuilder.group({
      email: ["", [Validators.required, EmailValidator]],
      name: ["", [Validators.required]],
      country: [THEME_CONFIGURATION.country],
      department: ["", [Validators.required]],
      subject: ["", [Validators.required]],
      message: ["", [Validators.required]],
    });

    if (this.authService.currentUserValue) {
      if (this.authService.currentUserValue.organizations.length) {
        this.f.name.setValue(
          this.authService.currentUserValue.currentOrga.name
        );
      } else {
        this.f.name.setValue(
          generateCompleteName(
            this.authService.currentUserValue.name,
            this.authService.currentUserValue.lastname
          )
        );
      }
      this.f.email.setValue(this.authService.currentUserValue.mail);
    }
  };

  public sendEmail = (): void => {
    this.submitted = true;

    this.captureEvent("click-send-form");

    if (this.contactForm.invalid) {
      this.toastr.error(this.translateService.instant("INCORRECT_FIELDS"));
      return;
    }

    this.loading = true;

    this.subscription.add(
      this.generalService.contact(this.contactForm.value).subscribe({
        next: () => {
          this.loading = false;
          this.submitted = false;
          this.toastr.success(
            this.translateService.instant("MESSAGE_SENT_SUCCESSFULLY")
          );
          this.router.navigate([this.currentLanguageService.routePrefix]);
        },
        error: () => {
          this.loading = false;
          this.toastr.error(
            this.translateService.instant("FORM_CONTAINS_ERROR")
          );
        },
      })
    );
  };

  public captureEvent(eventName: string) {
    this.posthogService.capture(`contact-us-${eventName}`, {
      contactForm: this.contactForm.value,
    });
  }
}
