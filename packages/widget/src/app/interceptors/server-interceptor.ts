/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from "@angular/common/http";
import { Injectable, Injector } from "@angular/core";

import { Observable, throwError, timer } from "rxjs";
import { catchError, retry } from "rxjs/operators";

import { ToastrService } from "ngx-toastr";

const MAX_RETRIES = 2;
const RETRY_DELAY = 1000;
const ERROR_STATUS_CODES_TO_RETRY = [0, 408, 409, 444, 502, 503, 504, 520];

@Injectable({
  providedIn: "root",
})
export class ServerErrorInterceptor implements HttpInterceptor {
  constructor(private readonly injector: Injector) {}

  public intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const toastr = this.injector.get(ToastrService);

    return next.handle(request).pipe(
      retry({
        count: MAX_RETRIES,
        delay: (error) => {
          return this.isRetryable(error)
            ? timer(RETRY_DELAY)
            : throwError(() => error);
        },
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.error instanceof ErrorEvent) {
          if (!navigator.onLine) {
            toastr.error(
              "Vous êtes actuellement hors-ligne. Veuillez vérifier votre connexion internet"
            );
            return throwError(() => "NAVIGATOR_OFFLINE");
          }
          return throwError(() => error.error);
        } else if (error instanceof HttpErrorResponse) {
          if (error.status === 0) {
            console.warn("Erreur de connexion:", error.message);
            toastr.error(
              "Problème de connexion au serveur. Veuillez réessayer plus tard."
            );
          } else if (error.status === 404) {
            toastr.error("La page que vous recherchez n'existe pas");
          } else {
            toastr.error(
              "Une erreur serveur est survenue. Nos équipes ont été notifiées."
            );
          }
        }
        this.logError(request, error);
        return throwError(() => error);
      })
    );
  }

  private isRetryable(error: HttpErrorResponse): boolean {
    return !error.status || ERROR_STATUS_CODES_TO_RETRY.includes(error.status);
  }

  private logError(request: HttpRequest<any>, error: HttpErrorResponse): void {
    console.error(error.message, {
      status: error.status,
      statusText: error.statusText,
      url: error.url,
      message: error.message,
      error: error.error,
      request,
    });
  }
}
