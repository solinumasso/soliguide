import { Categories } from "../../enums";
import { getCategoryFromLegacyCategory } from "./getCategoryFromLegacyCategory";

describe("getCategoryFromLegacyCategory", () => {
  it("should find a category", () => {
    expect(getCategoryFromLegacyCategory(404)).toEqual(
      Categories.PUBLIC_WRITER
    );
  });

  it("should find not find anything for a random number", () => {
    expect(getCategoryFromLegacyCategory(999)).toBeNull();
  });
});
