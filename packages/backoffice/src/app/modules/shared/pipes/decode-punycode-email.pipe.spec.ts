import {
  DecodePunycodeEmailPipe,
  decodePunycodeEmail,
} from "./decode-punycode-email.pipe";

describe("DecodePunycodeEmailPipe", () => {
  let pipe: DecodePunycodeEmailPipe;

  beforeEach(() => {
    pipe = new DecodePunycodeEmailPipe();
  });

  it("should create an instance", () => {
    expect(pipe).toBeTruthy();
  });

  describe("decodePunycodeEmail function", () => {
    it("should decode punycode domain to unicode", () => {
      expect(
        decodePunycodeEmail(
          "maison.des.associations@xn--ville-chamalire-nnb.fr"
        )
      ).toBe("maison.des.associations@ville-chamaliére.fr");
      expect(decodePunycodeEmail("m.ioussoupov@xn--forumrfugis-gbbe.org")).toBe(
        "m.ioussoupov@forumréfugiés.org"
      );
      expect(decodePunycodeEmail("contact@xn--franais-xxa.org")).toBe(
        "contact@français.org"
      );
    });

    it("should decode punycode domain with Spanish characters", () => {
      expect(decodePunycodeEmail("contacto@xn--espaa-rta.es")).toBe(
        "contacto@españa.es"
      );
    });

    it("should handle already decoded email addresses", () => {
      expect(decodePunycodeEmail("user@example.com")).toBe("user@example.com");
    });

    it("should return empty string on null input", () => {
      expect(decodePunycodeEmail(null as unknown as string)).toBe("");
    });

    it("should return empty string on undefined input", () => {
      expect(decodePunycodeEmail(undefined as unknown as string)).toBe("");
    });

    it("should return empty string on empty string input", () => {
      expect(decodePunycodeEmail("")).toBe("");
    });

    it("should throw if no @ symbol (undefined domain)", () => {
      expect(() => decodePunycodeEmail("invalidemail")).toThrow();
    });
  });

  describe("transform method", () => {
    it("should call decodePunycodeEmail", () => {
      expect(
        pipe.transform("maison.des.associations@xn--ville-chamalire-nnb.fr")
      ).toBe("maison.des.associations@ville-chamaliére.fr");
    });
  });
});
