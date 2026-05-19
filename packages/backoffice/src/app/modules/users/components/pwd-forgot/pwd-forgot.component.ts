import { Component, OnInit } from "@angular/core";
import {
  AbstractControl,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { Title } from "@angular/platform-browser";

import { ToastrService } from "ngx-toastr";

import { UsersService } from "../../services/users.service";

import { TranslateService } from "@ngx-translate/core";
import { EmailValidator } from "../../../../shared";
import { THEME_CONFIGURATION } from "../../../../models";

@Component({
  selector: "app-pwd-forgot",
  templateUrl: "./pwd-forgot.component.html",
  styleUrls: ["./pwd-forgot.component.css"],
})
export class PwdForgotComponent implements OnInit {
  public readonly THEME_CONFIGURATION = THEME_CONFIGURATION;
  public forgotPwd: UntypedFormGroup;

  public loading: boolean;
  public submitted: boolean;
  public emailSent: boolean;

  constructor(
    private readonly formBuilder: UntypedFormBuilder,
    private readonly titleService: Title,
    private readonly toastr: ToastrService,
    private readonly userService: UsersService,
    private readonly translateService: TranslateService
  ) {
    this.loading = false;
    this.submitted = false;
    this.emailSent = false;
    this.forgotPwd = this.formBuilder.group({
      mail: ["", [Validators.required, EmailValidator]],
    });
    this.titleService.setTitle(
      this.translateService.instant("FORGOT_PASSWORD")
    );
  }

  public ngOnInit(): void {
    this.translateService.onLangChange.subscribe({
      next: () => {
        this.titleService.setTitle(
          this.translateService.instant("FORGOT_PASSWORD")
        );
      },
    });
  }

  public get f(): {
    [key: string]: AbstractControl;
  } {
    return this.forgotPwd.controls;
  }

  public forgotpwd = (): void => {
    this.submitted = true;

    if (this.forgotPwd.invalid) {
      this.toastr.error(this.translateService.instant("INCORRECT_FIELDS"));
      return;
    }

    this.loading = true;

    this.userService.sendResetPwdEmail(this.forgotPwd.value).subscribe({
      next: () => {
        this.emailSent = true;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.toastr.error(
          this.translateService.instant(
            "IMPOSSIBLE_TO_SEND_PASSWORD_RESET_EMAIL"
          )
        );
      },
    });
  };
}
