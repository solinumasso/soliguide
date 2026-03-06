import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Router } from "@angular/router";

import { ToastrService } from "ngx-toastr";

import { map, Observable } from "rxjs";
import { CurrentLanguageService } from "../modules/general/services/current-language.service";

import { AuthService } from "../modules/users/services/auth.service";
import { TranslateService } from "@ngx-translate/core";
import { THEME_CONFIGURATION } from "../models";

@Injectable({ providedIn: "root" })
export class NotAuthGuard {
  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly toastr: ToastrService,
    private readonly currentLanguageService: CurrentLanguageService,
    private readonly translateService: TranslateService
  ) {}

  public canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    return this.authService.isAuth().pipe(
      map((isLogged: boolean) => {
        if (isLogged) {
          let timeout = 6000;
          if (route.params?.idInvitation) {
            this.translateService.instant(
              "CANNOT_CREATE_ACCOUNT_WITH_EMAIL_LOG_OUT_TO_ACCEPT"
            );
            timeout = 10000;
          }
          this.router.navigate([this.currentLanguageService.routePrefix]);
          this.toastr.warning(
            this.translateService.instant("ALREADY_LOGGED_IN", {
              brandName: THEME_CONFIGURATION.brandName,
            }),
            undefined,
            {
              timeOut: timeout,
            }
          );
          return false;
        }
        return true;
      })
    );
  }
}
