import { describe, it, expect, vi } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { loadCategoriesDsl } from "../loadCategoriesDsl";
import { Categories } from "@soliguide/common";

// Helper to generate YAML for all categories
function generateAllCategoriesYaml() {
  const lines: string[] = ["countries: [FR]", "categories:"];
  for (const [key, value] of Object.entries(Categories)) {
    lines.push(`  ${key}:`);
    lines.push(`    slug: ${value}`);
    lines.push(`    countries: [FR]`);
    lines.push(`    history: []`);
  }
  return lines.join("\n");
}

describe("loadCategoriesDsl", () => {
  const tmpFile = path.join(__dirname, "test.dsl.yaml");

  it("loads and validates a valid DSL file", () => {
    fs.writeFileSync(tmpFile, generateAllCategoriesYaml());

    const dsl = loadCategoriesDsl(tmpFile);

    expect(dsl.categories.HEALTH.slug).toBe("health");
    expect(dsl.categories.MOBILITY.slug).toBe("mobility");
    expect(Object.keys(dsl.categories).length).toBe(Object.keys(Categories).length);

    fs.unlinkSync(tmpFile);
  });

  it("throws if DSL file is invalid", () => {
    // Generate YAML with an unknown category key
    const invalidYaml = `
countries: [FR]
categories:
  UNKNOWN:
    slug: unknown
    countries: [FR]
    history: []
`;
    fs.writeFileSync(tmpFile, invalidYaml);

    expect(() => loadCategoriesDsl(tmpFile)).toThrow();

    fs.unlinkSync(tmpFile);
  });
});
