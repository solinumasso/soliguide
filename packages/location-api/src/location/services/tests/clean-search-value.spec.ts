
import { CountryCodes } from "@soliguide/common";
import { cleanSearchValue } from "../clean-search-value";

describe("cleanSearchValue", () => {
  describe("France: clean search value", () => {
    it("should return the transformed value for a valid string", () => {
      const validString = "123 Rue de Paris";
      const expectedResult = "123 rue de paris";
      expect(cleanSearchValue(CountryCodes.FR, validString)).toBe(
        expectedResult
      );
    });
    it("should throw BadRequestException for an invalid first character", () => {
      const invalidString = "!23 rue de Paris";
      expect(() => cleanSearchValue(CountryCodes.FR, invalidString)).toThrow(
        new Error("STRING_IS_NOT_VALID")
      );
    });
  });

  describe("Spain cleanSearchValue", () => {
    test('should replace "Pg." with "paseo"', () => {
      expect(cleanSearchValue(CountryCodes.ES, "Pg. Pollancres 3")).toBe(
        "paseo pollancres 3"
      );
      expect(cleanSearchValue(CountryCodes.ES, "Pg. Urrutia 102 1r 3a")).toBe(
        "paseo urrutia 102 1r 3a"
      );
    });

    test('should replace "Avda." with "avenida"', () => {
      expect(
        cleanSearchValue(CountryCodes.ES, "Avda. Barcelona 174 1r 2a")
      ).toBe("avenida barcelona 174 1r 2a");
    });

    test('should replace "Rbla." with "rambla"', () => {
      expect(cleanSearchValue(CountryCodes.ES, "Rbla. Nova 105")).toBe(
        "rambla nova 105"
      );
    });

    test('should replace "C/" with "calle"', () => {
      expect(cleanSearchValue(CountryCodes.ES, "C/ de Claramunt 4")).toBe(
        "calle de claramunt 4"
      );
      expect(
        cleanSearchValue(CountryCodes.ES, "C/ del Rector Triadó, 31 bxs.")
      ).toBe("calle del rector triadó, 31 bxs.");
      expect(
        cleanSearchValue(CountryCodes.ES, "C/ Canigó 94 B, bxs. 1a.")
      ).toBe("calle canigó 94 b, bxs. 1a.");
      expect(cleanSearchValue(CountryCodes.ES, "C/ Cruz, 21 bajo")).toBe(
        "calle cruz, 21 bajo"
      );
      expect(cleanSearchValue(CountryCodes.ES, "C/ Girona, 147 2n 2a")).toBe(
        "calle girona, 147 2n 2a"
      );
    });

    test('should replace full street name with "calle"', () => {
      expect(
        cleanSearchValue(
          CountryCodes.ES,
          "Calle Asturias, 30. 18339. Cijuela – Granada"
        )
      ).toBe("calle asturias, 30. 18339. cijuela – granada");
    });

    test('should replace "Av." with "avenida"', () => {
      expect(
        cleanSearchValue(
          CountryCodes.ES,
          "Av. Institución Libre de Enseñanza 41 bis, 3r"
        )
      ).toBe("avenida institución libre de enseñanza 41 bis, 3r");
    });
  });
});
