import { CategoriesTreeNode } from "@soliguide/common";
import { ExpressRequest } from "../../_models";

export const getAllCategories = (req: ExpressRequest): CategoriesTreeNode[] => {
  return req.requestInformation.categoryService.getCategoriesTreeNode();
};
