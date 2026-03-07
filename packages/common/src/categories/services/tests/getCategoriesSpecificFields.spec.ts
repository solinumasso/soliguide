import { CountryCodes } from "../../../location";
import { CATEGORIES_SPECIFIC_FIELDS_CATEGORY_MAPPING } from "../../constants";
import { Categories } from "../../enums";
import { getCategoriesSpecificFields } from "../getCategoriesSpecificFields";

describe("getCategoriesSpecificFields", () => {
  it("should return original mapping when country is FR", () => {
    const result = getCategoriesSpecificFields(CountryCodes.FR);
    expect(result).toEqual(CATEGORIES_SPECIFIC_FIELDS_CATEGORY_MAPPING);
  });

  it("should remove specified fields for non-FR countries", () => {
    const result = getCategoriesSpecificFields(CountryCodes.ES);

    // Test a few specific categories that should have fields removed
    expect(result[Categories.FOOD_PACKAGES]).not.toContain(
      "nationalOriginProductType"
    );
    expect(result[Categories.FOOD_PACKAGES]).not.toContain(
      "organicOriginProductType"
    );
    expect(result[Categories.COOKING_WORKSHOP]).not.toContain(
      "nationalOriginProductType"
    );
    expect(result[Categories.COOKING_WORKSHOP]).not.toContain(
      "organicOriginProductType"
    );
  });

  it("should preserve other fields for non-FR countries", () => {
    const result = getCategoriesSpecificFields(CountryCodes.ES);

    // Check that other fields are preserved
    expect(result[Categories.FOOD_PACKAGES]).toContain("foodProductType");
    expect(result[Categories.FOOD_PACKAGES]).toContain("dietaryRegimesType");
    expect(result[Categories.COOKING_WORKSHOP]).toContain("dietaryRegimesType");
    expect(result[Categories.COOKING_WORKSHOP]).toContain(
      "dietaryAdaptationsType"
    );
  });

  it("should maintain categories without restricted fields unchanged", () => {
    const result = getCategoriesSpecificFields(CountryCodes.AD);

    expect(result[Categories.FRENCH_COURSE]).toEqual(
      CATEGORIES_SPECIFIC_FIELDS_CATEGORY_MAPPING[Categories.FRENCH_COURSE]
    );
    expect(result[Categories.WELLNESS]).toEqual(
      CATEGORIES_SPECIFIC_FIELDS_CATEGORY_MAPPING[Categories.WELLNESS]
    );
  });

  it("should handle empty or undefined fields correctly", () => {
    const mockMapping = {
      ...CATEGORIES_SPECIFIC_FIELDS_CATEGORY_MAPPING,
      [Categories.FOOD_PACKAGES]: undefined,
    };

    jest
      .spyOn(Object, "entries")
      .mockReturnValue(
        Object.entries(mockMapping) as Array<[Categories, string[]]>
      );

    const result = getCategoriesSpecificFields(CountryCodes.AD);
    expect(result[Categories.FOOD_PACKAGES]).toBeUndefined();
  });
});
