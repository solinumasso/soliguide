import { Categories } from "@soliguide/common";
import {
  NonAdminUserStatus,
  SearchQuery,
  SearchUserAreas,
} from "./search-query";

export interface SearchQueryPolicy {
  apply(query: SearchQuery, context: SearchPolicyContext): SearchQuery;
}

export type SearchPolicyContext = {
  userStatus: NonAdminUserStatus;
  categoriesLimitations?: Categories[];
  areas?: SearchUserAreas;
};
