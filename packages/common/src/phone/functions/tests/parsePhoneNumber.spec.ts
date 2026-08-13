import { CountryCodes } from "../../../location";
import { Phone } from "../../interfaces";
import { parsePhoneNumber } from "../parsePhoneNumber";

const buildPhone = (overrides: Partial<Phone> = {}): Phone => ({
  label: null,
  phoneNumber: null,
  countryCode: CountryCodes.FR,
  isSpecialPhoneNumber: false,
  ...overrides,
});

describe("parsePhoneNumber", () => {
  describe("display format", () => {
    test("uses the national format for a number of the current country", () => {
      const phone = buildPhone({
        phoneNumber: "0144838888",
        countryCode: CountryCodes.FR,
      });

      expect(parsePhoneNumber(phone, CountryCodes.FR)).toBe("01 44 83 88 88");
    });

    test("uses the international format for a foreign number", () => {
      const phone = buildPhone({
        phoneNumber: "934027000",
        countryCode: CountryCodes.ES,
      });

      expect(parsePhoneNumber(phone, CountryCodes.FR)).toBe("+34 934 02 70 00");
    });

    test("uses the national format for a Spanish number on the Spanish theme", () => {
      const phone = buildPhone({
        phoneNumber: "934027000",
        countryCode: CountryCodes.ES,
      });

      expect(parsePhoneNumber(phone, CountryCodes.ES)).toBe("934 02 70 00");
    });

    test("uses the national format for an Andorran number on the Andorran theme", () => {
      const phone = buildPhone({
        phoneNumber: "872000",
        countryCode: CountryCodes.AD,
      });

      expect(parsePhoneNumber(phone, CountryCodes.AD)).toBe("872 000");
    });
  });

  describe("fallback on the current country when the record has no country code", () => {
    test("parses a Spanish number and displays it in national format", () => {
      const phone = buildPhone({ phoneNumber: "934027000", countryCode: "" });

      expect(parsePhoneNumber(phone, CountryCodes.ES)).toBe("934 02 70 00");
    });

    test("parses an Andorran number and displays it in national format", () => {
      const phone = buildPhone({ phoneNumber: "872000", countryCode: "" });

      expect(parsePhoneNumber(phone, CountryCodes.AD)).toBe("872 000");
    });
  });

  describe("special and invalid numbers", () => {
    test("returns a special number untouched", () => {
      const phone = buildPhone({
        phoneNumber: "115",
        isSpecialPhoneNumber: true,
      });

      expect(parsePhoneNumber(phone, CountryCodes.FR)).toBe("115");
    });

    test.each([
      ["a null number", null],
      ["an empty number", ""],
      ["a non numeric value", "not a phone number"],
    ])("returns null for %s", (_label, phoneNumber) => {
      expect(
        parsePhoneNumber(buildPhone({ phoneNumber }), CountryCodes.FR)
      ).toBeNull();
    });
  });
});
