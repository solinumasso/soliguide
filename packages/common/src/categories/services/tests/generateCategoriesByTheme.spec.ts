import { Themes } from "../../../themes";
import { Categories } from "../../enums";
import { FlatCategoriesTreeNode } from "../../interfaces";
import { generateCategoriesByTheme } from "../generateCategoriesByTheme";

describe("Country-specific categories", () => {
  const spanishResults: FlatCategoriesTreeNode[] =
    generateCategoriesByTheme(Themes.SOLIGUIA_ES);
  const andorraResults: FlatCategoriesTreeNode[] =
    generateCategoriesByTheme(Themes.SOLIGUIA_AD);
  const frenchResults: FlatCategoriesTreeNode[] =
    generateCategoriesByTheme(Themes.SOLIGUIDE_FR);

  it("should include Spanish-specific categories in Spanish theme", () => {
    const spanishCategories = spanishResults.filter(
      (category: FlatCategoriesTreeNode) =>
        category.id === Categories.SPANISH_COURSE
    );

    expect(spanishCategories.length).toBeGreaterThan(0);

    const frenchCourseCategories = spanishResults.filter(
      (category: FlatCategoriesTreeNode) =>
        category.id === Categories.FRENCH_COURSE
    );

    expect(frenchCourseCategories.length).toBe(0);
    // Check if Spanish course is correctly linked to Training and Jobs category
    const trainingCategory = spanishResults.find(
      (category: FlatCategoriesTreeNode) =>
        category.id === Categories.TRAINING_AND_JOBS
    );

    expect(trainingCategory).toBeDefined();

    if (trainingCategory) {
      expect(
        trainingCategory.children.some(
          (child) => child.id === Categories.SPANISH_COURSE
        )
      ).toBeTruthy();
    }
  });

  it("should include Catalan course in Spanish theme", () => {
    const catalanInSpanish = andorraResults.filter(
      (category: FlatCategoriesTreeNode) =>
        category.id === Categories.CATALAN_COURSE
    );

    expect(catalanInSpanish.length).toBeGreaterThan(0);
  });

  it("should include Catalan course in Andorra theme", () => {
    const results = generateCategoriesByTheme(Themes.SOLIGUIA_AD);

    const catalanInAndorra = results.filter(
      (category: FlatCategoriesTreeNode) =>
        category.id === Categories.CATALAN_COURSE
    );

    expect(catalanInAndorra.length).toBeGreaterThan(0);
  });

  it("should include Spanish course in Andorra theme", () => {
    const results = generateCategoriesByTheme(Themes.SOLIGUIA_AD);

    // Check that Spanish course exists in Andorra theme
    const spanishInAndorra = results.filter(
      (category: FlatCategoriesTreeNode) =>
        category.id === Categories.SPANISH_COURSE
    );

    expect(spanishInAndorra.length).toBeGreaterThan(0);
  });

  it("should include Legal protection ONLY in Andorra theme", () => {
    // Check if Legal Protection is correctly linked to Counseling category
    const counselingCategory = andorraResults.find(
      (category: FlatCategoriesTreeNode) =>
        category.id === Categories.COUNSELING
    );

    expect(counselingCategory).toBeDefined();

    // Check that Legal protection exists in Andorra theme
    const legalProtectionInAndorra = counselingCategory?.children.find(
      (category) => category.id === Categories.LEGAL_PROTECTION
    );
    expect(legalProtectionInAndorra).toBeDefined();

    const spanishCouneling = spanishResults.find(
      (category: FlatCategoriesTreeNode) =>
        category.id === Categories.COUNSELING
    );

    const legalProtectionInSpain = spanishCouneling?.children.find(
      (category) => category.id === Categories.LEGAL_PROTECTION
    );

    expect(legalProtectionInSpain).toBeUndefined();

    // Verify Legal Protection does NOT exist in French theme
    const legalProtectionInFrench = frenchResults.filter(
      (category: FlatCategoriesTreeNode) =>
        category.id === Categories.LEGAL_PROTECTION
    );
    expect(legalProtectionInFrench.length).toBe(0);
  });

  it("should include Domiciliation ONLY in France theme", () => {
    const domiciliationInAndorra = andorraResults.find(
      (category: FlatCategoriesTreeNode) =>
        category.id === Categories.DOMICILIATION
    );

    expect(domiciliationInAndorra).toBeUndefined();

    const domiciliationInSpain = spanishResults.find(
      (category: FlatCategoriesTreeNode) =>
        category.id === Categories.DOMICILIATION
    );

    expect(domiciliationInSpain).toBeUndefined();

    const domiciliationInFrance = frenchResults.find(
      (category: FlatCategoriesTreeNode) =>
        category.id === Categories.DOMICILIATION
    );

    expect(domiciliationInFrance).toBeDefined();
  });
});
