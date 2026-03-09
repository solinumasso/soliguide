import { formatPhoneNumber } from "./formatPhoneNumber.functions";

describe("formatPhoneNumber", () => {
  it("should return null for empty string", () => {
    expect(formatPhoneNumber("")).toBeNull();
  });

  it("should return null for invalid phone number", () => {
    expect(formatPhoneNumber("abc")).toBeNull();
    expect(formatPhoneNumber("xxxx-sq-z6516198")).toBeNull();
    expect(formatPhoneNumber("+")).toBeNull();
    expect(formatPhoneNumber("+1 (123) 456-7890")).toBeNull();
  });

  it("should accept small phone numbers (Pôle emploi, CAF, etc)", () => {
    expect(formatPhoneNumber("32 30")).toBe("3230");
    expect(formatPhoneNumber("39-49")).toBe("3949");
  });
});
