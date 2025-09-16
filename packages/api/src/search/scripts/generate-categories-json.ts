import { SUPPORTED_LANGUAGES } from "@soliguide/common";
import "../../config/database/connection";
import * as fs from "fs";
import * as path from "path";
import { SearchSuggestionsService } from "../services";

async function generateAutocompleteFiles(): Promise<void> {
  try {
    console.log("🚀 Generate search suggestions JSON for frontend");

    const outputDir = path.join(process.cwd(), "../frontend/src/assets/files");
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    for (const lang of SUPPORTED_LANGUAGES) {
      await generateFileForLanguage(lang, outputDir);
    }

    console.log("✅ Successful");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error during generation", error);
    throw error;
  }
}

async function generateFileForLanguage(
  lang: string,
  outputDir: string
): Promise<void> {
  console.log(`📝 Generate suggestions for language: ${lang}`);

  const searchService = new SearchSuggestionsService();

  await searchService.loadSuggestions(lang);

  const filteredSuggestions = searchService.generate();

  if (filteredSuggestions.length === 0) {
    console.warn(`⚠️  No data for language : ${lang}`);
    return;
  }

  const filename = `${lang}.json`;
  const filepath = path.join(outputDir, filename);

  fs.writeFileSync(
    filepath,
    JSON.stringify(filteredSuggestions, null, 2),
    "utf8"
  );

  console.log(
    `✅ File generated: ${filename} (${filteredSuggestions.length} items)`
  );
}

(async () => {
  await generateAutocompleteFiles();
})();
