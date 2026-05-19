import { Component, OnDestroy, OnInit } from "@angular/core";
import {
  UntypedFormGroup,
  UntypedFormBuilder,
  Validators,
  AbstractControl,
} from "@angular/forms";
import { Title } from "@angular/platform-browser";
import { Router } from "@angular/router";
import isEmail from "validator/lib/isEmail";

import { TranslateService } from "@ngx-translate/core";

import { EMAIL_VALIDATOR_CONFIG } from "@soliguide/common";

import { ToastrService } from "ngx-toastr";

import { map, Observable, of, Subscription } from "rxjs";

import { PASSWORD_VALIDATOR } from "../../constants";
import { User } from "../../classes";
import { PasswordValidator } from "../../services/password-validator.service";
import { AuthService } from "../../services/auth.service";
import { UsersService } from "../../services/users.service";
import { UserSignup } from "../../types";

import { CurrentLanguageService } from "../../../general/services/current-language.service";

import {
  EmailValidator,
  nonEmptyArray,
  noWhiteSpace,
} from "../../../../shared";
import { THEME_CONFIGURATION } from "../../../../models";

@Component({
  selector: "app-signup-trad",
  templateUrl: "./signup-trad.component.html",
  styleUrls: ["./signup-trad.component.css"],
})
export class SignupTradComponent implements OnInit, OnDestroy {
  public readonly THEME_CONFIGURATION = THEME_CONFIGURATION;

  private readonly subscription = new Subscription();
  public routePrefix: string;

  public languageForm: UntypedFormGroup;
  public signupForm!: UntypedFormGroup;

  public hidePassword: boolean;
  public hidePasswordConfirmation: boolean;
  public success: boolean;

  public loading: boolean;
  public submitted: boolean;

  public user: User;

  constructor(
    private readonly authService: AuthService,
    private readonly currentLanguageService: CurrentLanguageService,
    private readonly formBuilder: UntypedFormBuilder,
    private readonly router: Router,
    private readonly titleService: Title,
    private readonly toastr: ToastrService,
    private readonly translateService: TranslateService,
    private readonly usersService: UsersService
  ) {
    this.hidePassword = true;
    this.hidePasswordConfirmation = true;
    this.success = false;
    this.submitted = false;

    this.loading = false;

    this.user = new User();

    this.routePrefix = this.currentLanguageService.routePrefix;
  }

  public ngOnInit(): void {
    this.titleService.setTitle(
      this.translateService.instant("SIGNUP_AS_TRANSLATOR", {
        brandName: THEME_CONFIGURATION.brandName,
      })
    );
    this.subscription.add(
      this.currentLanguageService.subscribe(
        () => (this.routePrefix = this.currentLanguageService.routePrefix)
      )
    );
    this.initForm();
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public initForm = (): void => {
    this.signupForm = this.formBuilder.group(
      {
        country: [THEME_CONFIGURATION.country],
        cgu: ["", Validators.requiredTrue],
        languages: [this.user.languages, [Validators.required, nonEmptyArray]],
        mail: [
          this.user.mail,
          [Validators.required, EmailValidator],
          this.validateUniqueEmailForUsers.bind(this),
        ],
        name: [this.user.name, [Validators.required, noWhiteSpace]],
        password: ["", Validators.compose(PASSWORD_VALIDATOR)],
        passwordConfirmation: ["", Validators.compose(PASSWORD_VALIDATOR)],
        translator: [true, Validators.required],
      },
      {
        validators: PasswordValidator.passwordMatchValidator,
      }
    );
  };

  public get f(): {
    [key: string]: AbstractControl;
  } {
    return this.signupForm.controls;
  }

  public getFormValue = (): UserSignup => {
    const formValue = {
      ...this.signupForm.value,
      lastname: "traducteur",
    };

    delete formValue.cgu;

    return formValue;
  };

  public signup = (): void => {
    this.submitted = true;

    if (this.signupForm.invalid) {
      this.toastr.error(this.translateService.instant("INCORRECT_FIELDS"));
      return;
    }

    this.loading = true;

    this.subscription.add(
      this.usersService.signupTranslator(this.getFormValue()).subscribe({
        next: () => {
          this.loading = false;
          this.success = true;
          this.submitted = false;
          this.toastr.success(
            this.translateService.instant("SUCCESSFUL_SIGNUP")
          );

          this.loginAfterSignup();
        },
        error: () => {
          this.loading = false;
          this.success = false;
          this.submitted = false;
          this.toastr.error(
            this.translateService.instant("SIGNUP_FAIL_TRY_AGAIN")
          );
        },
      })
    );
  };

  private loginAfterSignup() {
    this.subscription.add(
      this.authService
        .login(this.signupForm.value.mail, this.signupForm.value.password)
        .subscribe(() => {
          this.router.navigate([
            this.currentLanguageService.routePrefix,
            "aide-trad",
          ]);
        })
    );
  }

  public validateUniqueEmailForUsers = (
    control: AbstractControl
  ): Observable<{ emailTaken: boolean }> => {
    const testEmail =
      isEmail(control?.value.trim(), EMAIL_VALIDATOR_CONFIG) &&
      this.user.mail !== control.value;

    if (testEmail) {
      return this.usersService.checkEmailAlreadyUsed(control.value).pipe(
        map((res: boolean) => {
          return res === false ? null : { emailTaken: true };
        })
      );
    } else {
      return of(null);
    }
  };
}
