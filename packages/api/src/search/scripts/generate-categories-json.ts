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
