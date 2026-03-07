import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot } from "@angular/router";
import { Observable, map, catchError, of } from "rxjs";
import { AuthService } from "../modules/users/services/auth.service";

@Injectable({ providedIn: "root" })
export class AuthGuard {
  constructor(private readonly authService: AuthService) {}
  public canActivate(
    route: ActivatedRouteSnapshot
  ): Observable<boolean> | boolean {
    return this.authService.isAuth().pipe(
      map((canAccess: boolean) => {
        if (!canAccess) {
          this.authService.logoutAndRedirect(route);
          return false;
        }
        return true;
      }),
      catchError(() => {
        this.authService.logoutAndRedirect(route);
        return of(false);
      })
    );
  }
}
