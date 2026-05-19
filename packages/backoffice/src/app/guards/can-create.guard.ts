import { Injectable } from "@angular/core";

import { catchError, map, Observable, of } from "rxjs";

import { AuthService } from "../modules/users/services/auth.service";
import { UserRole } from "@soliguide/common";

@Injectable({ providedIn: "root" })
export class CanCreateGuard {
  constructor(private authService: AuthService) {}

  public canActivate(): Observable<boolean> {
    return this.authService.isAuth().pipe(
      map((canAccess: boolean) => {
        if (canAccess) {
          const user = this.authService.currentUserValue;

          if (user?.admin || user?.role === UserRole.OWNER) {
            return true;
          }
        }
        this.authService.notAuthorized();
        return false;
      }),
      catchError(() => {
        this.authService.notAuthorized();
        return of(false);
      })
    );
  }
}
