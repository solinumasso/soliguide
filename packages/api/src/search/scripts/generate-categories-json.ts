/*
 * Soliguide: Useful information for those who need it
 *
 * SPDX-FileCopyrightText: © 2025 Solinum
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
import "../../config/database/connection";
import * as path from "path";
import {
  SUPPORTED_LANGUAGES_BY_COUNTRY,
  SupportedLanguagesCode,
  SoliguideCountries,
} from "@soliguide/common";
import { ensureDir, writeFile } from "fs-extra";
import { getLangsForCountry } from "../utils";
import { SearchSuggestionsService } from "../services";

async function generateAutocompleteFiles(): Promise<void> {
  try {
    console.log(
      "🚀 Generate search suggestions JSON for frontend (by country)"
    );

    // Iterate per country configured in SUPPORTED_LANGUAGES_BY_COUNTRY
    const countries = Object.keys(
      SUPPORTED_LANGUAGES_BY_COUNTRY
    ) as SoliguideCountries[];

    for (const country of countries) {
      const rootOutputDir = path.join(
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
    process.exit(0);
  } catch (error) {
    console.error("❌ Error during generation:", error);
    process.exit(1);
  }
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
  const filepath = path.join(countryOutputDir, filename);

  await writeFile(
    filepath,
    JSON.stringify(filteredSuggestions, null, 2),
    "utf8"
  );

  console.log(
    `✅ File generated: ${path.relative(process.cwd(), filepath)} (${
      filteredSuggestions.length
    } items)`
  );
}

(async () => {
  await generateAutocompleteFiles();
})();
