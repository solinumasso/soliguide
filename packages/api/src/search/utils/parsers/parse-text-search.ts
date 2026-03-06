
import isEmpty from "lodash.isempty";
import { FilterQuery } from "mongoose";

export const parseTextSearch = <T extends { [key: string]: any }>(
  query: FilterQuery<any>,
  searchData: T,
  field: keyof T
): void => {
  if (!isEmpty(searchData[field])) {
    query[field] = {
      $options: "i",
      $regex: createSafeRegex(searchData[field]),
    };
  }
};

export const createSafeRegex = (searchTerm: string): RegExp => {
  const escapedSearchTerm = searchTerm.replace(
    /[-[\]{}()*+?.,\\^$|#\s]/g,
    "\\$&"
  );
  return new RegExp(`.*${escapedSearchTerm}.*`);
};
