import { CountryCodes } from "../../../location";
import { Phone } from "../../interfaces";
import {
  buildTelHref,
  formatPhoneNumberToE164,
} from "../formatPhoneNumberToE164";

const buildPhone = (overrides: Partial<Phone> = {}): Phone => ({
  label: null,
  phoneNumber: null,
  countryCode: CountryCodes.FR,
  isSpecialPhoneNumber: false,
  ...overrides,
});

describe("formatPhoneNumberToE164", () => {
  describe("national numbers formatted for their own country", () => {
    test("formats a French national number", () => {
      const phone = buildPhone({
        phoneNumber: "01 44 83 88 88",
        countryCode: CountryCodes.FR,
      });

      expect(formatPhoneNumberToE164(phone, CountryCodes.FR)).toBe(
        "+33144838888"
      );
    });

    test("formats a Spanish national number", () => {
      const phone = buildPhone({
        phoneNumber: "93 402 70 00",
        countryCode: CountryCodes.ES,
      });

      expect(formatPhoneNumberToE164(phone, CountryCodes.ES)).toBe(
        "+34934027000"
      );
    });

    test("formats an Andorran national number", () => {
      const phone = buildPhone({
        phoneNumber: "872 000",
        countryCode: CountryCodes.AD,
      });

      expect(formatPhoneNumberToE164(phone, CountryCodes.AD)).toBe(
        "+376872000"
      );
    });
  });

  describe("numbers from another country than the current one", () => {
    test("keeps the number's own country calling code", () => {
      const phone = buildPhone({
        phoneNumber: "93 402 70 00",
        countryCode: CountryCodes.ES,
      });

      expect(formatPhoneNumberToE164(phone, CountryCodes.FR)).toBe(
        "+34934027000"
      );
    });
  });

  describe("fallback on the current country when the record has no country code", () => {
    test("uses the Spanish calling code on the Spanish theme", () => {
      const phone = buildPhone({
        phoneNumber: "934 027 000",
        countryCode: "",
      });

      expect(formatPhoneNumberToE164(phone, CountryCodes.ES)).toBe(
        "+34934027000"
      );
    });

    test("uses the Andorran calling code on the Andorran theme", () => {
      const phone = buildPhone({
        phoneNumber: "872 000",
        countryCode: "",
      });

      expect(formatPhoneNumberToE164(phone, CountryCodes.AD)).toBe(
        "+376872000"
      );
    });
  });

  describe("already internationalized input", () => {
    test("is idempotent on an E.164 number", () => {
      const phone = buildPhone({
        phoneNumber: "+34934027000",
        countryCode: CountryCodes.ES,
      });

      expect(formatPhoneNumberToE164(phone, CountryCodes.FR)).toBe(
        "+34934027000"
      );
    });

    test("strips separators from an international number", () => {
      const phone = buildPhone({
        phoneNumber: "+376 872 000",
        countryCode: CountryCodes.AD,
      });

      expect(formatPhoneNumberToE164(phone, CountryCodes.FR)).toBe(
        "+376872000"
      );
    });

    test("handles dot separators", () => {
      const phone = buildPhone({
        phoneNumber: "01.44.83.88.88",
        countryCode: CountryCodes.FR,
      });

      expect(formatPhoneNumberToE164(phone, CountryCodes.FR)).toBe(
        "+33144838888"
      );
    });
  });

  describe("special phone numbers", () => {
    test("returns a short number as-is, without an international prefix", () => {
      const phone = buildPhone({
        phoneNumber: "115",
        countryCode: CountryCodes.FR,
        isSpecialPhoneNumber: true,
      });

      expect(formatPhoneNumberToE164(phone, CountryCodes.FR)).toBe("115");
    });

    test("strips separators from a special number", () => {
      const phone = buildPhone({
        phoneNumber: "36 37",
        countryCode: CountryCodes.FR,
        isSpecialPhoneNumber: true,
      });

      expect(formatPhoneNumberToE164(phone, CountryCodes.FR)).toBe("3637");
    });
  });

  describe("non dialable input", () => {
    test.each([
      ["a null number", null],
      ["an empty number", ""],
      ["a non numeric value", "not a phone number"],
    ])("returns null for %s", (_label, phoneNumber) => {
      const phone = buildPhone({ phoneNumber });

      expect(formatPhoneNumberToE164(phone, CountryCodes.FR)).toBeNull();
    });

    test("returns null for an obviously too short number", () => {
      const phone = buildPhone({
        phoneNumber: "12",
        countryCode: CountryCodes.FR,
      });

      expect(formatPhoneNumberToE164(phone, CountryCodes.FR)).toBeNull();
    });
  });

  describe("the actual defect this function fixes", () => {
    test.each([
      ["01 44 83 88 88", CountryCodes.FR, CountryCodes.FR],
      ["93 402 70 00", CountryCodes.ES, CountryCodes.FR],
      ["+376 872 000", CountryCodes.AD, CountryCodes.FR],
    ])(
      "never returns whitespace for %s",
      (phoneNumber, countryCode, currentCountry) => {
        const result = formatPhoneNumberToE164(
          buildPhone({ phoneNumber, countryCode }),
          currentCountry
        );

        expect(result).not.toBeNull();
        expect(result).not.toMatch(/\s/u);
      }
    );
  });
});

describe("buildTelHref", () => {
  test("prefixes a dialable number with the tel scheme", () => {
    const phone = buildPhone({
      phoneNumber: "93 402 70 00",
      countryCode: CountryCodes.ES,
    });

    expect(buildTelHref(phone, CountryCodes.ES)).toBe("tel:+34934027000");
  });

  test("returns null when the number is not dialable, so no href is rendered", () => {
    const phone = buildPhone({ phoneNumber: null });

    expect(buildTelHref(phone, CountryCodes.FR)).toBeNull();
  });
});
