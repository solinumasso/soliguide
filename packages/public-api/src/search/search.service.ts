import { Inject, Injectable } from "@nestjs/common";
import { FIELDS_FOR_SEARCH } from "@soliguide/api";
import { GeoTypes, PlaceType, UserStatus } from "@soliguide/common";

import {
  PLACES_REPOSITORY,
  PlacesRepository,
} from "./repositories/places.repository";
import { SearchQueryPolicyPipeline } from "./search-query/search-query-policy.pipeline";
import { SearchQueryFactory } from "./search-query/search-query.factory";
import { SearchPaginationFactory } from "./search-query/search-pagination.factory";
import { CanonicalSearchRequest } from "./canonical-search-request";
import { CanonicalSearchResponse } from "./canonical-search-response";
import { SearchPolicyContext } from "./search-query/search-query-policy";
import { SearchUserContext } from "./auth/search-auth.resolver";
import {
  SearchLocation,
  SearchProximityLocation,
  SearchQuery,
} from "./search-query/search-query";

@Injectable()
export class SearchService {
  private readonly searchQueryPolicyPipeline = new SearchQueryPolicyPipeline();
  private readonly searchQueryFactory = new SearchQueryFactory();
  private readonly searchPaginationFactory = new SearchPaginationFactory();

  constructor(
    @Inject(PLACES_REPOSITORY)
    private readonly placesRepository: PlacesRepository
  ) {}

  async search(
    request: CanonicalSearchRequest,
    user: SearchUserContext
  ): Promise<CanonicalSearchResponse> {
    const query = this.searchQueryFactory.create(request);
    const context = this.buildPolicyContext(user);
    const adaptedQuery = this.resolveSearchQuery(
      this.searchQueryPolicyPipeline.apply(query, context),
      context
    );
    const pagination = this.searchPaginationFactory.create(adaptedQuery);

    const result = await this.placesRepository.search(adaptedQuery, pagination);

    return result as unknown as CanonicalSearchResponse;
  }

  protected buildPolicyContext(user: SearchUserContext): SearchPolicyContext {
    return {
      userStatus: user.status,
      categoriesLimitations: user.categoriesLimitations,
      areas: user.areas,
    };
  }

  private resolveSearchQuery(
    query: SearchQuery,
    context: SearchPolicyContext
  ): SearchQuery {
    const proximity = this.resolveProximity(
      query.locations,
      query.placeType ?? PlaceType.PLACE,
      context
    );

    return {
      ...query,
      resultFields:
        query.options?.fields ??
        this.resolveDefaultResultFields(context, query.placeType),
      closedPlacesLast: context.userStatus !== UserStatus.API_USER,
      ...(proximity ? { proximity } : {}),
    };
  }

  private resolveDefaultResultFields(
    context: SearchPolicyContext,
    placeType?: PlaceType
  ): string {
    if (context.userStatus === UserStatus.API_USER) {
      return FIELDS_FOR_SEARCH.API;
    }

    return (placeType ?? PlaceType.PLACE) === PlaceType.ITINERARY
      ? FIELDS_FOR_SEARCH.ITINERARY_PUBLIC_SEARCH
      : FIELDS_FOR_SEARCH.PLACE_PUBLIC_SEARCH;
  }

  private resolveProximity(
    locations: SearchLocation[] | undefined,
    placeType: PlaceType,
    context: SearchPolicyContext
  ): SearchProximityLocation | undefined {
    if (!locations?.length) {
      return undefined;
    }

    const proximityLocations = locations.filter(
      (location): location is SearchProximityLocation =>
        this.shouldUseProximity(location, placeType, context)
    );

    return proximityLocations.length === 1 ? proximityLocations[0] : undefined;
  }

  private shouldUseProximity(
    location: SearchLocation,
    placeType: PlaceType,
    context: SearchPolicyContext
  ): location is SearchProximityLocation {
    if (!this.hasCoordinates(location)) {
      return false;
    }

    if (location.geoType === GeoTypes.POSITION) {
      return true;
    }

    if (context.userStatus === UserStatus.API_USER) {
      return false;
    }

    if (placeType === PlaceType.ITINERARY) {
      return [GeoTypes.BOROUGH, GeoTypes.CITY].includes(location.geoType);
    }

    return (
      context.userStatus !== UserStatus.WIDGET_USER &&
      location.geoType !== GeoTypes.COUNTRY
    );
  }

  private hasCoordinates(
    location: SearchLocation
  ): location is SearchProximityLocation {
    return (
      "coordinates" in location &&
      Array.isArray(location.coordinates) &&
      location.coordinates.length === 2
    );
  }
}
