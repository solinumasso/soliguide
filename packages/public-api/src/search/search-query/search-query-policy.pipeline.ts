import { SearchQuery } from "./search-query";
import { ApiUserCategoryLimitationsPolicy } from "./policies/api-user-category-limitations.policy";
import { ApiUserLegacyMobilityCategoriesPolicy } from "./policies/api-user-legacy-mobility-categories.policy";
import { ApiUserTerritoryRestrictionsPolicy } from "./policies/api-user-territory-restrictions.policy";
import { AllVisibilityPolicy } from "./policies/visibility.policy";
import { DefaultCountryPolicy } from "./policies/default-country.policy";
import { SingleCategoryPolicy } from "./policies/single-category.policy";
import { ServiceFiltersDefaultPolicy } from "./policies/service-filters-default.policy";
import { OnlineStatusPolicy } from "./policies/status.policy";
import { WidgetCountryLimitPolicy } from "./policies/widget-country-limit.policy";
import { SearchPolicyContext, SearchQueryPolicy } from "./search-query-policy";

export class SearchQueryPolicyPipeline {
  private readonly policies: SearchQueryPolicy[];

  constructor(
    policies: SearchQueryPolicy[] = SearchQueryPolicyPipeline.defaults()
  ) {
    this.policies = policies;
  }

  apply(query: SearchQuery, context: SearchPolicyContext): SearchQuery {
    let adaptedQuery = { ...query };

    for (const policy of this.policies) {
      adaptedQuery = policy.apply(adaptedQuery, context);
    }

    return adaptedQuery;
  }

  static defaults(): SearchQueryPolicy[] {
    return [
      new WidgetCountryLimitPolicy(),
      new DefaultCountryPolicy(),
      new OnlineStatusPolicy(),
      new ServiceFiltersDefaultPolicy(),
      new AllVisibilityPolicy(),
      new SingleCategoryPolicy(),
      new ApiUserLegacyMobilityCategoriesPolicy(),
      new ApiUserCategoryLimitationsPolicy(),
      new ApiUserTerritoryRestrictionsPolicy(),
    ];
  }
}
