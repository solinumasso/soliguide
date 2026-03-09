import { getCategoriesService } from "../services";
import { ROOT_CATEGORIES } from "./CATEGORIES.const";
import { FlatCategoriesTreeNode } from "../interfaces";
import { Categories } from "../enums";

let CATEGORIES: FlatCategoriesTreeNode[] = [];

beforeAll(() => {
  CATEGORIES = getCategoriesService().getCategories();
});

function hasCycle(nodeToTest: FlatCategoriesTreeNode): boolean {
  const visitedNodes = new Set<Categories>();

  const _hasCycle = (node: FlatCategoriesTreeNode): boolean => {
    if (visitedNodes.has(node.id)) {
      return true;
    }
    visitedNodes.add(node.id);
    if (node.children.length === 0) {
      return false;
    }
    return !node.children.every((childId) => {
      const child = CATEGORIES.find((category) => childId.id === category.id);
      if (typeof child === "undefined") {
        // This case is tested in another test.
        // Here let's say there's no cycle and that's it
        return true;
      }
      return !_hasCycle(child);
    });
  };
  return _hasCycle(nodeToTest);
}

describe("Categories", () => {
  describe("There should be no duplicate nodes", () => {
    CATEGORIES.forEach((nodeToTest) => {
      it(`no duplicate for ${nodeToTest.id}`, () => {
        expect(
          CATEGORIES.filter((node) => node.id === nodeToTest.id).length
        ).toBe(1);
      });
    });
  });

  describe("There should be no unknown child", () => {
    CATEGORIES.forEach((nodeToTest) => {
      nodeToTest.children.forEach((childId) => {
        it(`${childId.id}, child of ${nodeToTest.id}, is in the categories tree`, () => {
          expect(
            CATEGORIES.find((node) => childId.id === node.id)
          ).not.toBeUndefined();
        });
      });
    });
  });

  describe("There should be no cycle", () => {
    CATEGORIES.forEach((nodeToTest) => {
      it(`${nodeToTest.id} has no cycle`, () => {
        expect(hasCycle(nodeToTest)).toBeFalsy();
      });
    });
  });

  // We may want to remove this test at some point, but for now we have no use for a enum key which isn't ins the categories tree
  describe("All keys of Categories enum should be used", () => {
    Object.entries(Categories).forEach((nodeId) => {
      if (
        [
          Categories.CATALAN_COURSE,
          Categories.SPANISH_COURSE,
          Categories.LEGAL_PROTECTION,
        ].includes(nodeId[1])
      ) {
        it(`${nodeId[0]} should not be in the categories tree`, () => {
          expect(
            CATEGORIES.find((node) => nodeId[1] === node.id)
          ).toBeUndefined();
        });
      } else {
        it(`${nodeId[0]} should be in the categories tree`, () => {
          expect(
            CATEGORIES.find((node) => nodeId[1] === node.id)
          ).not.toBeUndefined();
        });
      }
    });
  });

  // We may want to remove this test at some point, but for now that's true
  describe("All keys of Categories enum should be used equal the value in lowercase", () => {
    Object.entries(Categories).forEach((nodeId) => {
      it(`${nodeId[0]} in lowercase should equal ${nodeId[1]}`, () => {
        expect(nodeId[1]).toEqual(nodeId[1].toLowerCase());
      });
    });
  });

  it("leaves", () => {
    const CATEGORIES_LEAF_NODES =
      getCategoriesService().getCategoriesLeafNodes();
    expect(CATEGORIES_LEAF_NODES.length).toEqual(91);
  });

  it("roots", () => {
    expect(ROOT_CATEGORIES.length).toEqual(11);
  });
});
