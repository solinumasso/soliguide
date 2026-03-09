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

  it("should return the deepest children found", () => {
    expect(
      categoriesService.getFlatLeavesFromRootCategory(
        Categories.HEALTH_SPECIALISTS
      )
    ).toStrictEqual([
      Categories.ALLERGOLOGY,
      Categories.CARDIOLOGY,
      Categories.DERMATOLOGY,
      Categories.ECHOGRAPHY,
      Categories.ENDOCRINOLOGY,
      Categories.GASTROENTEROLOGY,
      Categories.GYNECOLOGY,
      Categories.KINESITHERAPY,
      Categories.MAMMOGRAPHY,
      Categories.OPHTHALMOLOGY,
      Categories.OTORHINOLARYNGOLOGY,
      Categories.NUTRITION,
      Categories.PEDICURE,
      Categories.PHLEBOLOGY,
      Categories.PNEUMOLOGY,
      Categories.RADIOLOGY,
      Categories.RHEUMATOLOGY,
      Categories.UROLOGY,
      Categories.SPEECH_THERAPY,
      Categories.STOMATOLOGY,
      Categories.OSTEOPATHY,
      Categories.ACUPUNCTURE,
    ]);

    expect(
      categoriesService.getFlatLeavesFromRootCategory(Categories.HEALTH)
    ).toStrictEqual([
      Categories.ADDICTION,
      Categories.STD_TESTING,
      Categories.PSYCHOLOGICAL_SUPPORT,
      Categories.CHILD_CARE,
      Categories.GENERAL_PRACTITIONER,
      Categories.DENTAL_CARE,
      Categories.PREGNANCY_CARE,
      Categories.VACCINATION,
      Categories.INFIRMARY,
      Categories.VET_CARE,
      Categories.ALLERGOLOGY,
      Categories.CARDIOLOGY,
      Categories.DERMATOLOGY,
      Categories.ECHOGRAPHY,
      Categories.ENDOCRINOLOGY,
      Categories.GASTROENTEROLOGY,
      Categories.GYNECOLOGY,
      Categories.KINESITHERAPY,
      Categories.MAMMOGRAPHY,
      Categories.OPHTHALMOLOGY,
      Categories.OTORHINOLARYNGOLOGY,
      Categories.NUTRITION,
      Categories.PEDICURE,
      Categories.PHLEBOLOGY,
      Categories.PNEUMOLOGY,
      Categories.RADIOLOGY,
      Categories.RHEUMATOLOGY,
      Categories.UROLOGY,
      Categories.SPEECH_THERAPY,
      Categories.STOMATOLOGY,
      Categories.OSTEOPATHY,
      Categories.ACUPUNCTURE,
    ]);
  });
});

describe("Get leaves categories from root categories", () => {
  it("should return all root categories as unique", () => {
    expect(
      categoriesService.getFlatLeavesFromRootCategories([
        Categories.INFORMATION_POINT,
        Categories.HEALTH,
        Categories.HEALTH_SPECIALISTS,
      ])
    ).toStrictEqual([
      Categories.INFORMATION_POINT,
      Categories.ADDICTION,
      Categories.STD_TESTING,
      Categories.PSYCHOLOGICAL_SUPPORT,
      Categories.CHILD_CARE,
      Categories.GENERAL_PRACTITIONER,
      Categories.DENTAL_CARE,
      Categories.PREGNANCY_CARE,
      Categories.VACCINATION,
      Categories.INFIRMARY,
      Categories.VET_CARE,
      Categories.ALLERGOLOGY,
      Categories.CARDIOLOGY,
      Categories.DERMATOLOGY,
      Categories.ECHOGRAPHY,
      Categories.ENDOCRINOLOGY,
      Categories.GASTROENTEROLOGY,
      Categories.GYNECOLOGY,
      Categories.KINESITHERAPY,
      Categories.MAMMOGRAPHY,
      Categories.OPHTHALMOLOGY,
      Categories.OTORHINOLARYNGOLOGY,
      Categories.NUTRITION,
      Categories.PEDICURE,
      Categories.PHLEBOLOGY,
      Categories.PNEUMOLOGY,
      Categories.RADIOLOGY,
      Categories.RHEUMATOLOGY,
      Categories.UROLOGY,
      Categories.SPEECH_THERAPY,
      Categories.STOMATOLOGY,
      Categories.OSTEOPATHY,
      Categories.ACUPUNCTURE,
    ]);
  });

  it("should return an emtpy array if an empty array is in parameters", () => {
    expect(categoriesService.getFlatLeavesFromRootCategories([])).toStrictEqual(
      []
    );
  });
});

describe("Category parents getter", () => {
  it("should return categories parent", () => {
    expect(
      categoriesService.getParentsCategories(Categories.ACUPUNCTURE)
    ).toStrictEqual([Categories.HEALTH_SPECIALISTS]);
    expect(
      categoriesService.getRootParentsCategories(Categories.ACUPUNCTURE)
    ).toStrictEqual([Categories.HEALTH]);
    expect(
      categoriesService.getParentsCategories(Categories.HEALTH_SPECIALISTS)
    ).toStrictEqual([Categories.HEALTH]);
    expect(
      categoriesService.getRootParentsCategories(Categories.HEALTH_SPECIALISTS)
    ).toStrictEqual([Categories.HEALTH]);
    expect(
      categoriesService.getParentsCategories(Categories.HEALTH)
    ).toStrictEqual([]);
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
