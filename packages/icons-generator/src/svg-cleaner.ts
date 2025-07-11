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
/*
 * SVG Filename Cleaner
 *
 * Cleans SVG filenames by:
 * - Removing "category" and "filled"
 * - Converting to match Categories enum format
 * - Adding "_outlined" suffix for outlined versions
 */
import {
  readdirSync,
  existsSync,
  renameSync,
  readFileSync,
  writeFileSync,
} from "fs";
import { extname, basename, join } from "path";
import { Categories } from "@soliguide/common";
import ora from "ora";
import chalk from "chalk";

/**
 * Converts filename to match Categories enum format
 * @param {string} text - Text to convert
 * @returns {string} - Converted text matching enum format
 */
function matchCategoryFormat(text: string): string {
  // Get all category values from enum
  const categoryValues = Object.values(Categories);

  // Clean the input text for comparison
  const cleanInput = text.toLowerCase().replace(/[^a-z]/g, "");

  // Find exact match
  const exactMatch = categoryValues.find(
    (cat) => cat.toLowerCase().replace(/_/g, "") === cleanInput
  );

  if (exactMatch) {
    return exactMatch;
  }

  // If no exact match, return original with underscores
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "");
}

/**
 * Creates outlined version of an SVG file by copying the normal version
 * @param {string} svgDir - Directory containing SVG files
 * @param {string} baseName - Base name without extension
 * @returns {boolean} - Success status
 */
function createOutlinedVersion(svgDir: string, baseName: string): boolean {
  try {
    const filledPath = join(svgDir, `${baseName}.svg`);
    const outlinedPath = join(svgDir, `${baseName}_outlined.svg`);

    // Simply copy the normal version to create the outlined version
    const content = readFileSync(filledPath, "utf-8");
    writeFileSync(outlinedPath, content);

    return true;
  } catch (error) {
    console.log(
      chalk.red(
        `❌ Failed to create outlined version for ${baseName}: ${error}`
      )
    );
    return false;
  }
}

/**
 * Cleans SVG filenames in a directory and ensures outlined versions exist
 * @param {string} svgDir - Directory containing SVG files to clean
 */
export function cleanSvgFilenames(svgDir: string = "./icons/svg"): void {
  console.log(
    chalk.bold.cyan(`
╭───────────────────────────────────────────╮
│                                           │
│   ${chalk.magenta("🧹 SVG FILENAME CLEANER 🧹")}          │
│                                           │
╰───────────────────────────────────────────╯
`)
  );

  const spinner = ora({
    text: chalk.blue(`🔍 Scanning directory: ${svgDir}`),
    spinner: "dots",
  }).start();

  // Verify directory exists
  if (!existsSync(svgDir)) {
    spinner.fail(chalk.red(`❌ Error: Directory ${svgDir} does not exist!`));
    return;
  }

  // Read SVG files
  const files: string[] = readdirSync(svgDir);
  const svgFiles: string[] = files.filter(
    (file: string) => extname(file) === ".svg"
  );

  spinner.text = chalk.blue(`📁 Found ${svgFiles.length} SVG files`);

  let cleaned = 0;
  let failed = 0;
  let unchanged = 0;

  for (const svgFile of svgFiles) {
    try {
      const originalName = basename(svgFile, ".svg");
      let cleanName = originalName;

      spinner.text = chalk.blue(`🧹 Processing: ${originalName}`);

      // Remove "category" (case insensitive)
      cleanName = cleanName.replace(/category/gi, "");

      // Check if it's outlined version
      const isOutlined = /outlined/i.test(cleanName);

      // Remove "filled" and "outlined" from the name
      cleanName = cleanName.replace(/filled/gi, "");
      cleanName = cleanName.replace(/outlined/gi, "");

      // Convert to match Categories enum format
      cleanName = matchCategoryFormat(cleanName);

      // Add "_outlined" suffix for outlined versions
      if (isOutlined) {
        cleanName += "_outlined";
      }

      // Ensure we have a valid name
      if (!cleanName || cleanName === "_outlined") {
        console.log(
          chalk.yellow(`⚠️ Could not clean filename: ${originalName}`)
        );
        failed++;
        continue;
      }

      const cleanFileName = `${cleanName}.svg`;

      // Only rename if the name changed
      if (cleanFileName !== svgFile) {
        const originalPath = join(svgDir, svgFile);
        const newPath = join(svgDir, cleanFileName);

        renameSync(originalPath, newPath);
        console.log(chalk.green(`✓ ${originalName} → ${cleanName}`));
        cleaned++;
      } else {
        console.log(chalk.gray(`- ${originalName} (no change needed)`));
        unchanged++;
      }
    } catch (error) {
      console.log(chalk.red(`❌ Failed to clean ${svgFile}: ${error}`));
      failed++;
    }
  }

  // Phase 2: Create outlined versions for missing ones
  spinner.start();
  spinner.text = chalk.blue("🎨 Creating missing outlined versions...");

  const updatedFiles = readdirSync(svgDir).filter(
    (file) => extname(file) === ".svg"
  );

  const baseNames = new Set<string>();
  const outlinedNames = new Set<string>();

  // Categorize existing files
  updatedFiles.forEach((file) => {
    const baseName = basename(file, ".svg");
    if (baseName.endsWith("_outlined")) {
      outlinedNames.add(baseName.replace("_outlined", ""));
    } else {
      baseNames.add(baseName);
    }
  });

  let createdOutlined = 0;
  let failedOutlined = 0;

  // Create outlined versions for files that don't have them
  for (const baseName of baseNames) {
    if (!outlinedNames.has(baseName)) {
      spinner.text = chalk.blue(`🎨 Creating outlined version: ${baseName}`);

      if (createOutlinedVersion(svgDir, baseName)) {
        console.log(chalk.green(`✓ Created ${baseName}_outlined.svg`));
        createdOutlined++;
      } else {
        failedOutlined++;
      }
    }
  }

  // Final result
  if (failed === 0 && failedOutlined === 0) {
    spinner.succeed(
      chalk.green(`✅ Successfully processed ${svgFiles.length} files!`)
    );
  } else {
    spinner.warn(
      chalk.yellow(`⚠️ Processed with ${failed + failedOutlined} errors`)
    );
  }

  // Check if all categories have icons
  spinner.start();
  spinner.text = chalk.blue("🔍 Checking category coverage...");

  const finalFiles = readdirSync(svgDir).filter(
    (file) => extname(file) === ".svg"
  );
  const finalBasenames = finalFiles.map((file) =>
    basename(file, ".svg").replace("_outlined", "")
  );

  const allCategories = Object.values(Categories);
  const missingCategories: string[] = [];
  const foundCategories: string[] = [];

  allCategories.forEach((category) => {
    if (finalBasenames.includes(category)) {
      foundCategories.push(category);
    } else {
      missingCategories.push(category);
    }
  });

  if (missingCategories.length === 0) {
    spinner.succeed(
      chalk.green(`🎉 All ${allCategories.length} categories have icons!`)
    );
  } else {
    spinner.fail(
      chalk.red(`❌ ${missingCategories.length} categories are missing icons`)
    );

    console.log(chalk.yellow("\n📋 Missing category icons:"));
    missingCategories.forEach((category) => {
      console.log(chalk.red(`  • ${category}.svg`));
    });
  }

  // Summary
  console.log(
    chalk.cyan(`
╭───────────────────────────────────────────╮
│                                           │
│  ${chalk.magenta("📊 CLEANING SUMMARY")}                │
│                                           │
│  ${chalk.green(
      `✓ Cleaned:       ${cleaned.toString().padStart(3)}`
    )}                │
│  ${chalk.gray(
      `- Unchanged:     ${unchanged.toString().padStart(3)}`
    )}                │
│  ${chalk.red(
      `✗ Failed:        ${failed.toString().padStart(3)}`
    )}                │
│  ${chalk.blue(
      `∑ Total files:   ${svgFiles.length.toString().padStart(3)}`
    )}                │
│                                           │
│  ${chalk.magenta("🎨 OUTLINED GENERATION")}             │
│                                           │
│  ${chalk.green(
      `✓ Created:       ${createdOutlined.toString().padStart(3)}`
    )}                │
│  ${chalk.red(
      `✗ Failed:        ${failedOutlined.toString().padStart(3)}`
    )}                │
│                                           │
│  ${chalk.magenta("📋 CATEGORY COVERAGE")}               │
│                                           │
│  ${chalk.green(
      `✓ Found:         ${foundCategories.length.toString().padStart(3)}`
    )}                │
│  ${chalk.red(
      `✗ Missing:       ${missingCategories.length.toString().padStart(3)}`
    )}                │
│  ${chalk.blue(
      `∑ Total cats:    ${allCategories.length.toString().padStart(3)}`
    )}                │
│                                           │
╰───────────────────────────────────────────╯
`)
  );
}
