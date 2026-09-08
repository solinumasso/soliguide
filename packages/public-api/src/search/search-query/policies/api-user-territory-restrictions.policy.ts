import {
  CountryCodes,
  SoliguideCountries,
  UserStatus,
  getAllowedTerritories,
} from "@soliguide/common";

import { SearchPolicyContext, SearchQueryPolicy } from "../search-query-policy";
import { SearchQuery } from "../search-query";

export class ApiUserTerritoryRestrictionsPolicy implements SearchQueryPolicy {
  apply(query: SearchQuery, context: SearchPolicyContext): SearchQuery {
    if (context.userStatus !== UserStatus.API_USER) {
      return query;
    }

    const userAreasCountries = Object.keys(context.areas ?? {});

    if (userAreasCountries.length === 1) {
      const country = userAreasCountries[0] as SoliguideCountries;

      return {
        ...query,
        apiUserRestrictions: this.createPositionRequestForCountry(
          context,
          country
        ),
      };
    }

    if (userAreasCountries.length > 1) {
      return {
        ...query,
        apiUserRestrictions: {
          $or: userAreasCountries.map((country) =>
            this.createPositionRequestForCountry(
              context,
              country as SoliguideCountries
            )
          ),
        },
      };
    }

    return {
      ...query,
      apiUserRestrictions: this.createPositionRequestForCountry(
        context,
        CountryCodes.FR
      ),
    };
  }

  private createPositionRequestForCountry(
    context: SearchPolicyContext,
    country: SoliguideCountries
  ): Record<string, unknown> {
    const allowedTerritories = getAllowedTerritories(
      {
        areas: context.areas,
        status: context.userStatus as UserStatus,
      },
      country
    );

    return {
      $or: [
        {
          "position.departmentCode": { $in: allowedTerritories },
          "position.country": country,
        },
        {
          "parcours.position.departmentCode": { $in: allowedTerritories },
          "parcours.position.country": country,
        },
      ],
    };
  }
}
