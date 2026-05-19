import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from "@angular/common/http";
import { Injectable } from "@angular/core";

import { ToastrService } from "ngx-toastr";

import { catchError, Observable, throwError } from "rxjs";

import { AuthService } from "../modules/users/services/auth.service";

import { TranslateService } from "@ngx-translate/core";

@Injectable({
  providedIn: "root",
})
export class ServerErrorInterceptor implements HttpInterceptor {
  constructor(
    private readonly toastr: ToastrService,
    public readonly authService: AuthService,
    private readonly translateService: TranslateService
  ) {}

  public intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((returnedError) => {
        if (returnedError.error instanceof ErrorEvent) {
          if (!navigator.onLine) {
            this.toastr.error(
              this.translateService.instant("CURRENTLY_OFFLINE")
            );
            return throwError(
              () =>
                new Error(this.translateService.instant("WEB_BROWSER_OFFLINE"))
            );
          }
          return throwError(() => returnedError.error);
        }

        if (returnedError instanceof HttpErrorResponse) {
          switch (returnedError.status) {
            case 401:
              this.toastr.warning(
                this.translateService.instant("EXPIRED_SESSION")
              );
              this.authService.logoutAndRedirect();
              break;
            case 403:
              this.authService.notAuthorized();
              break;
            default:
              break;
          }
        }
        return throwError(() => returnedError);
      })
    );
  }
}
