import { ROOT_CATEGORIES } from "../constants";
import {
  CategoriesGraph,
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
import {
  buildGraphByTheme,
  generateCategoriesByTheme,
} from "./generateCategoriesByTheme";

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

/**
 * Central service for navigating and querying the categories DAG.
 *
 * Architecture overview:
 * - Source of truth: CategoriesGraph (adjacency list, built per theme)
 * - Pre-computed indices: parents, rootParents, leafDescendants, leaves
 *   All indices are built once at construction and reused for O(1) lookups.
 * - Backward compatibility: FlatCategoriesTreeNode[] and CategoriesTreeNode[]
 *   are still generated for consumers that depend on the legacy formats.
 *
 * The public API is unchanged — all existing consumers work without modification.
 */
export class CategoriesService {
  // ── Source data ─────────────────────────────────────────────────────────
  /** The merged DAG for the current theme */
  private readonly graph: CategoriesGraph;
  /** Legacy flat format, kept for backward compatibility with getCategories() */
  private readonly categoriesByTheme: FlatCategoriesTreeNode[];

  // ── Pre-computed DAG indices (built once at construction) ───────────────
  /** category → list of direct parent categories */
  private readonly parentsIndex: Map<Categories, Categories[]>;
  /** category → list of root ancestor categories (deduplicated) */
  private readonly rootParentsIndex: Map<Categories, Categories[]>;
  /** category → all leaf descendants (deduplicated, ordered by graph traversal) */
  private readonly leafDescendantsIndex: Map<Categories, Categories[]>;
  /** Set of all leaf categories (no children in the graph) */
  private readonly leavesSet: Set<Categories>;

  // ── Legacy tree structures (for existing consumers) ────────────────────
  private flatOrderCategoriesTreeCompleted!: FlatCategoriesTreeNodeCompleted;
  private readonly orderRootFlatCategories!: FlatOrderCategoriesTreeNode[];
  private readonly orderRootCategories!: ChildCategory[];
  private readonly orderRootCategoriesIds!: Categories[];
  private readonly categoriesTreeNode!: CategoriesTreeNode[];
  private readonly categoriesNodesWithOneDepthChildren!: FlatCategoriesTreeNode[];

  constructor(theme: Themes | null = null, packageType = PackageType.FRONT) {
    // Build the DAG and the flat format for backward compatibility
    this.graph = buildGraphByTheme(theme);
    this.categoriesByTheme = generateCategoriesByTheme(theme);

    // Pre-compute all DAG indices
    this.leavesSet = this.computeLeaves();
    this.parentsIndex = this.computeParentsIndex();
    this.rootParentsIndex = this.computeRootParentsIndex();
    this.leafDescendantsIndex = this.computeLeafDescendantsIndex();

    // Build legacy tree structures (still needed by some consumers)
    this.orderRootCategories = getOrderRootCategories();
    [this.orderRootCategoriesIds, this.orderRootFlatCategories] =
      this.handleRootCategories();
    this.categoriesTreeNode = this.buildTree();

    if (packageType === PackageType.FRONT) {
      this.categoriesNodesWithOneDepthChildren =
        this.computeNodesWithLeafChildren();
    }
  }

  // ════════════════════════════════════════════════════════════════════════
  // DAG INDEX BUILDERS (private, called once at construction)
  // ════════════════════════════════════════════════════════════════════════

  /**
   * Discovers all leaf categories in the DAG.
   * A leaf is any category that appears as a child but has no entry
   * (or an empty entry) in the graph.
   */
  private computeLeaves(): Set<Categories> {
    const allNodes = new Set<Categories>();

    // Collect every category that appears anywhere in the graph
    for (const [parentId, children] of Object.entries(this.graph)) {
      allNodes.add(parentId as Categories);
      for (const child of children as ChildCategory[]) {
        allNodes.add(child.id);
      }
    }

    const leaves = new Set<Categories>();
    for (const nodeId of allNodes) {
      const children = this.graph[nodeId];
      if (!children || children.length === 0) {
        leaves.add(nodeId);
      }
    }

    return leaves;
  }

  /**
   * Builds the reverse index: for each category, which are its direct parents?
   * Iterates all edges in the graph once → O(E).
   */
  private computeParentsIndex(): Map<Categories, Categories[]> {
    const index = new Map<Categories, Categories[]>();

    for (const [parentId, children] of Object.entries(this.graph)) {
      for (const child of children as ChildCategory[]) {
        if (!index.has(child.id)) {
          index.set(child.id, []);
        }
        index.get(child.id)!.push(parentId as Categories);
      }
    }

    return index;
  }

  /**
   * Computes the root ancestor(s) for every category using BFS upward.
   * A root category is one that appears in ROOT_CATEGORIES.
   * Multi-parental categories may have multiple root ancestors (deduplicated).
   */
  private computeRootParentsIndex(): Map<Categories, Categories[]> {
    const rootSet = new Set<Categories>(
      ROOT_CATEGORIES.map((rc) => rc.id)
    );
    const index = new Map<Categories, Categories[]>();

    const findRoots = (category: Categories): Categories[] => {
      if (index.has(category)) {
        return index.get(category)!;
      }

      // Root categories are their own root parent
      if (rootSet.has(category)) {
        index.set(category, [category]);
        return [category];
      }

      const parents = this.parentsIndex.get(category);
      if (!parents?.length) {
        // Orphan node — should not happen in a valid graph
        index.set(category, []);
        return [];
      }

      const roots = new Set<Categories>();
      for (const parent of parents) {
        for (const root of findRoots(parent)) {
          roots.add(root);
        }
      }

      const result = [...roots];
      index.set(category, result);
      return result;
    };

    // Compute for all known categories
    for (const nodeId of this.getAllNodeIds()) {
      findRoots(nodeId);
    }

    return index;
  }

  /**
   * Pre-computes all leaf descendants for every category.
   * Uses DFS with a visited set to handle multi-parental nodes correctly.
   */
  private computeLeafDescendantsIndex(): Map<Categories, Categories[]> {
    const index = new Map<Categories, Categories[]>();

    const collectLeaves = (category: Categories): Categories[] => {
      if (index.has(category)) {
        return index.get(category)!;
      }

      // Leaf node: its own descendant set is just itself
      if (this.leavesSet.has(category)) {
        index.set(category, [category]);
        return [category];
      }

      const children = this.graph[category];
      if (!children?.length) {
        index.set(category, [category]);
        return [category];
      }

      // Collect leaves from all children, preserving order and deduplicating
      const result: Categories[] = [];
      const seen = new Set<Categories>();

      for (const child of children) {
        for (const leaf of collectLeaves(child.id)) {
          if (!seen.has(leaf)) {
            seen.add(leaf);
            result.push(leaf);
          }
        }
      }

      index.set(category, result);
      return result;
    };

    for (const nodeId of this.getAllNodeIds()) {
      collectLeaves(nodeId);
    }

    return index;
  }

  /**
   * Returns all unique category IDs present in the graph
   * (both as parents and as children).
   */
  private getAllNodeIds(): Categories[] {
    const nodes = new Set<Categories>();
    for (const [parentId, children] of Object.entries(this.graph)) {
      nodes.add(parentId as Categories);
      for (const child of children as ChildCategory[]) {
        nodes.add(child.id);
      }
    }
    return [...nodes];
  }

  // ════════════════════════════════════════════════════════════════════════
  // LEGACY TREE BUILDERS (for backward compatibility)
  // ════════════════════════════════════════════════════════════════════════

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

  /**
   * Builds the full CategoriesTreeNode[] tree from root nodes downward.
   * Also populates flatOrderCategoriesTreeCompleted as a side effect
   * (needed by getCategoriesTreeNode() and getFlatOrderCategoriesTreeCompleted()).
   */
  private buildTree(): CategoriesTreeNode[] {
    const parent: Categories | null = null;

    return this.orderRootFlatCategories.map((rootNode): CategoriesTreeNode => {
      const currentRootParent = rootNode.id;

      const currentNode = {
        id: rootNode.id,
        depth: ROOT_DEPTH,
        parent,
        rank: rootNode.rank,
        children: this.buildChildrenTree(
          rootNode.children,
          ROOT_DEPTH,
          currentRootParent,
          currentRootParent
        ),
        rootParent: currentRootParent,
      };

      this.addToFlatCompleted(currentNode);
      return currentNode;
    });
  }

  private buildChildrenTree(
    children: ChildCategory[],
    depth: number,
    parent: Categories | null,
    rootParent: Categories
  ): CategoriesTreeNode[] {
    if (!children.length) {
      return [];
    }

    const childDepth = depth + 1;

    return children.map((child) => {
      const catNode = this.categoriesByTheme.find(
        (cat) => child.id === cat.id
      );
      let nodeOrderChildren = catNode?.children ?? [];
      if (nodeOrderChildren.length) {
        nodeOrderChildren = sortByRank(nodeOrderChildren);
      }

      const childrenNodes = this.buildChildrenTree(
        nodeOrderChildren,
        childDepth,
        child.id,
        rootParent
      );

      const currentNode = {
        ...child,
        children: childrenNodes,
        depth: childDepth,
        parent,
        rootParent,
      };

      this.addToFlatCompleted(currentNode);
      return currentNode;
    });
  }

  private addToFlatCompleted(node: CategoriesTreeNode): void {
    if (!this.flatOrderCategoriesTreeCompleted) {
      this.flatOrderCategoriesTreeCompleted = {
        [node.id]: [{ ...node }],
      };
      return;
    }
    if (!this.flatOrderCategoriesTreeCompleted[node.id]) {
      this.flatOrderCategoriesTreeCompleted[node.id] = [];
    }
    this.flatOrderCategoriesTreeCompleted[node.id]!.push({ ...node });
  }

  /**
   * Builds the list of categories that have only leaf children.
   * Used by the frontend to render one-depth category pickers.
   *
   * For categories where ALL direct children have sub-children (e.g. HEALTH),
   * those categories are excluded — their intermediate children become the
   * visible groups instead.
   */
  private computeNodesWithLeafChildren(): FlatCategoriesTreeNode[] {
    const nodesWithChildren: FlatCategoriesTreeNode[] = this
      .getCategories()
      .filter((node) => node.children.length);

    const parentIds = new Set<Categories>(
      nodesWithChildren.map((node) => node.id)
    );

    return nodesWithChildren
      .map((node) => ({
        ...node,
        children: node.children.filter(
          (child) => !parentIds.has(child.id)
        ),
      }))
      .filter((node) => node.children.length > 0);
  }

  // ════════════════════════════════════════════════════════════════════════
  // PUBLIC API (signatures unchanged for backward compatibility)
  // ════════════════════════════════════════════════════════════════════════

  public getOrderRootFlatCategories(): FlatOrderCategoriesTreeNode[] {
    return this.orderRootFlatCategories;
  }

  public getCategoriesTreeNode(): CategoriesTreeNode[] {
    return this.categoriesTreeNode;
  }

  public getFlatOrderCategoriesTreeCompleted(): FlatCategoriesTreeNodeCompleted {
    return this.flatOrderCategoriesTreeCompleted;
  }

  /** Returns all leaf categories as FlatCategoriesTreeNode objects. */
  public getCategoriesLeafNodes(): FlatCategoriesTreeNodeWithoutChildren[] {
    return this.getCategories().filter(
      (node) => node.children.length === 0
    ) as FlatCategoriesTreeNodeWithoutChildren[];
  }

  /** Returns all leaf category IDs. */
  public getCategoriesLeaf(): Categories[] {
    return [...this.leavesSet];
  }

  /** Checks if a category has children in the DAG. */
  public hasChildren(categoryId: Categories): boolean {
    const children = this.graph[categoryId];
    return Boolean(children?.length);
  }

  public getOrderRootCategoriesIds(): Categories[] {
    return this.orderRootCategoriesIds;
  }

  /** Returns categories that have only leaf children (for frontend pickers). */
  public geCategoriesNodesWithOneDepthChildren(): FlatCategoriesTreeNode[] {
    return this.categoriesNodesWithOneDepthChildren;
  }

  /** Returns the flat categories list (backward-compatible format). */
  public getCategories(): FlatCategoriesTreeNode[] {
    return this.categoriesByTheme;
  }

  /**
   * Returns all unique leaf descendants of a category.
   * O(1) lookup from pre-computed index.
   */
  public getFlatLeavesFromRootCategory(category: Categories): Categories[] {
    return this.leafDescendantsIndex.get(category) ?? [];
  }

  /**
   * Returns all unique leaf descendants across multiple categories.
   * Deduplicates across all inputs.
   */
  public getFlatLeavesFromRootCategories(
    categories: Categories[]
  ): Categories[] {
    const result = new Set<Categories>();

    for (const category of categories) {
      for (const leaf of this.getFlatLeavesFromRootCategory(category)) {
        result.add(leaf);
      }
    }

    return [...result];
  }

  /**
   * Returns direct parent(s) of a category.
   * Multi-parental categories return multiple parents.
   */
  public getParentsCategories(category: Categories): Categories[] {
    return this.parentsIndex.get(category) ?? [];
  }

  /**
   * Returns deduplicated root ancestor(s) of a category.
   * For categories under a single root: returns [rootId].
   * For cross-root categories (e.g. PARENT_ASSISTANCE): returns multiple roots.
   */
  public getRootParentsCategories(category: Categories): Categories[] {
    return this.rootParentsIndex.get(category) ?? [];
  }

  /** Returns the flat node for a given category, or throws if not found. */
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
