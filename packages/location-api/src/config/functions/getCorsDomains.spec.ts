import { getCorsDomains } from "./getCorsDomains";

describe("getCorsDomains", () => {
  it("should convert domains to RegExp patterns", () => {
    const domains = "fr.demo.soliguide.dev,es.demo.soliguide.dev";
    const result = getCorsDomains(domains);

    expect(result).toHaveLength(2);
    expect(result[0]).toBeInstanceOf(RegExp);
    expect(result[0].toString()).toBe("/\\.fr\\.demo\\.soliguide\\.dev$/");
    expect(result[1].toString()).toBe("/\\.es\\.demo\\.soliguide\\.dev$/");
  });

  it("should handle single domain", () => {
    const result = getCorsDomains("fr.demo.soliguide.dev");
    expect(result).toHaveLength(1);
    expect(result[0].toString()).toBe("/\\.fr\\.demo\\.soliguide\\.dev$/");
  });

  it("should trim whitespace", () => {
    const result = getCorsDomains(
      " fr.demo.soliguide.dev , es.demo.soliguide.dev "
    );
    expect(result).toHaveLength(2);
  });
});
