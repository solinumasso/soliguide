import { Injectable } from "@angular/core";

import { Categories, CategoriesTreeNode } from "@soliguide/common";

import {
  CategoryPath,
  CategorySearchResult,
} from "./category-select.component";

@Injectable({
  providedIn: "root",
})
export class CategoryTreeService {
  public findPath(
    nodes: CategoriesTreeNode[],
    targetId: Categories
  ): CategoryPath | null {
    const pathNodes = this.findPathNodes(nodes, targetId);
    return pathNodes ? { nodes: pathNodes } : null;
  }

  public searchLeaves(
    nodes: CategoriesTreeNode[],
    query: string,
    labelOf: (node: CategoriesTreeNode) => string
  ): CategorySearchResult[] {
    return this.collectLeafResults(nodes, [], query, labelOf);
  }

  private findPathNodes(
    nodes: CategoriesTreeNode[],
    targetId: Categories
  ): CategoriesTreeNode[] | null {
    for (const node of nodes) {
      if (node.id === targetId) return [node];
      const childPath = this.findPathNodes(node.children, targetId);
      if (childPath) return [node, ...childPath];
    }
    return null;
  }

  private collectLeafResults(
    nodes: CategoriesTreeNode[],
    breadcrumb: CategoriesTreeNode[],
    query: string,
    labelOf: (node: CategoriesTreeNode) => string
  ): CategorySearchResult[] {
    const results: CategorySearchResult[] = [];
    for (const node of nodes) {
      if (node.children.length === 0) {
        if (labelOf(node).includes(query)) {
          results.push({ node, breadcrumb });
        }
      } else {
        results.push(
          ...this.collectLeafResults(
            node.children,
            [...breadcrumb, node],
            query,
            labelOf
          )
        );
      }
    }
    return results;
  }
}
