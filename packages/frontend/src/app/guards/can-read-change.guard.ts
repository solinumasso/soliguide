import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Router } from "@angular/router";

import { ToastrService } from "ngx-toastr";

import { catchError, map, Observable, of } from "rxjs";

import { PlaceChanges } from "../models/place-changes/classes";
import { PlaceChangesService } from "../modules/place-changes/services/place-changes.service";
import { CurrentLanguageService } from "../modules/general/services/current-language.service";
import { AuthService } from "../modules/users/services/auth.service";

import { TranslateService } from "@ngx-translate/core";

@Injectable({ providedIn: "root" })
export class CanReadChangeGuard {
  constructor(
    private readonly authService: AuthService,
    private readonly placeChangesService: PlaceChangesService,
    private readonly router: Router,
    private readonly toastr: ToastrService,
    private readonly currentLanguageService: CurrentLanguageService,
    private readonly translateService: TranslateService
  ) {}

  public canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const changeObjectId = route.params.placeChangesObjectId;

    return this.placeChangesService.getVersion(changeObjectId).pipe(
      map((placeChanges: PlaceChanges) => {
        if (placeChanges._id) {
          return true;
        } else {
          this.toastr.error(
            this.translateService.instant("NOT_AUTHORIZED_TO_ACCESS")
          );
          this.router.navigate([this.currentLanguageService.routePrefix]);
          return false;
        }
      }),
      catchError(() => {
        this.authService.notAuthorized();
        return of(false);
      })
    );
  }
}
