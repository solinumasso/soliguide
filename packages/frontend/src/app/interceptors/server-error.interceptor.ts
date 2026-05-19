import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from "@angular/common/http";
import { Injectable } from "@angular/core";

import { ToastrService } from "ngx-toastr";

import { catchError, Observable, throwError } from "rxjs";

import { TranslateService } from "@ngx-translate/core";

@Injectable({
  providedIn: "root",
})
export class ServerErrorInterceptor implements HttpInterceptor {
  constructor(
    private readonly toastr: ToastrService,
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

        return throwError(() => returnedError);
      })
    );
  }
}
