import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { environment } from "../../environments/environment";

@Injectable()
export class AuthCredentialsInterceptor implements HttpInterceptor {
  public intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if (!request.url.startsWith(environment.apiUrl)) {
      return next.handle(request);
    }

    return next.handle(
      request.clone({
        withCredentials: true,
      })
    );
  }
}
