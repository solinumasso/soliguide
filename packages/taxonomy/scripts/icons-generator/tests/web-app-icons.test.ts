import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

const readCategoryIconCodepoints = (
  filePath: string
): Record<string, string> => {
  const content = fs.readFileSync(filePath, "utf-8");
  const iconCodepoints: Record<string, string> = {};
  const iconCodepointRegex =
    /\.category-icon-([a-z0-9_]+)::before\s*\{\s*content:\s*['"]\\([a-f0-9]+)['"];\s*\}/g;

  for (const match of content.matchAll(iconCodepointRegex)) {
    const [, iconName, codepoint] = match;
    iconCodepoints[iconName] = codepoint;
  }

  return iconCodepoints;
};

describe("web-app category icons", () => {
  it("uses the same generated codepoints as taxonomy", () => {
    const taxonomyIconsFile = path.join(
      __dirname,
      "../../../fonts/categories-icons.scss"
    );
    const webAppIconsFile = path.join(
      __dirname,
      "../../../../web-app/src/assets/styles/categories-icons.scss"
    );

    const taxonomyIconCodepoints = readCategoryIconCodepoints(taxonomyIconsFile);
    const webAppIconCodepoints = readCategoryIconCodepoints(webAppIconsFile);

    expect(webAppIconCodepoints).toEqual(taxonomyIconCodepoints);
  });
});
