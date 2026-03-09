import { Injectable } from "@angular/core";
import { CanActivate, ActivatedRouteSnapshot, Router } from "@angular/router";
import { Observable, of } from "rxjs";
import { THEME_CONFIGURATION } from "../models";

@Injectable({ providedIn: "root" })
export class SolidataGuard implements CanActivate {
  constructor(private router: Router) {}

  public canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const superset = route.params["superset"];

    const supersetData = Object.values(THEME_CONFIGURATION.solidata || {}).find(
      (data) => data.seoUrl === superset
    );

    if (supersetData?.dashboardUrl) {
      return of(true);
    } else {
      this.router.navigate(["/404"]);
      return of(false);
    }
  }
}
