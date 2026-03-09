import {
  SUPPORTED_LANGUAGES_BY_COUNTRY,
  SupportedLanguagesCode,
  SoliguideCountries,
} from "@soliguide/common";
import { ensureDir, writeFile } from "fs-extra";
import { getLangsForCountry } from "../utils";
import { SearchSuggestionsService } from "../services";
import { join, relative } from "node:path";
import { connectToDatabase } from "../../config/database";

export async function generateAutocompleteFiles(): Promise<void> {
  console.log("🚀 Generate search suggestions JSON for frontend (by country)");

  // Iterate per country configured in SUPPORTED_LANGUAGES_BY_COUNTRY
  const countries = Object.keys(
    SUPPORTED_LANGUAGES_BY_COUNTRY
  ) as SoliguideCountries[];

  for (const country of countries) {
    const rootOutputDir = join(
      process.cwd(),
      "../frontend/src/assets/files",
      country
    );

    console.log(rootOutputDir);
    await ensureDir(rootOutputDir);
    const langs = getLangsForCountry(country); // source + others, deduped

    console.log(`\n🌍 Country: ${country} — Languages: ${langs.join(", ")}`);

    for (const lang of langs) {
      await generateFileForLanguageAndCountry(lang, country, rootOutputDir);
    }
  }

  console.log("\n✅ All files generated successfully");
}

async function generateFileForLanguageAndCountry(
  lang: SupportedLanguagesCode,
  country: SoliguideCountries,
  countryOutputDir: string
): Promise<void> {
  console.log(`📝 Generate suggestions for: country=${country}, lang=${lang}`);

  const searchService = new SearchSuggestionsService();
  await searchService.loadSuggestions(country, lang);
  const filteredSuggestions = searchService.getAllLoadedSuggestions();

  if (!filteredSuggestions || filteredSuggestions.length === 0) {
    console.warn(`⚠️  No data for ${country}}`);
    return;
  }

  const filename = `${lang}.json`;
  const filepath = join(countryOutputDir, filename);

  await writeFile(
    filepath,
    JSON.stringify(filteredSuggestions, null, 2),
    "utf8"
  );

  console.log(
    `✅ File generated: ${relative(process.cwd(), filepath)} (${
      filteredSuggestions.length
    } items)`
  );
}

// Only run if executed directly
if (require.main === module) {
  (async () => {
    try {
      await connectToDatabase();
      await generateAutocompleteFiles();
      process.exit(0);
    } catch (error) {
      console.error("❌ Error during generation:", error);
      process.exit(1);
    }
  })();
}
