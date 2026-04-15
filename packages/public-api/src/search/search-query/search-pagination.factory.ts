import { SearchPagination } from "../repositories/places.repository";
import { SearchQuery } from "./search-query";

export class SearchPaginationFactory {
  create(query: SearchQuery): SearchPagination {
    const hasOptions = Boolean(query.options);

    const limit = hasOptions
      ? typeof query.options?.limit === "number"
        ? query.options.limit
        : 20
      : 100;

    const page =
      hasOptions && typeof query.options?.page === "number"
        ? query.options.page
        : 1;

    return {
      page: Math.max(1, Math.trunc(page)),
      limit: Math.max(1, Math.trunc(limit)),
    };
  }
}
