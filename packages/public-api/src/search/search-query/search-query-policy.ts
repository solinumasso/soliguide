import { Categories } from "@soliguide/common";
import {
  NonAdminUserStatus,
  SearchQuery,
  SearchUserAreas,
} from "./search-query";
import { PlaceAccessQuery } from "./place-access.query";

export interface SearchQueryPolicy {
  apply(query: SearchQuery, context: SearchPolicyContext): SearchQuery;
}

export type SearchPolicyContext = {
  userStatus: NonAdminUserStatus;
  placeAccess: PlaceAccessQuery;
  categoriesLimitations?: Categories[];
  areas?: SearchUserAreas;
};
