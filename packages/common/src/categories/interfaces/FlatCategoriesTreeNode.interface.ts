import { Categories } from "../enums";

export type FlatCategoriesTreeNode =
  | FlatCategoriesTreeNodeWithChildren
  | FlatCategoriesTreeNodeWithoutChildren;

export type FlatOrderCategoriesTreeNode = FlatCategoriesTreeNode & {
  rank: number;
};

export interface FlatCategoriesTreeNodeWithChildren {
  id: Categories;
  children: ChildCategory[];
}

export interface FlatCategoriesTreeNodeWithoutChildren {
  id: Categories;
  children: [];
}

export interface ChildCategory {
  id: Categories;
  rank: number;
}
