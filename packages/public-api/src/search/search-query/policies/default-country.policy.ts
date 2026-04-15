import { CountryCodes, GeoTypes } from "@soliguide/common";

import { SearchQueryPolicy } from "../search-query-policy";
import { SearchQuery } from "../search-query";

export class DefaultCountryPolicy implements SearchQueryPolicy {
  apply(query: SearchQuery): SearchQuery {
    const locations = query.locations ?? [];
    if (!locations.length) {
      return query;
    }

    const normalizedLocations = locations.map((location) => {
      if (location.geoType !== GeoTypes.POSITION) {
        return location;
      }

      if (location.country) {
        return location;
      }

      return {
        ...location,
        country: CountryCodes.FR,
      };
    });

    return {
      ...query,
      locations: normalizedLocations,
    };
  }
}
