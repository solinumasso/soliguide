import { Component, OnDestroy, OnInit } from "@angular/core";

import {
  UntypedFormGroup,
  UntypedFormBuilder,
  Validators,
  AbstractControl,
} from "@angular/forms";
import { Title } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";

import { ToastrService } from "ngx-toastr";

import { Subscription } from "rxjs";
import { PasswordValidator } from "../../services/password-validator.service";
import { UsersService } from "../../services/users.service";
import { CurrentLanguageService } from "../../../general/services/current-language.service";
import { PASSWORD_VALIDATOR } from "../../constants";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-pwd-reset",
  templateUrl: "./pwd-reset.component.html",
  styleUrls: ["./pwd-reset.component.css"],
})
export class PwdResetComponent implements OnInit, OnDestroy {
  private readonly subscription = new Subscription();
  public resetPwdForm!: UntypedFormGroup;

  public loading: boolean;
  public submitted: boolean;
  public hidePassword: boolean;
  public hidePasswordConfirmation: boolean;

  public resetTokenPassword: string;

  constructor(
    private readonly formBuilder: UntypedFormBuilder,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly userService: UsersService,
    private readonly toastr: ToastrService,
    private readonly titleService: Title,
    private readonly currentLanguageService: CurrentLanguageService,
    private readonly translateService: TranslateService
  ) {
    this.loading = false;
    this.hidePassword = true;
    this.resetTokenPassword = "";
    this.hidePasswordConfirmation = true;

    this.submitted = false;
  }

  public ngOnInit(): void {
    this.titleService.setTitle(
      this.translateService.instant("RESETTING_PASSWORD")
    );

    if (this.route.snapshot.params.resetTokenPassword) {
      this.resetTokenPassword = this.route.snapshot.params.resetTokenPassword;

      this.subscription.add(
        this.userService.checkPasswordToken(this.resetTokenPassword).subscribe({
          next: (tokenIsOk: boolean) => {
            if (tokenIsOk) {
              this.initForm();
            } else {
              this.toastr.error(
                this.translateService.instant("INCORRECT_PASSWORD_RESET_LINK")
              );
              this.router.navigate([this.currentLanguageService.routePrefix]);
            }
          },
          error: () => {
            this.toastr.error(
              this.translateService.instant("INCORRECT_PASSWORD_RESET_LINK")
            );
            this.router.navigate([this.currentLanguageService.routePrefix]);
          },
        })
      );
    } else {
      this.toastr.error(this.translateService.instant("NON_EXISTANT_PAGE"));
      this.router.navigate([this.currentLanguageService.routePrefix]);
    }
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public initForm(): void {
    this.resetPwdForm = this.formBuilder.group(
      {
        token: [this.resetTokenPassword, Validators.required],
        passwordConfirmation: ["", Validators.compose(PASSWORD_VALIDATOR)],
        password: ["", Validators.compose(PASSWORD_VALIDATOR)],
      },
      {
        validator: PasswordValidator.passwordMatchValidator,
      }
    );
  }

  public get f(): {
    [key: string]: AbstractControl;
  } {
    return this.resetPwdForm.controls;
  }

  public resetpwd(): void {
    this.submitted = true;

    if (this.resetPwdForm.invalid) {
      this.toastr.error(this.translateService.instant("INCORRECT_FIELDS"));
      return;
    }

    this.loading = true;

    const data = this.resetPwdForm.value;

    this.subscription.add(
      this.userService.resetPassword(data).subscribe({
        next: () => {
          this.loading = false;
          this.toastr.success(
            this.translateService.instant("PASSWORD_UPDATE_SUCCESSFUL")
          );
          this.router.navigate([
            this.currentLanguageService.routePrefix,
            "connexion",
          ]);
        },
        error: () => {
          this.toastr.error(
            this.translateService.instant("PASSWORD_UPDATE_FAIL")
          );
          this.loading = false;
        },
      })
    );
  }
}
