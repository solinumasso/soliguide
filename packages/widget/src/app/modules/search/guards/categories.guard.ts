import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Router } from "@angular/router";
import {
  Categories,
  LEGACY_CATEGORIES_SEO,
  getCategoryFromLegacyCategory,
} from "@soliguide/common";

@Injectable({ providedIn: "root" })
export class CategoriesGuard {
  constructor(private readonly router: Router) {}

  public canActivate(
    route: ActivatedRouteSnapshot
  ): Promise<boolean> | boolean {
    const legacyCategoryInParams =
      LEGACY_CATEGORIES_SEO[route.params["category"]];

    const legacyCategoriesInQueryParams = route.queryParams["categories"]
      ? route.queryParams["categories"]
          .split(",")
          .map((category: string) => parseInt(category, 10))
      : [];

    if (
      !Object.values(Categories).includes(route.params["category"]) &&
      typeof legacyCategoryInParams === "number"
    ) {
      return this.router.navigate(
        [
          "search",
          route.params["widgetId"],
          route.params["lang"],
          getCategoryFromLegacyCategory(legacyCategoryInParams),
        ],
        {
          replaceUrl: true,
        }
      );
    } else if (legacyCategoriesInQueryParams[0]) {
      return this.router.navigate(
        [
          "search",
          route.params["widgetId"],
          route.params["lang"],
          route.params["category"],
        ],
        {
          queryParams: {
            ...route.queryParams,
            categories: legacyCategoriesInQueryParams
              .map((legacyCategory: number) =>
                getCategoryFromLegacyCategory(legacyCategory)
              )
              .toString(),
          },
        }
      );
    }

    return true;
  }
}
