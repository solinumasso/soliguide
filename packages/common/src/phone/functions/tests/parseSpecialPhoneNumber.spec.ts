import { parseSpecialPhoneNumber } from "../../../phone/functions/parseSpecialPhoneNumber";

describe("parseSpecialPhoneNumber Tests", () => {
  test("should return empty string for empty input", () => {
    expect(parseSpecialPhoneNumber("")).toBe("");
  });

  test("should format French phone number correctly by replacing +33 with 0", () => {
    expect(parseSpecialPhoneNumber("+33123456789")).toBe("01 23 45 67 89");
  });

  test("should remove dots and format correctly", () => {
    expect(parseSpecialPhoneNumber("+33.123.456.789")).toBe("01 23 45 67 89");
  });

  test("should return the same format if no changes are needed", () => {
    expect(parseSpecialPhoneNumber("0123456789")).toBe("01 23 45 67 89");
  });

  test("Should return a phone number with a space", () => {
    expect(parseSpecialPhoneNumber("3637")).toBe("36 37");
  });
});
