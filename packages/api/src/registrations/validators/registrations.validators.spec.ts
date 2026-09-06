import {
  isValidNif,
  isValidNrt,
  isValidRna,
  isValidSiret,
} from "./registrations.validators";

describe("Registration validators", () => {
  describe("isValidSiret", () => {
    it("should accept a Luhn-valid SIRET", () => {
      expect(isValidSiret("73282932000074")).toBe(true); // Google France
      expect(isValidSiret("55210055400013")).toBe(true); // Insee example
    });

    it("should reject a wrong length or non digits", () => {
      expect(isValidSiret("7328293200007")).toBe(false);
      expect(isValidSiret("732829320000740")).toBe(false);
      expect(isValidSiret("7328293200007A")).toBe(false);
      expect(isValidSiret("")).toBe(false);
    });

    it("should reject a Luhn-invalid SIRET", () => {
      expect(isValidSiret("73282932000075")).toBe(false);
    });

    it("should apply the La Poste rule (sum of digits multiple of 5) instead of Luhn", () => {
      expect(isValidSiret("35600000000001")).toBe(true); // 3+5+6+1 = 15
      expect(isValidSiret("35600000000000")).toBe(false); // 3+5+6 = 14
    });
  });

  describe("isValidRna", () => {
    it("should accept W + 9 digits", () => {
      expect(isValidRna("W751234567")).toBe(true);
    });
    it("should reject other formats", () => {
      expect(isValidRna("751234567")).toBe(false);
      expect(isValidRna("W75123456")).toBe(false);
      expect(isValidRna("w751234567")).toBe(false);
    });
  });

  describe("isValidNif", () => {
    it("should accept a legal entity NIF with a valid control character", () => {
      expect(isValidNif("Q2826000H")).toBe(true); // Agencia Tributaria
      expect(isValidNif("Q2866001G")).toBe(true); // Cruz Roja Española
      expect(isValidNif("A28015865")).toBe(true); // Telefónica
      expect(isValidNif("G28783991")).toBe(true); // association
    });
    it("should reject a wrong control character", () => {
      expect(isValidNif("A28015866")).toBe(false);
      expect(isValidNif("G12345678")).toBe(false);
    });
    it("should reject individuals (DNI / NIE) and other formats", () => {
      expect(isValidNif("12345678Z")).toBe(false);
      expect(isValidNif("X8095495R")).toBe(false);
      expect(isValidNif("G1234567")).toBe(false);
    });
  });

  describe("isValidNrt", () => {
    it("should accept letter + 6 digits + letter", () => {
      expect(isValidNrt("L123456A")).toBe(true);
    });
    it("should reject other formats", () => {
      expect(isValidNrt("L-123456-A")).toBe(false); // must be normalized first
      expect(isValidNrt("123456A")).toBe(false);
    });
  });
});
