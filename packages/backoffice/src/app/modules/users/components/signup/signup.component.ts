import { Component, OnDestroy, OnInit } from "@angular/core";
import {
  AbstractControl,
  UntypedFormBuilder,
  UntypedFormGroup,
  ValidationErrors,
  Validators,
} from "@angular/forms";
import { Title } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";

import { TranslateService } from "@ngx-translate/core";

import {
  Categories,
  EMAIL_VALIDATOR_CONFIG,
  UserStatus,
} from "@soliguide/common";

import { ToastrService } from "ngx-toastr";

import { map, Observable, of, Subscription } from "rxjs";

import { PASSWORD_VALIDATOR } from "../../constants";
import { Invitation, User } from "../../classes";
import { PasswordValidator } from "../../services/password-validator.service";
import { UsersService } from "../../services/users.service";
import { UserSignup } from "../../types";

import { Organisation } from "../../../admin-organisation/interfaces";
import { InviteUserService } from "../../../admin-organisation/services/invite-user.service";

import { CurrentLanguageService } from "../../../general/services/current-language.service";
import isEmail from "validator/lib/isEmail";

import {
  EmailValidator,
  nonEmptyArray,
  noWhiteSpace,
} from "../../../../shared";
import { AuthService } from "../../services/auth.service";
import { phoneValidator } from "../../../shared/components/form-phone-input/validators";
import { THEME_CONFIGURATION } from "../../../../models";
import { userAdminEmailValidator } from "../../services/user-admin-email.validator";

@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.css"],
})
export class SignupComponent implements OnInit, OnDestroy {
  public readonly THEME_CONFIGURATION = THEME_CONFIGURATION;
  private readonly subscription = new Subscription();
  public routePrefix: string;
  public signupForm!: UntypedFormGroup;
  public valid: ValidationErrors | null;

  public organisation: Organisation;

  public hidePassword: boolean;
  public hidePasswordConfirmation: boolean;
  public success: boolean;
  public loading: boolean;
  public submitted: boolean;
  public readonly UserStatus = UserStatus;
  public organizationName: string | null;
  public invitationToken: string | null;

  public user: User;

  public needForm: boolean;

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly authService: AuthService,
    private readonly currentLanguageService: CurrentLanguageService,
    private readonly formBuilder: UntypedFormBuilder,
    private readonly inviteUserService: InviteUserService,
    private readonly router: Router,
    private readonly titleService: Title,
    private readonly toastr: ToastrService,
    private readonly translateService: TranslateService,
    private readonly usersService: UsersService
  ) {
    this.valid = null;
    this.hidePassword = true;
    this.hidePasswordConfirmation = true;
    this.success = false;
    this.submitted = false;
    this.organizationName = null;
    this.organisation = new Organisation();

    this.user = new User();

    this.invitationToken = null;

    this.needForm = false;
    this.loading = true;
    this.routePrefix = this.currentLanguageService.routePrefix;
  }

  public ngOnInit(): void {
    this.titleService.setTitle(
      this.translateService.instant("SIGNUP_SOLIGUIDE", {
        brandName: THEME_CONFIGURATION.brandName,
      })
    );

    this.subscription.add(
      this.currentLanguageService.subscribe(
        () => (this.routePrefix = this.currentLanguageService.routePrefix)
      )
    );

    const invitationId = this.activatedRoute.snapshot.params["idInvitation"];

    if (!invitationId) {
      this.initForm();
      return;
    }
    // PART 1: Invitation ID transmitted in the URL

    this.subscription.add(
      this.inviteUserService.getInvitationInfos(invitationId).subscribe({
        next: (invitation: Invitation) => {
          if (invitation?.user?.user_id) {
            // CASE 1: User exists
            if (invitation.user.verified) {
              this.loading = true;
              this.updateInvitation(invitationId);
            }
            // CASE 2: The account must be created
            else {
              this.invitationToken = invitation.token;
              this.user = new User(invitation.user);
              this.user.territories = invitation.organization.territories;
              this.organizationName = invitation.organizationName;
              this.initForm();
            }
          }
          // Invitation does not exist
          else {
            this.router.navigate([this.currentLanguageService.routePrefix]);
            this.toastr.error(
              this.translateService.instant("CANNOT_FIND_INVITATION")
            );
          }
        },
        error: () => {
          this.toastr.error(
            this.translateService.instant("INEXISTANT_OR_EXPIRED_INVITATION")
          );
          this.router.navigate([this.currentLanguageService.routePrefix]);
        },
      })
    );
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public updateInvitation(invitationId: string) {
    // Update the invitation
    this.subscription.add(
      this.inviteUserService.validateInvitation(invitationId).subscribe({
        next: () => {
          this.loading = false;
          this.success = true;
        },
        error: () => {
          this.loading = false;
          this.success = false;
        },
      })
    );
  }
  public initForm = (): void => {
    this.needForm = true;
    this.loading = false;
    this.success = false;

    this.signupForm = this.formBuilder.group(
      {
        categoriesLimitations: [this.user.categoriesLimitations],
        passwordConfirmation: [
          "",
          this.invitationToken ? Validators.compose(PASSWORD_VALIDATOR) : null,
        ],
        password: [
          "",
          this.invitationToken ? Validators.compose(PASSWORD_VALIDATOR) : null,
        ],
        cgu: ["", this.invitationToken ? Validators.required : null],
        invitation: [this.invitationToken],
        lastname: [this.user.lastname, [Validators.required, noWhiteSpace]],
        mail: [
          {
            disabled: !!this.invitationToken,
            value: this.user.mail,
          },
          [
            Validators.required,
            EmailValidator,
            userAdminEmailValidator("status"),
          ],
          this.validateUniqueEmailForUsers.bind(this),
        ],
        name: [this.user.name, [Validators.required, noWhiteSpace]],
        organization: [this.organizationName],
        organizationName: [
          {
            disabled: true,
            value: this.organizationName,
          },
        ],
        phone: [this.user.phone, phoneValidator],
        status: [
          this.invitationToken ? this.user.status : null,
          this.invitationToken ? null : Validators.required,
        ],
        territories: [
          {
            disabled: !!this.invitationToken,
            value: this.user.territories,
          },
          [Validators.required, nonEmptyArray],
        ],
        country: [THEME_CONFIGURATION.country],
        title: [this.user.title],
      },
      {
        validators: this.invitationToken
          ? PasswordValidator.passwordMatchValidator
          : null,
      }
    );

    this.signupForm
      .get("status")
      ?.valueChanges.subscribe((value: UserStatus) => {
        this.signupForm.get("mail")?.updateValueAndValidity();

        this.signupForm
          .get("territories")
          ?.setValidators(
            value !== UserStatus.ADMIN_SOLIGUIDE
              ? [Validators.required, nonEmptyArray]
              : []
          );

        this.signupForm.get("territories")?.updateValueAndValidity();
      });
  };

  public get f(): {
    [key: string]: AbstractControl;
  } {
    return this.signupForm.controls;
  }

  public setCategories = (selectedCategories: Categories[]): void => {
    this.f["categoriesLimitations"].setValue(selectedCategories);
  };

  public getFormValue = (): UserSignup => {
    const formValue = {
      ...this.signupForm.value,
    };

    if (this.invitationToken) {
      formValue.mail = this.user.mail;
      formValue.territories = this.user.territories;
    }

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

    const formValue = this.getFormValue();

    this.subscription.add(
      this.usersService.signup(formValue).subscribe({
        next: () => {
          this.loading = false;
          this.success = true;
          this.submitted = false;
          this.toastr.success(
            this.translateService.instant("SUCCESSFUL_SIGNUP")
          );

          if (this.invitationToken) {
            this.loginAfterRegister();
          } else {
            this.router.navigate([this.currentLanguageService.currentLanguage]);
          }
        },
        error: () => {
          this.loading = false;
          this.success = false;
          this.submitted = false;
          this.toastr.error(this.translateService.instant("SIGNUP_FAIL"));
        },
      })
    );
  };

  private loginAfterRegister() {
    this.subscription.add(
      this.authService
        .login(this.user.mail, this.signupForm.value.password)
        .subscribe((user: User) => {
          if (user?.currentOrga) {
            this.router.navigate([
              this.currentLanguageService.routePrefix,
              "organisations",
              user.currentOrga.organization_id,
            ]);
          } else {
            this.router.navigate([this.currentLanguageService.currentLanguage]);
          }
        })
    );
  }

  public validateUniqueEmailForUsers = (
    control: AbstractControl
  ): Observable<{ emailTaken: boolean } | null> => {
    const testEmail =
      isEmail(control?.value?.trim(), EMAIL_VALIDATOR_CONFIG) &&
      this.user.mail !== control.value;

    if (testEmail) {
      return this.usersService.checkEmailAlreadyUsed(control.value).pipe(
        map((res: boolean) => {
          return res === false ? null : { emailTaken: true };
        })
      );
    }
    return of(null);
  };
}
