import { Categories } from "../enums";

export type CategoriesSpecificFieldsCategoryMapping = {
  [value in Categories]?: string[];
};
