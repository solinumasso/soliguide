import { Inject, Injectable } from "@nestjs/common";

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
    const adaptedQuery = this.searchQueryPolicyPipeline.apply(query, context);
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
}
