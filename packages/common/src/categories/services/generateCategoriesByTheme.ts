import { Themes } from "../../themes";
import {
  CATEGORIES_GRAPH,
  CATEGORIES_GRAPH_SOLIGUIDE_FR,
  CATEGORIES_GRAPH_SOLIGUIA_ES,
  CATEGORIES_GRAPH_SOLIGUIA_AD,
} from "../constants";
import { Categories } from "../enums";
import {
  CategoriesGraph,
  ChildCategory,
  FlatCategoriesTreeNode,
} from "../interfaces";
import { sortByRank } from "./categories.service";

/**
 * Merges a theme-specific graph overlay into a base graph.
 *
 * For each parent in the overlay:
 * - If the parent already exists in the base, its children are concatenated and re-sorted by rank.
 * - If the parent is new, it is added to the base graph.
 *
 * This preserves existing relationships while adding theme-specific categories.
 */
const mergeGraphs = (
  base: CategoriesGraph,
  overlay: CategoriesGraph
): CategoriesGraph => {
  const merged: CategoriesGraph = { ...base };

  for (const [parentId, children] of Object.entries(overlay)) {
    const key = parentId as Categories;
    const existing = merged[key];

    if (existing) {
      merged[key] = sortByRank([...existing, ...children]);
    } else {
      merged[key] = [...children];
    }
  }

  return merged;
};

/**
 * Converts a CategoriesGraph (adjacency list) to the legacy FlatCategoriesTreeNode[] format.
 *
 * This produces the same structure that consumers of getCategories() expect:
 * one entry per unique category, each with its direct children (or [] for leaves).
 *
 * Leaf categories are automatically discovered — any category that appears as a
 * child but has no entry in the graph is a leaf.
 */
export const graphToFlatCategories = (
  graph: CategoriesGraph
): FlatCategoriesTreeNode[] => {
  const result = new Map<Categories, FlatCategoriesTreeNode>();

  // First pass: add all parent nodes with their children
  for (const [parentId, children] of Object.entries(graph)) {
    const key = parentId as Categories;
    result.set(key, { id: key, children: [...children] });
  }

  // Second pass: ensure every child has an entry (leaves get children: [])
  for (const children of Object.values(graph)) {
    for (const child of children as ChildCategory[]) {
      if (!result.has(child.id)) {
        result.set(child.id, { id: child.id, children: [] });
      }
    }
  }

  return Array.from(result.values());
};

/**
 * Builds the merged CategoriesGraph for a given theme.
 * Base graph + theme overlay = complete graph for the locale.
 */
export const buildGraphByTheme = (
  theme: Themes | null = null
): CategoriesGraph => {
  if (theme === Themes.SOLIGUIA_ES) {
    return mergeGraphs(CATEGORIES_GRAPH, CATEGORIES_GRAPH_SOLIGUIA_ES);
  }
  if (theme === Themes.SOLIGUIA_AD) {
    return mergeGraphs(CATEGORIES_GRAPH, CATEGORIES_GRAPH_SOLIGUIA_AD);
  }

  // Default: French theme
  return mergeGraphs(CATEGORIES_GRAPH, CATEGORIES_GRAPH_SOLIGUIDE_FR);
};

/**
 * Generates the FlatCategoriesTreeNode[] for backward compatibility.
 * This is consumed by CategoriesService.getCategories() and all existing code.
 */
export const generateCategoriesByTheme = (
  theme: Themes | null = null
): FlatCategoriesTreeNode[] => {
  return graphToFlatCategories(buildGraphByTheme(theme));
};
