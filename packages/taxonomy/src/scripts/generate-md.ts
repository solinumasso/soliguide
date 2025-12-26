import fs from "node:fs";
import path from "node:path";
import { loadCategoriesDsl } from "../dsl/loadCategoriesDsl";

function generateMarkdown() {
  const dsl = loadCategoriesDsl(path.join(__dirname, "../categories.dsl.yaml"));

  const lines: string[] = [];

  lines.push("# Categories");
  lines.push("");

  // Table header
  lines.push("| Category | Countries | Created At | Slug | History |");
  lines.push("| --- | --- | --- | --- | --- |");

  // Table rows
  for (const [key, category] of Object.entries(dsl.categories)) {
    const countries = category.countries.join(", ");
    const createdAt = category.createdAt || "N/A";
    const slug = `\`${category.slug}\``;

    let history = "none";
    if (category.history.length > 0) {
      const historyParts = category.history.map((h) => {
        const parts = [`\`${h.slug}\``];
        if (h.from) parts.push(`from: ${h.from}`);
        if (h.until) parts.push(`until: ${h.until}`);
        return parts.join(" ");
      });
      history = historyParts.join("<br>");
    }

    lines.push(`| ${key} | ${countries} | ${createdAt} | ${slug} | ${history} |`);
  }

  const outputPath = path.join(__dirname, "../generated/categories.md");

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, lines.join("\n"));

  console.log("✅ Markdown generated");
}

generateMarkdown();
