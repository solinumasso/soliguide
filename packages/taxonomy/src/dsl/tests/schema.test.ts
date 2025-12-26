import { describe, it, expect } from "vitest";
import { CategoriesDslSchema } from "../schema";
import { Categories } from "@soliguide/common";

// Helper to generate all categories with minimal valid data
function generateAllCategories() {
  const categories: Record<string, any> = {};
  for (const [key, value] of Object.entries(Categories)) {
    categories[key] = {
      slug: value,
      countries: ["FR"],
      history: [],
    };
  }
  return categories;
}

describe("CategoriesDslSchema", () => {
  it("accepts a valid DSL structure", () => {
    const result = CategoriesDslSchema.safeParse({
      countries: ["FR", "ES", "AD"],
      categories: generateAllCategories(),
    });

    expect(result.success).toBe(true);
  });

  it("rejects unknown category keys", () => {
    const result = CategoriesDslSchema.safeParse({
      countries: ["FR"],
      categories: {
        UNKNOWN_CATEGORY: {
          slug: "unknown",
          countries: ["FR"],
          history: [],
        },
      },
    });

    expect(result.success).toBe(false);
  });

  it("rejects invalid country codes", () => {
    const result = CategoriesDslSchema.safeParse({
      countries: ["FR"],
      categories: {
        [Categories.HEALTH]: {
          slug: "health",
          countries: ["DE"],
          history: [],
        },
      },
    });

    expect(result.success).toBe(false);
  });
});
