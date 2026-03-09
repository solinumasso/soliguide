import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";

describe("generate-md script", () => {
  it("generates a markdown file", async () => {
    const generatedFile = path.join(__dirname, "../../generated/categories.md");

    if (fs.existsSync(generatedFile)) {
      fs.unlinkSync(generatedFile);
    }

    await import("../generate-md");

    const content = fs.readFileSync(generatedFile, "utf-8");

    expect(content).toContain("# Categories");
    expect(content).toContain("| Category | Countries | Created At | Slug | History |");
    expect(content).toContain("| --- | --- | --- | --- | --- |");
  });
});
