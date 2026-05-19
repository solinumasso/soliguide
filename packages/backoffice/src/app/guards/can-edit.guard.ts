import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Router } from "@angular/router";

import { ToastrService } from "ngx-toastr";

import { catchError, map, Observable, of } from "rxjs";
import { CurrentLanguageService } from "../modules/general/services/current-language.service";

import { PlaceService } from "../modules/place/services/place.service";

import { AuthService } from "../modules/users/services/auth.service";
import { TranslateService } from "@ngx-translate/core";

@Injectable({ providedIn: "root" })
export class CanEditGuard {
  constructor(
    private readonly authService: AuthService,
    private readonly placeService: PlaceService,
    private readonly router: Router,
    private readonly toastr: ToastrService,
    private readonly currentLanguageService: CurrentLanguageService,
    private readonly translateService: TranslateService
  ) {}

  public canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const lieuId = route.params.lieu_id;
    return this.placeService.canEditPlace(lieuId).pipe(
      map((canEdit: boolean) => {
        if (canEdit) {
          return true;
        } else {
          this.toastr.error(
            this.translateService.instant("NOT_AUTHORIZED_TO_ACCESS")
          );
          this.router.navigate([
            this.currentLanguageService.routePrefix,
            "fiche",
            lieuId,
          ]);
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
