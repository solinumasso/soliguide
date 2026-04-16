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

/**
 * A Directed Acyclic Graph (DAG) representing category relationships.
 *
 * Each key is a parent category, and its value is the ordered list of direct children.
 * Leaf categories do not need entries — they are derived automatically.
 * Multi-parental categories naturally appear as children of multiple parents.
 *
 * @example
 * {
 *   [Categories.MENTAL_HEALTH]: [
 *     { id: Categories.PSYCHIATRY, rank: 200 },
 *   ],
 *   [Categories.HEALTH_SPECIALISTS]: [
 *     { id: Categories.PSYCHIATRY, rank: 1100 },  // same node, different parent
 *   ],
 * }
 */
export type CategoriesGraph = Partial<Record<Categories, ChildCategory[]>>;
