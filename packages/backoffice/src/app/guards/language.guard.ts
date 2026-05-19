import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Router } from "@angular/router";
import { isSupportedLanguage } from "@soliguide/common";
import { CurrentLanguageService } from "../modules/general/services/current-language.service";

@Injectable({ providedIn: "root" })
export class LanguageGuard {
  constructor(
    private readonly currentLanguageService: CurrentLanguageService,
    private readonly router: Router
  ) {}

  public canActivate(route: ActivatedRouteSnapshot): boolean {
    if (Object.keys(route.params).length === 0) {
      this.router.navigate([this.currentLanguageService.currentLanguage]);
      return false;
    }
    if (isSupportedLanguage(route.params.lang)) {
      this.currentLanguageService.setCurrentLanguage(route.params.lang);
      return true;
    }
    this.router.navigate([this.currentLanguageService.currentLanguage, "404"]);
    return false;
  }
}
