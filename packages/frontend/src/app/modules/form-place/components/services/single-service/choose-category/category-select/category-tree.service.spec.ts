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
import { TestBed } from "@angular/core/testing";

import { Categories, CategoriesTreeNode } from "@soliguide/common";

import { CategoryTreeService } from "./category-tree.service";

// A minimal 3-level tree: ROOT → MID → [LEAF_A, LEAF_B]
// Using distinct IDs from the real enum to keep tests decoupled from the real taxonomy
const MOCK_TREE: CategoriesTreeNode[] = [
  {
    id: "root" as Categories,
    children: [
      {
        id: "mid" as Categories,
        children: [
          {
            id: "leaf-a" as Categories,
            children: [],
            depth: 2,
            parent: "mid" as Categories,
            rootParent: "root" as Categories,
            rank: 1,
          },
          {
            id: "leaf-b" as Categories,
            children: [],
            depth: 2,
            parent: "mid" as Categories,
            rootParent: "root" as Categories,
            rank: 2,
          },
        ],
        depth: 1,
        parent: "root" as Categories,
        rootParent: "root" as Categories,
        rank: 1,
      },
    ],
    depth: 0,
    parent: null,
    rootParent: "root" as Categories,
    rank: 1,
  },
];

describe("CategoryTreeService", () => {
  let service: CategoryTreeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CategoryTreeService);
  });

  describe("findPath", () => {
    it("returns null when the target id does not exist in the tree", () => {
      const result = service.findPath(MOCK_TREE, "unknown" as Categories);
      expect(result).toBeNull();
    });

    it("returns a single-node path when the target is at the root level", () => {
      const result = service.findPath(MOCK_TREE, "root" as Categories);
      expect(result).not.toBeNull();
      expect(result!.nodes.map((node) => node.id)).toEqual(["root"]);
    });

    it("returns the full path to an intermediate node", () => {
      const result = service.findPath(MOCK_TREE, "mid" as Categories);
      expect(result).not.toBeNull();
      expect(result!.nodes.map((node) => node.id)).toEqual(["root", "mid"]);
    });

    it("returns the full path to a leaf node", () => {
      const result = service.findPath(MOCK_TREE, "leaf-a" as Categories);
      expect(result).not.toBeNull();
      expect(result!.nodes.map((node) => node.id)).toEqual([
        "root",
        "mid",
        "leaf-a",
      ]);
    });

    it("finds the second leaf correctly", () => {
      const result = service.findPath(MOCK_TREE, "leaf-b" as Categories);
      expect(result).not.toBeNull();
      expect(result!.nodes.map((node) => node.id)).toEqual([
        "root",
        "mid",
        "leaf-b",
      ]);
    });
  });

  describe("searchLeaves", () => {
    const labelOf = (node: CategoriesTreeNode): string => node.id as string;

    it("returns an empty array when the query does not match any leaf", () => {
      const results = service.searchLeaves(MOCK_TREE, "xyz", labelOf);
      expect(results).toEqual([]);
    });

    it("returns only leaf nodes, never intermediate or root nodes", () => {
      // "root" matches the root id, but root is not a leaf
      const results = service.searchLeaves(MOCK_TREE, "root", labelOf);
      expect(results).toEqual([]);
    });

    it("matches a leaf by substring", () => {
      const results = service.searchLeaves(MOCK_TREE, "leaf", labelOf);
      expect(results.length).toBe(2);
      expect(results.map((result) => result.node.id)).toEqual([
        "leaf-a",
        "leaf-b",
      ]);
    });

    it("matches a specific leaf and includes the correct breadcrumb", () => {
      const results = service.searchLeaves(MOCK_TREE, "leaf-a", labelOf);
      expect(results.length).toBe(1);
      expect(results[0].node.id).toBe("leaf-a");
      expect(results[0].breadcrumb.map((node) => node.id)).toEqual([
        "root",
        "mid",
      ]);
    });

    it("is case-sensitive — the caller is responsible for normalising the query", () => {
      const upperResults = service.searchLeaves(MOCK_TREE, "LEAF", labelOf);
      const lowerResults = service.searchLeaves(MOCK_TREE, "leaf", labelOf);
      expect(upperResults).toEqual([]);
      expect(lowerResults.length).toBe(2);
    });
  });
});
