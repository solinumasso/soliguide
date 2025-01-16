/*
 * Soliguide: Useful information for those who need it
 *
 * SPDX-FileCopyrightText: © 2024 Solinum
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
import { ROOT_CATEGORIES } from "../constants";
import {
  CategoriesTreeNode,
  ChildCategory,
  FlatCategoriesTreeNode,
  FlatCategoriesTreeNodeCompleted,
  FlatCategoriesTreeNodeWithoutChildren,
  FlatOrderCategoriesTreeNode,
} from "../interfaces";
import { Categories } from "../enums";
import { Themes } from "../../themes";
import { PackageType } from "../../general";
import { generateCategoriesByTheme } from "./generateCategoriesByTheme";

const ROOT_DEPTH = 0;
let frontCategoriesService: CategoriesService | null;

export const initializeCategoriesByTheme = (
  theme: Themes | null = null
): void => {
  frontCategoriesService = new CategoriesService(theme, PackageType.FRONT);
};

export const initializeCategoriesApiByTheme = (
  theme: Themes | null = null
): CategoriesService => {
  return new CategoriesService(theme, PackageType.API);
};

export const initializeCategoriesForCategoriesApiV2 = (): CategoriesService => {
  return new CategoriesService(null, PackageType.CATEGORIES_API_V2);
};

export const sortByRank = <T extends { rank: number }>(arg: T[]): T[] => {
  return arg.sort((a, b) => a.rank - b.rank);
};

const getOrderRootCategories = (): ChildCategory[] => {
  return sortByRank(ROOT_CATEGORIES);
};

export const getCategoriesService = (): CategoriesService => {
  if (!frontCategoriesService) {
    throw new Error("categoriesService is not initialized");
  }
  return frontCategoriesService;
};

export class CategoriesService {
  private flatOrderCategoriesTreeCompleted!: FlatCategoriesTreeNodeCompleted;
  private readonly orderRootFlatCategories!: FlatOrderCategoriesTreeNode[];
  private readonly orderRootCategories!: ChildCategory[];
  private readonly orderRootCategoriesIds!: Categories[];
  private categoriesLeafNodes!: FlatCategoriesTreeNodeWithoutChildren[];
  private categoriesLeaf!: Categories[];
  private readonly categoriesTreeNode!: CategoriesTreeNode[];
  private readonly categoriesByTheme: FlatCategoriesTreeNode[];
  private readonly categoriesNodesWithOneDepthChildren!: FlatCategoriesTreeNode[];

  constructor(theme: Themes | null = null, packageType = PackageType.FRONT) {
    // only categoriesByTheme used by API and FRONT and CATEGORIES_API_V2
    this.categoriesByTheme = generateCategoriesByTheme(theme);

    // CATEGORIES_API_V2 needs all Categories for external API
    this.orderRootCategories = getOrderRootCategories();
    [this.orderRootCategoriesIds, this.orderRootFlatCategories] =
      this.handleRootCategories();
    this.categoriesTreeNode = this.categoriesFlatTreeToTree();

    if (packageType === PackageType.FRONT) {
      this.categoriesNodesWithOneDepthChildren =
        this.handleCategoriesNodesWithOneDepthChildren();
    }
  }

  private handleRootCategories(): [
    Categories[],
    FlatOrderCategoriesTreeNode[]
  ] {
    const orderRootCategoriesIds: Categories[] = [];
    const orderRootFlatCategories = this.orderRootCategories.map(
      (rootCategory: ChildCategory) => {
        const category = this.categoriesByTheme.find(
          (cat) => cat.id === rootCategory.id
        );
        if (!category) {
          throw new Error(
            `Category ${rootCategory.id} not found in categoriesByTheme`
          );
        }
        orderRootCategoriesIds.push(rootCategory.id);
        return {
          ...category,
          rank: rootCategory.rank,
        };
      }
    );

    return [orderRootCategoriesIds, orderRootFlatCategories];
  }

  private categoriesFlatTreeToTree(): CategoriesTreeNode[] {
    const rootNodes = this.orderRootFlatCategories;
    const depth = ROOT_DEPTH;

    const parent: Categories | null = null; // Root categories have no parent

    return rootNodes.map((rootNode): CategoriesTreeNode => {
      const currentRootParent = rootNode.id; // Root categories is marked as belonging to this root category

      const currentNode = {
        id: rootNode.id,
        depth,
        parent,
        rank: rootNode.rank,
        children: this.childrenToTree(
          rootNode.children,
          depth,
          currentRootParent,
          currentRootParent
        ),
        rootParent: currentRootParent,
      };

      this.completeFlatOrderCategoriesTreeCompleted(currentNode);
      return currentNode;
    });
  }

  private childrenToTree(
    children: ChildCategory[] | [],
    depth: number,
    parent: Categories | null,
    rootParent: Categories
  ): CategoriesTreeNode[] {
    if (!children.length) {
      return [];
    }
    const depthChildren = depth++;
    return children.map((child) => {
      const catNode = this.categoriesByTheme.find((cat) => child.id === cat.id);
      let children = [];
      let nodeOrderChildren = catNode?.children ?? [];
      if (nodeOrderChildren.length) {
        nodeOrderChildren = sortByRank(nodeOrderChildren);
      }
      children = this.childrenToTree(
        nodeOrderChildren,
        depthChildren,
        child.id,
        rootParent
      );

      const currentNode = {
        ...child,
        children,
        depth,
        parent,
        rootParent,
      };

      this.completeFlatOrderCategoriesTreeCompleted(currentNode);

      return currentNode;
    });
  }

  private completeFlatOrderCategoriesTreeCompleted(
    addingNode: CategoriesTreeNode
  ): void {
    if (!this.flatOrderCategoriesTreeCompleted) {
      this.flatOrderCategoriesTreeCompleted = {
        [addingNode.id]: [{ ...addingNode }],
      };

      return;
    }
    if (!this.flatOrderCategoriesTreeCompleted?.[addingNode.id]) {
      this.flatOrderCategoriesTreeCompleted[addingNode.id] = [];
    }
    this.flatOrderCategoriesTreeCompleted[addingNode.id]?.push({
      ...addingNode,
    });
  }

  private handleCategoriesNodesWithOneDepthChildren(): FlatCategoriesTreeNode[] {
    const categoriesNodesWithChildren: FlatCategoriesTreeNode[] =
      this.getCategories().filter((currentNode) => currentNode.children.length);

    const categoriesWithChildren: Categories[] =
      categoriesNodesWithChildren.map((node) => node.id);

    return categoriesNodesWithChildren.map((currentNode) => ({
      ...currentNode,
      children: currentNode.children.filter(
        (node) => !categoriesWithChildren.includes(node.id)
      ),
    }));
  }

  public getOrderRootFlatCategories(): FlatOrderCategoriesTreeNode[] {
    return this.orderRootFlatCategories;
  }

  public getCategoriesTreeNode(): CategoriesTreeNode[] {
    return this.categoriesTreeNode;
  }

  public getFlatOrderCategoriesTreeCompleted(): FlatCategoriesTreeNodeCompleted {
    return this.flatOrderCategoriesTreeCompleted;
  }

  // Leaves are nodes with no children
  public getCategoriesLeafNodes(): FlatCategoriesTreeNodeWithoutChildren[] {
    if (!this.categoriesLeafNodes) {
      this.categoriesLeafNodes = this.getCategories().filter(
        (currentNode) => currentNode.children.length === 0
      ) as FlatCategoriesTreeNodeWithoutChildren[];
    }
    return this.categoriesLeafNodes;
  }

  public getCategoriesLeaf(): Categories[] {
    if (!this.categoriesLeaf) {
      this.categoriesLeaf = this.getCategoriesLeafNodes().map(
        (node) => node.id
      );
    }
    return this.categoriesLeaf;
  }

  public getOrderRootCategoriesIds(): Categories[] {
    return this.orderRootCategoriesIds;
  }

  // CATEGORIES_NODES_WITH_ONE_DEPTH_CHILDREN
  public geCategoriesNodesWithOneDepthChildren(): FlatCategoriesTreeNode[] {
    return this.categoriesNodesWithOneDepthChildren;
  }

  public getCategories(): FlatCategoriesTreeNode[] {
    return this.categoriesByTheme;
  }

  public getFlatLeavesFromRootCategory(category: Categories): Categories[] {
    let categories: Categories[] = [];

    const categoryNodes = this.getFlatOrderCategoriesTreeCompleted()[category];

    if (categoryNodes && categoryNodes.length > 0) {
      for (const categoryNode of categoryNodes) {
        if (categoryNode.children?.length) {
          for (const childCategory of categoryNode.children) {
            categories = categories.concat(
              this.getFlatLeavesFromRootCategory(childCategory.id)
            );
          }
        } else {
          categories.push(categoryNode.id);
        }
      }
    }

    return categories;
  }

  public getFlatLeavesFromRootCategories(
    categories: Categories[]
  ): Categories[] {
    let leafCategories: Categories[] = [];

    for (const category of categories) {
      leafCategories = leafCategories.concat(
        this.getFlatLeavesFromRootCategory(category)
      );
    }

    leafCategories = [...new Set<Categories>(leafCategories)];

    return leafCategories;
  }

  public getParentsCategories(category: Categories): Categories[] | [] {
    const parentsList = this.getFlatOrderCategoriesTreeCompleted()[
      category
    ]?.map((c: CategoriesTreeNode) => c.parent);

    if (!parentsList?.length) {
      return [];
    }

    return (parentsList as Categories[]).filter((parent) => parent !== null);
  }

  public getRootParentsCategories(category: Categories): Categories[] | [] {
    return (
      this.getFlatOrderCategoriesTreeCompleted()[category]?.map(
        (c: CategoriesTreeNode) => c.rootParent
      ) ?? []
    );
  }

  public getFlatCategoryTreeNode(category: Categories): FlatCategoriesTreeNode {
    const flatCategoryTreeNode = this.getCategories().find(
      (categoryToCheck: FlatCategoriesTreeNode) =>
        categoryToCheck.id === category
    );

    if (flatCategoryTreeNode) {
      return flatCategoryTreeNode;
    } else {
      throw new Error(`Category "${category}" does not exist`);
    }
  }
}
