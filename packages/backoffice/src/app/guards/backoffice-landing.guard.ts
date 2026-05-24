import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Router } from "@angular/router";

@Injectable({ providedIn: "root" })
export class BackofficeLandingGuard {
  constructor(private readonly router: Router) {}

  public canActivate(route: ActivatedRouteSnapshot): boolean {
    this.router.navigate([route.params["lang"], "manage-place"]);
    return false;
  }
}
