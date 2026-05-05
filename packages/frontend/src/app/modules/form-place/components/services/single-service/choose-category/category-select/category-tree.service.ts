/*
Soliguide: Useful information for those who need it

SPDX-FileCopyrightText: © 2024 Solinum

SPDX-License-Identifier: AGPL-3.0-only

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published
by the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/
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
