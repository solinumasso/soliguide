import { CountryCodes } from "../../enums";
import { getDepartmentsMap } from "../ALL_DEPARTMENTS.const";
import { FR_DEPARTMENT_CODES } from "../ALL_DEPARTMENT_CODES.const";

describe("Tests of department's constants", () => {
  describe("getDepartmentsMap", () => {
    it("Should have an array of same size", () => {
      expect(Object.keys(getDepartmentsMap(CountryCodes.FR)).length).toEqual(
        FR_DEPARTMENT_CODES.length
      );
    });
  });
});
