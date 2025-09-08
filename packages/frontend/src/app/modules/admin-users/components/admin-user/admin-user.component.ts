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
import { Title } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";

import { TranslateService } from "@ngx-translate/core";

import { Categories, UserStatus } from "@soliguide/common";

import { ToastrService } from "ngx-toastr";
import { Subscription } from "rxjs";

import { CurrentLanguageService } from "../../../general/services/current-language.service";

import { User } from "../../../users/classes";
import { AuthService } from "../../../users/services/auth.service";
import { UsersService } from "../../../users/services/users.service";

import { noWhiteSpace } from "../../../../shared";
import { THEME_CONFIGURATION } from "../../../../models";

@Component({
  selector: "app-admin-user",
  templateUrl: "./admin-user.component.html",
  styleUrls: ["./admin-user.component.css"],
})
export class AdminUserComponent implements OnInit, OnDestroy {
  public readonly THEME_CONFIGURATION = THEME_CONFIGURATION;
  private readonly subscription = new Subscription();
  public updateForm!: UntypedFormGroup;

  public user: User;
  public me!: User | null;

  public loading: boolean;
  public submitted: boolean;

  public readonly UserStatus = UserStatus;

  constructor(
    private readonly authService: AuthService,
    private readonly formBuilder: UntypedFormBuilder,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly titleService: Title,
    private readonly toastr: ToastrService,
    private readonly translateService: TranslateService,
    private readonly usersService: UsersService,
    private readonly currentLanguageService: CurrentLanguageService
  ) {
    this.loading = false;
    this.submitted = false;
    this.user = new User();
  }

  public ngOnInit(): void {
    this.me = this.authService.currentUserValue;

    const paramId = this.route.snapshot.params.id;

    this.subscription.add(
      this.usersService.getUser(paramId).subscribe({
        next: (user: User) => {
          this.user = user;
          this.titleService.setTitle(
            this.translateService.instant("MODIFY_USER_ACCOUNT", {
              userName: user.name,
            })
          );
          this.initForm();
        },
        error: () => {
          this.toastr.error(
            this.translateService.instant("CANNOT_EDIT_PROFILE")
          );
          this.router.navigate([this.currentLanguageService.routePrefix]);
        },
      })
    );
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public get f(): {
    [key: string]: AbstractControl;
  } {
    return this.updateForm.controls;
  }

  public initForm = (): void => {
    this.updateForm = this.formBuilder.group({
      categoriesLimitations: [this.user.categoriesLimitations],
      languages: [
        this.user.languages,
        this.user.translator ? Validators.required : null,
      ],
      lastname: [this.user.lastname, [Validators.required, noWhiteSpace]],
      mail: [
        {
          disabled: true,
          value: this.user.mail,
        },
      ],
      name: [this.user.name, [Validators.required, noWhiteSpace]],
      phone: [this.user.phone, []],
      territories: [
        this.user.territories,
        this.user.status === UserStatus.ADMIN_TERRITORY ||
        this.user.status === UserStatus.API_USER
          ? [Validators.required]
          : [],
      ],
      title: [this.user.title],
      translator: [this.user.translator, Validators.required],
    });

    this.subscription.add(
      this.f.translator.valueChanges.subscribe((value: boolean) => {
        this.updateForm
          .get("languages")
          ?.setValidators(value ? Validators.required : null);
        this.updateForm.get("languages")?.updateValueAndValidity();
      })
    );
  };

  public setCategories = (selectedCategories: Categories[]): void => {
    this.f.categoriesLimitations.setValue(selectedCategories);
  };

  public update = (): void => {
    this.submitted = true;
    this.loading = true;

    if (this.updateForm.invalid) {
      this.toastr.error(this.translateService.instant("INCORRECT_FIELDS"));
      this.loading = false;
      return;
    }

    this.loading = true;

    this.subscription.add(
      this.usersService
        .updateUser(this.updateForm.value, this.user._id)
        .subscribe({
          next: () => {
            this.loading = false;
            this.submitted = false;
            this.toastr.success(
              this.translateService.instant("INFORMATION_SUCCESSFULLY_UPDATED")
            );
          },
          error: () => {
            this.loading = false;
            this.toastr.error(this.translateService.instant("UPDATE_ERROR"));
          },
        })
    );
  };
}
