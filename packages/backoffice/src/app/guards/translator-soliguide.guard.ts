import { Injectable } from "@angular/core";

import { catchError, map, Observable, of } from "rxjs";

import { TranslationService } from "../modules/translations/services/translation.service";

import { AuthService } from "../modules/users/services/auth.service";

@Injectable({ providedIn: "root" })
export class TranslatorSoliguideGuard {
  constructor(
    private authService: AuthService,
    private translateService: TranslationService
  ) {}

  public canActivate(): Observable<boolean> {
    return this.translateService.isTranslator().pipe(
      map((canAccess: boolean) => {
        if (canAccess) {
          return true;
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
