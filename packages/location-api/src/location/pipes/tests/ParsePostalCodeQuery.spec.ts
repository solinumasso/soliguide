import { ParsePostalCodePipe } from "../ParsePostalCodeQuery.pipe";

describe("ParsePostalCodePipe", () => {
  let pipe: ParsePostalCodePipe;

  beforeEach(() => {
    pipe = new ParsePostalCodePipe();
  });

  it("should be defined", () => {
    expect(pipe).toBeDefined();
  });

  describe("transform", () => {
    it("should return undefined for undefined input", () => {
      expect(pipe.transform(undefined)).toBeUndefined();
    });

    it("should return undefined for null input", () => {
      expect(pipe.transform(null)).toBeUndefined();
    });

    it("should return undefined for empty string", () => {
      expect(pipe.transform("")).toBeUndefined();
    });

    it("should remove special characters and convert to uppercase", () => {
      expect(pipe.transform("75-008")).toBe("75008");
      expect(pipe.transform("2A 004")).toBe("2A004");
      expect(pipe.transform("97.400")).toBe("97400");
      expect(pipe.transform("!@#$%^&*()")).toBe("");
    });

    it("should handle already clean postal codes", () => {
      expect(pipe.transform("75008")).toBe("75008");
      expect(pipe.transform("2A004")).toBe("2A004");
    });

    it("should convert lowercase letters to uppercase", () => {
      expect(pipe.transform("2a004")).toBe("2A004");
      expect(pipe.transform("ab-123")).toBe("AB123");
    });

    it("should handle mixed cases and special characters", () => {
      expect(pipe.transform("2a-004")).toBe("2A004");
      expect(pipe.transform("75 008-paris")).toBe("75008PARIS");
      expect(pipe.transform("97!@#400")).toBe("97400");
    });

    it("should preserve numbers and letters only", () => {
      expect(pipe.transform("123ABC!@#")).toBe("123ABC");
      expect(pipe.transform("!@#123ABC")).toBe("123ABC");
      expect(pipe.transform("123!@#ABC")).toBe("123ABC");
    });
  });
});
