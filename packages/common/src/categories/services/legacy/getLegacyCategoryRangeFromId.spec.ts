import { getLegacyCategoryRangeFromId } from "./getLegacyCategoryRangeFromId";

import { LEGACY_CATEGORIES } from "../../constants";

describe("getLegacyCategoryRangeFromId", () => {
  // We do not use LEGACY_CATEGORIES_RANGE because we use it in getLegacyCategoryRangeFromId so it would be equal to test nothing
  [
    { id: 100, from: 101, to: 110 },
    { id: 200, from: 201, to: 205 },
    { id: 300, from: 301, to: 306 },
    { id: 400, from: 401, to: 408 },
    { id: 500, from: 501, to: 505 },
    { id: 600, from: 601, to: 605 },
    { id: 700, from: 701, to: 705 },
    { id: 800, from: 801, to: 804 },
    { id: 900, from: 901, to: 904 },
    { id: 1100, from: 1101, to: 1121 },
    { id: 1200, from: 1201, to: 1204 },
    { id: 1300, from: 1301, to: 1305 },
  ].forEach((value) => {
    it(`should return the range [${value.from}, ${value.to}] for the category ${
      LEGACY_CATEGORIES[value.id].label
    }`, () => {
      expect(getLegacyCategoryRangeFromId(value.id).from).toEqual(value.from);
      expect(getLegacyCategoryRangeFromId(value.id).to).toEqual(value.to);
    });
  });
});
