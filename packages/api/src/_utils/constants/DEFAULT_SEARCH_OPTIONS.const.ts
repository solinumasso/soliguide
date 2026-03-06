import mongoose from "mongoose";
import { FIELDS_FOR_SEARCH } from "../../search/constants/requests/FIELDS_FOR_SEARCH.const";

export const DEFAULT_SEARCH_OPTIONS: mongoose.QueryOptions = {
  limit: 100,
  page: 1,
  skip: 0,
  sort: {},
  fields: FIELDS_FOR_SEARCH.DEFAULT,
};
