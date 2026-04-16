import { Categories } from "../../enums";
import {
  CategoriesService,
  getCategoriesService,
  sortByRank,
} from "../categories.service";

let categoriesService: CategoriesService;

beforeAll(() => {
  // getCategoriesService() because use initializeCategoriesByTheme(Themes.SOLIGUIDE_FR); in jest-setup.ts
  categoriesService = getCategoriesService();
});

describe("CategoriesService", () => {
  describe("getCategories", () => {
    it("should return the categories as an array", () => {
      const categories = categoriesService.getCategories();
      expect(Array.isArray(categories)).toBe(true);
      expect(categories.length).toBeGreaterThan(0);
    });
  });

  describe("getOrderRootCategoriesIds", () => {
    it("should return the ordered root categories ids", () => {
      const rootCategoriesIds = categoriesService.getOrderRootCategoriesIds();
      expect(Array.isArray(rootCategoriesIds)).toBe(true);
      expect(rootCategoriesIds.length).toBeGreaterThan(0);
      expect(rootCategoriesIds).toContain(Categories.WELCOME);
    });
  });

  describe("getCategoriesLeafNodes", () => {
    it("should return the categories leaf nodes", () => {
      const categoriesLeafNodes = categoriesService.getCategoriesLeafNodes();
      expect(Array.isArray(categoriesLeafNodes)).toBe(true);
      expect(categoriesLeafNodes.length).toBeGreaterThan(0);
      expect(categoriesLeafNodes[0].children.length).toEqual(0);
    });
  });

  describe("getCategoriesLeaf", () => {
    it("should return the categories leaf", () => {
      const categoriesLeaf = categoriesService.getCategoriesLeaf();
      expect(Array.isArray(categoriesLeaf)).toBe(true);
      expect(categoriesLeaf.length).toBeGreaterThan(0);
      expect(categoriesLeaf).toContain(Categories.FRENCH_COURSE);
      expect(categoriesLeaf).not.toContain(Categories.CATALAN_COURSE);
      expect(categoriesLeaf).not.toContain(Categories.SPANISH_COURSE);
    });
  });

  describe("geCategoriesNodesWithOneDepthChildren", () => {
    it("should return the categories nodes with one depth children", () => {
      const categoriesNodesWithOneDepthChildren =
        categoriesService.geCategoriesNodesWithOneDepthChildren();
      expect(Array.isArray(categoriesNodesWithOneDepthChildren)).toBe(true);
      expect(categoriesNodesWithOneDepthChildren.length).toBeGreaterThan(0);
      expect(
        categoriesNodesWithOneDepthChildren[0].children.length
      ).toBeGreaterThan(0);
      expect(categoriesNodesWithOneDepthChildren[0].children[0].id).toEqual(
        Categories.DAY_HOSTING
      );
    });

    it("should not contain nodes with empty children", () => {
      const nodes =
        categoriesService.geCategoriesNodesWithOneDepthChildren();
      for (const node of nodes) {
        expect(node.children.length).toBeGreaterThan(0);
      }
    });

    it("should not include HEALTH since all its children have sub-children", () => {
      const nodes =
        categoriesService.geCategoriesNodesWithOneDepthChildren();
      const nodeIds = nodes.map((n) => n.id);
      expect(nodeIds).not.toContain(Categories.HEALTH);
    });

    it("should include intermediate health categories as separate groups", () => {
      const nodes =
        categoriesService.geCategoriesNodesWithOneDepthChildren();
      const nodeIds = nodes.map((n) => n.id);
      expect(nodeIds).toContain(Categories.PHYSICAL_HEALTH);
      expect(nodeIds).toContain(Categories.MENTAL_HEALTH);
      expect(nodeIds).toContain(Categories.HEALTH_SPECIALISTS);
      expect(nodeIds).toContain(Categories.SEXUAL_HEALTH);
      expect(nodeIds).toContain(Categories.PARENTHOOD);
      expect(nodeIds).toContain(Categories.ADDICTIONS);
    });

    it("should show multi-parental categories under each parent group", () => {
      const nodes =
        categoriesService.geCategoriesNodesWithOneDepthChildren();

      const mentalHealth = nodes.find(
        (n) => n.id === Categories.MENTAL_HEALTH
      );
      const healthSpecialists = nodes.find(
        (n) => n.id === Categories.HEALTH_SPECIALISTS
      );

      const mentalHealthChildIds = mentalHealth?.children.map((c) => c.id);
      const healthSpecialistsChildIds = healthSpecialists?.children.map(
        (c) => c.id
      );

      // PSYCHIATRY should appear under both groups
      expect(mentalHealthChildIds).toContain(Categories.PSYCHIATRY);
      expect(healthSpecialistsChildIds).toContain(Categories.PSYCHIATRY);

      // PSYCHOLOGICAL_SUPPORT should appear under both groups
      expect(mentalHealthChildIds).toContain(Categories.PSYCHOLOGICAL_SUPPORT);
      expect(healthSpecialistsChildIds).toContain(
        Categories.PSYCHOLOGICAL_SUPPORT
      );
    });
  });

  describe("sortByRank", () => {
    it("should sort an array of objects by rank in ascending order", () => {
      const input = [
        { name: "John", rank: 3 },
        { name: "Jane", rank: 1 },
        { name: "Bob", rank: 2 },
      ];
      const expectedOutput = [
        { name: "Jane", rank: 1 },
        { name: "Bob", rank: 2 },
        { name: "John", rank: 3 },
      ];
      expect(sortByRank(input)).toEqual(expectedOutput);
    });

    it("should return an empty array if given an empty array", () => {
      expect(sortByRank([])).toEqual([]);
    });

    it("should return the same array if given an array with one element", () => {
      const input = [{ name: "John", rank: 1 }];
      expect(sortByRank(input)).toEqual(input);
    });
  });
});

describe("Get leaves categories from root category", () => {
  it("should return the category itself if it has no children", () => {
    expect(
      categoriesService.getFlatLeavesFromRootCategory(Categories.ALLERGOLOGY)
    ).toStrictEqual([Categories.ALLERGOLOGY]);
  });

  it("should return unique leaves without duplicates for multi-parental categories", () => {
    // PSYCHIATRY has 2 parents (MENTAL_HEALTH and HEALTH_SPECIALISTS)
    // but should only appear once
    expect(
      categoriesService.getFlatLeavesFromRootCategory(Categories.PSYCHIATRY)
    ).toStrictEqual([Categories.PSYCHIATRY]);
  });

  it("should return the deepest children found for HEALTH_SPECIALISTS", () => {
    expect(
      categoriesService.getFlatLeavesFromRootCategory(
        Categories.HEALTH_SPECIALISTS
      )
    ).toStrictEqual([
      Categories.ALLERGOLOGY,
      Categories.CARDIOLOGY,
      Categories.DERMATOLOGY,
      Categories.ENDOCRINOLOGY,
      Categories.GASTROENTEROLOGY,
      Categories.KINESITHERAPY,
      Categories.OTORHINOLARYNGOLOGY,
      Categories.SPEECH_THERAPY,
      Categories.OSTEOPATHY,
      Categories.PEDICURE,
      Categories.PHLEBOLOGY,
      Categories.PNEUMOLOGY,
      Categories.PSYCHIATRY,
      Categories.PSYCHOLOGICAL_SUPPORT,
      Categories.RADIOLOGY,
      Categories.RHEUMATOLOGY,
      Categories.STOMATOLOGY,
      Categories.UROLOGY,
      Categories.VET_CARE,
    ]);
  });

  it("should return all unique leaf descendants for HEALTH", () => {
    const leaves = categoriesService.getFlatLeavesFromRootCategory(
      Categories.HEALTH
    );

    expect(leaves).toStrictEqual([
      Categories.HEALTH_COVERAGE,
      Categories.FIND_HEALTHCARE,
      Categories.GENERAL_PRACTITIONER,
      Categories.HEALTH_ASSESSMENT,
      Categories.CHILD_CARE,
      Categories.DENTAL_CARE,
      Categories.OPTICAL_CARE,
      Categories.HEARING_CARE,
      Categories.INFIRMARY,
      Categories.VACCINATION,
      Categories.STD_TESTING,
      Categories.CHRONIC_DISEASES,
      Categories.NUTRITION,
      Categories.MEDICAL_ACCOMMODATION,
      Categories.PSYCHOLOGICAL_SUPPORT,
      Categories.PSYCHIATRY,
      Categories.SUPPORT_GROUPS,
      Categories.MENTAL_HEALTH_EDUCATION,
      Categories.THERAPEUTIC_ACTIVITIES,
      Categories.ADDICTION_CARE,
      Categories.ADDICTION_PREVENTION_AND_MATERIAL,
      Categories.EMERGENCY_CONTRACEPTION,
      Categories.ABORTION,
      Categories.CONTRACEPTION,
      Categories.GYNECOLOGY,
      Categories.STI_PREVENTION_TESTING,
      Categories.HIV_PREVENTION,
      Categories.SEXUAL_HEALTH_VACCINATION,
      Categories.SEXUAL_HEALTH_EDUCATION,
      Categories.SEXUAL_VIOLENCE_SUPPORT,
      Categories.AFFECTIVE_LIFE,
      Categories.PREGNANCY_CARE,
      Categories.PARENT_ASSISTANCE,
      Categories.ALLERGOLOGY,
      Categories.CARDIOLOGY,
      Categories.DERMATOLOGY,
      Categories.ENDOCRINOLOGY,
      Categories.GASTROENTEROLOGY,
      Categories.KINESITHERAPY,
      Categories.OTORHINOLARYNGOLOGY,
      Categories.SPEECH_THERAPY,
      Categories.OSTEOPATHY,
      Categories.PEDICURE,
      Categories.PHLEBOLOGY,
      Categories.PNEUMOLOGY,
      Categories.RADIOLOGY,
      Categories.RHEUMATOLOGY,
      Categories.STOMATOLOGY,
      Categories.UROLOGY,
      Categories.VET_CARE,
    ]);

    // No duplicates: multi-parental categories appear only once
    expect(leaves.length).toBe(new Set(leaves).size);
  });
});

describe("Get leaves categories from root categories", () => {
  it("should return all leaves as unique across multiple root categories", () => {
    const result = categoriesService.getFlatLeavesFromRootCategories([
      Categories.INFORMATION_POINT,
      Categories.HEALTH,
      Categories.HEALTH_SPECIALISTS,
    ]);

    // INFORMATION_POINT is a leaf itself
    expect(result).toContain(Categories.INFORMATION_POINT);
    // HEALTH leaves should be included
    expect(result).toContain(Categories.GENERAL_PRACTITIONER);
    expect(result).toContain(Categories.PSYCHIATRY);
    // HEALTH_SPECIALISTS leaves overlap with HEALTH — no duplicates
    expect(result).toContain(Categories.ALLERGOLOGY);
    expect(result.length).toBe(new Set(result).size);
  });

  it("should return an empty array if an empty array is in parameters", () => {
    expect(categoriesService.getFlatLeavesFromRootCategories([])).toStrictEqual(
      []
    );
  });
});

describe("Category parents getter", () => {
  it("should return a single parent for categories with one parent", () => {
    expect(
      categoriesService.getParentsCategories(Categories.NUTRITION)
    ).toStrictEqual([Categories.PHYSICAL_HEALTH]);
  });

  it("should return multiple parents for multi-parental categories", () => {
    expect(
      categoriesService.getParentsCategories(Categories.PSYCHIATRY)
    ).toStrictEqual([Categories.MENTAL_HEALTH, Categories.HEALTH_SPECIALISTS]);

    expect(
      categoriesService.getParentsCategories(Categories.CHILD_CARE)
    ).toStrictEqual([Categories.PHYSICAL_HEALTH, Categories.PARENTHOOD]);

    expect(
      categoriesService.getParentsCategories(Categories.PARENT_ASSISTANCE)
    ).toStrictEqual([Categories.COUNSELING, Categories.PARENTHOOD]);
  });

  it("should return deduplicated root parents", () => {
    // PSYCHIATRY is under MENTAL_HEALTH and HEALTH_SPECIALISTS, both under HEALTH
    expect(
      categoriesService.getRootParentsCategories(Categories.PSYCHIATRY)
    ).toStrictEqual([Categories.HEALTH]);

    // PARENT_ASSISTANCE crosses two root categories
    expect(
      categoriesService.getRootParentsCategories(Categories.PARENT_ASSISTANCE)
    ).toStrictEqual([Categories.COUNSELING, Categories.HEALTH]);
  });

  it("should return direct parent for level-1 categories", () => {
    expect(
      categoriesService.getParentsCategories(Categories.HEALTH_SPECIALISTS)
    ).toStrictEqual([Categories.HEALTH]);

    expect(
      categoriesService.getRootParentsCategories(Categories.HEALTH_SPECIALISTS)
    ).toStrictEqual([Categories.HEALTH]);
  });

  it("should return empty for root categories parents", () => {
    expect(
      categoriesService.getParentsCategories(Categories.HEALTH)
    ).toStrictEqual([]);
  });

  it("should return itself as root parent for root categories", () => {
    expect(
      categoriesService.getRootParentsCategories(Categories.HEALTH)
    ).toStrictEqual([Categories.HEALTH]);
  });
});

describe("Category node getter", () => {
  it("should return the good category node", () => {
    expect(
      categoriesService.getFlatCategoryTreeNode(Categories.ACTIVITIES)
    ).toStrictEqual({
      id: Categories.ACTIVITIES,
      children: [
        {
          id: Categories.SPORT_ACTIVITIES,
          rank: 100,
        },
        {
          id: Categories.MUSEUMS,
          rank: 200,
        },
        {
          id: Categories.LIBRARIES,
          rank: 300,
        },
        {
          id: Categories.OTHER_ACTIVITIES,
          rank: 400,
        },
      ],
    });
  });

  it("should throw an error if the category doesn't exist", () => {
    try {
      categoriesService.getFlatCategoryTreeNode("foo" as Categories);
    } catch (e) {
      if (e instanceof Error) {
        expect(e.message).toEqual('Category "foo" does not exist');
      }
    }
  });
});

describe("hasChildren", () => {
  it("should return true for categories with children", () => {
    expect(categoriesService.hasChildren(Categories.HEALTH)).toBe(true);
    expect(categoriesService.hasChildren(Categories.PHYSICAL_HEALTH)).toBe(
      true
    );
    expect(categoriesService.hasChildren(Categories.MENTAL_HEALTH)).toBe(true);
  });

  it("should return false for leaf categories", () => {
    expect(categoriesService.hasChildren(Categories.PSYCHIATRY)).toBe(false);
    expect(categoriesService.hasChildren(Categories.ALLERGOLOGY)).toBe(false);
  });
});
