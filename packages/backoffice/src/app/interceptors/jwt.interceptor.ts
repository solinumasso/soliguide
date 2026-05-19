import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AuthService } from "../modules/users/services/auth.service";

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private readonly authService: AuthService) {}

  public intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const currentUser = this.authService.currentUserValue;
    if (currentUser?.token) {
      return next.handle(
        request.clone({
          setHeaders: {
            Authorization: `JWT ${currentUser.token}`,
          },
        })
      );
    }

    return next.handle(request);
  }
}
