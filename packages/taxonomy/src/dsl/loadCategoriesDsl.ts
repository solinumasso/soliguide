import fs from "node:fs";
import path from "node:path";
import yaml from "yaml";
import { CategoriesDslSchema, CategoriesDsl } from "./schema";

/**
 * Charge et valide le DSL categories.dsl.yaml
 */
export function loadCategoriesDsl(filePath: string): CategoriesDsl {
  const absolutePath = path.resolve(filePath);

  if (!fs.existsSync(absolutePath)) {
    throw new Error(`categories DSL file not found at ${absolutePath}`);
  }

  const raw = fs.readFileSync(absolutePath, "utf-8");
  const parsed = yaml.parse(raw);

  const result = CategoriesDslSchema.safeParse(parsed);

  if (!result.success) {
    console.error("❌ Invalid categories DSL");
    console.error(result.error.format());
    throw new Error("Invalid categories DSL");
  }

  return result.data;
}
