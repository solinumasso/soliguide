import { Categories } from "../enums";

export interface CategoriesTreeNode {
  id: Categories;
  rank: number;
  depth: number;
  parent: Categories | null;
  rootParent: Categories;
  children: CategoriesTreeNode[];
}

export type FlatCategoriesTreeNodeCompleted = {
  [key in Categories]?: CategoriesTreeNode[];
};
