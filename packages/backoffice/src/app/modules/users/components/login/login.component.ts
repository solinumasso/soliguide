import { Component, OnDestroy, OnInit } from "@angular/core";
import {
  AbstractControl,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";

import { Subscription } from "rxjs";
import { TranslateService } from "@ngx-translate/core";

import { User } from "../../classes";
import { AuthService } from "../../services/auth.service";

import { PosthogService } from "../../../analytics/services/posthog.service";
import { CurrentLanguageService } from "../../../general/services/current-language.service";
import { SeoService } from "../../../shared/services";
import {
  EmailValidator,
  IS_WEBVIEW_APP,
  noWhiteSpace,
} from "../../../../shared";
import { THEME_CONFIGURATION } from "../../../../models";

@Component({
  selector: "app-login",
  styleUrls: ["./login.component.css"],
  templateUrl: "./login.component.html",
})
export class LoginComponent implements OnInit, OnDestroy {
  private readonly subscription = new Subscription();
  public readonly IS_WEBVIEW_APP = IS_WEBVIEW_APP;
  public readonly THEME_CONFIGURATION = THEME_CONFIGURATION;
  public readonly proAccountCreationFormLink? =
    THEME_CONFIGURATION.proAccountCreationFormLink;
  public routePrefix: string;
  public loginForm!: UntypedFormGroup;

  public hidePassword: boolean;
  public loading: boolean;
  public submitted: boolean;
  public dashboardTracking: Record<string, string> = {};

  private returnUrl: string | null;

  constructor(
    private readonly authService: AuthService,
    private readonly formBuilder: UntypedFormBuilder,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly seoService: SeoService,
    private readonly currentLanguageService: CurrentLanguageService,
    private readonly posthogService: PosthogService,
    private readonly translateService: TranslateService
  ) {
    this.hidePassword = true;
    this.loading = false;
    this.submitted = false;

    this.routePrefix = this.currentLanguageService.routePrefix;

    this.returnUrl = this.route.snapshot.queryParamMap.get("returnUrl");
  }

  public ngOnInit(): void {
    const title = this.translateService.instant("LOGON_SOLIGUIDE", {
      brandName: THEME_CONFIGURATION.brandName,
    });
    const description = this.translateService.instant("LOGIN_TO_UPDATE", {
      brandName: THEME_CONFIGURATION.brandName,
    });
    this.seoService.updateTitleAndTags(title, description, true);

    const paramMap = this.route.snapshot.queryParamMap;

    for (const key of paramMap.keys) {
      const value = paramMap.get(key);
      if (value !== null) {
        this.dashboardTracking[key] = value;
      }
    }

    this.subscription.add(
      this.translateService.onLangChange.subscribe({
        next: () => {
          const title = this.translateService.instant("LOGON_SOLIGUIDE", {
            brandName: THEME_CONFIGURATION.brandName,
          });
          const description = this.translateService.instant("LOGIN_TO_UPDATE", {
            brandName: THEME_CONFIGURATION.brandName,
          });
          this.seoService.updateTitleAndTags(title, description, true);
        },
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
    this.loginForm = this.formBuilder.group({
      mail: ["", [Validators.required, EmailValidator]],
      password: ["", [Validators.required, noWhiteSpace]],
    });
  };

  public get f(): {
    [key: string]: AbstractControl;
  } {
    return this.loginForm.controls;
  }

  public login = (): void => {
    this.submitted = true;

    if (this.loginForm.status !== "VALID") {
      return;
    }

    this.loading = true;

    this.subscription.add(
      this.authService
        .login(this.f.mail.value, this.f.password.value)
        .subscribe({
          next: (user: User) => {
            this.loading = false;
            this.redirectUserAfterLogin(user);
          },
          error: () => {
            this.loading = false;
            this.loginForm.controls?.password.setErrors({
              invalidPwd: true,
            });
          },
        })
    );
  };

  public createProAccount = (): void => {
    this.posthogService.capture("request-pro-account-on-airtable");
  };

  public onPwdChange = (): void => {
    if (
      this.submitted &&
      this.loginForm.controls?.password.value &&
      this.loginForm.controls?.password.hasError("invalidPwd")
    )
      this.loginForm.controls?.password.setErrors(null);
  };

  private redirectUserAfterLogin = (user: User): void => {
    // Root URL e.g. /<lang>

    if (this.returnUrl) {
      const url = new URL(this.returnUrl, window.location.origin);

      if (url.origin === window.location.origin) {
        const target = `${url.pathname}${url.search}${url.hash}`.replace(
          "/?",
          "?"
        );
        this.router.navigateByUrl(target);
        return;
      }
    }

    if (user.pro && user.currentOrga) {
      this.router.navigate([
        this.currentLanguageService.routePrefix,
        "organisations",
        user.currentOrga.organization_id,
      ]);
    } else if (user.translator) {
      this.router.navigate([
        this.currentLanguageService.routePrefix,
        "aide-trad",
      ]);
    } else {
      this.router.navigate([this.currentLanguageService.routePrefix]);
    }
  };
}
