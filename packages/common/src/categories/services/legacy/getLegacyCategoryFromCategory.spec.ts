import { Categories } from "../../enums";
import { getLegacyCategoryFromCategory } from "./getLegacyCategoryFromCategory";

describe("getLegacyCategoryFromCategory", () => {
  it("should find a legacy category for a basic category", () => {
    expect(
      getLegacyCategoryFromCategory(Categories.PUBLIC_WRITER)
    ).toStrictEqual(404);
  });

  describe("There is a legacy category for all categories", () => {
    Object.entries(Categories).forEach((categoryEntry) => {
      it(`should find a legacy category for category ${categoryEntry[0]}`, () => {
        expect(() =>
          getLegacyCategoryFromCategory(categoryEntry[1])
        ).not.toThrow();
      });
    });
  });
});
