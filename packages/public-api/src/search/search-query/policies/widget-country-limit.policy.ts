import { CountryCodes, GeoTypes, UserStatus } from "@soliguide/common";

import { SearchPolicyContext, SearchQueryPolicy } from "../search-query-policy";
import { SearchQuery } from "../search-query";

export class WidgetCountryLimitPolicy implements SearchQueryPolicy {
  apply(query: SearchQuery, context: SearchPolicyContext): SearchQuery {
    if (context.userStatus !== UserStatus.WIDGET_USER) {
      return query;
    }

    const locations = query.locations ?? [];
    if (!locations.length) {
      return query;
    }

    return {
      ...query,
      locations: locations.map((location) => {
        if ([GeoTypes.POSITION, GeoTypes.COUNTRY].includes(location.geoType)) {
          return {
            ...location,
            country: CountryCodes.FR,
          };
        }

        return location;
      }),
    };
  }
}
