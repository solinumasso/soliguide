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
import { ensureDir, pathExists } from "fs-extra";
import chalk from "chalk";
import path from "path";
import { readdir, writeFile } from "node:fs/promises";

const paths = {
  svg: path.resolve(process.cwd(), "./icons/svg"),
  png: path.resolve(process.cwd(), "./icons/png"),
};

const licenseContent = `Soliguide: Useful information for those who need it

SPDX-FileCopyrightText: © ${new Date().getFullYear()} Solinum

SPDX-License-Identifier: AGPL-3.0-only

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published
by the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
`;

/**
 * Generates a license file for a given file
 */
async function generateLicenseFile(filePath: string): Promise<void> {
  try {
    const licensePath = `${filePath}.license`;

    if (await pathExists(licensePath)) {
      console.log(
        chalk.yellow(
          `⚠️  License already exists for ${chalk.bold(
            path.basename(filePath)
          )}`
        )
      );
      return;
    }

    await writeFile(licensePath, licenseContent);
    console.log(
      chalk.green(
        `✅ Generated license for ${chalk.bold(path.basename(filePath))}`
      )
    );
  } catch (error) {
    console.error(
      chalk.red(
        `❌ Error generating license for ${chalk.bold(
          path.basename(filePath)
        )}:`
      ),
      error
    );
  }
}

/**
 * Generates license files for all files in a folder
 */
async function generateLicensesForFolder(
  folderPath: string,
  extensions: string[]
): Promise<void> {
  try {
    // Check if folder exists
    if (!(await pathExists(folderPath))) {
      console.log(
        chalk.blue(
          `📁 Folder ${chalk.bold(folderPath)} doesn't exist, creating...`
        )
      );
      await ensureDir(folderPath);
      return;
    }

    const files = await readdir(folderPath);
    let processedCount = 0;

    console.log(
      chalk.cyan(
        `🔍 Processing ${chalk.bold(path.basename(folderPath))} folder...`
      )
    );

    for (const file of files) {
      const fileExt = path.extname(file).toLowerCase();

      if (extensions.includes(fileExt)) {
        await generateLicenseFile(path.join(folderPath, file));
        processedCount++;
      }
    }

    console.log(
      chalk.cyan(
        `\n📂 ${chalk.bold(path.basename(folderPath))}: ${chalk.bold(
          processedCount
        )} files processed`
      )
    );
  } catch (error) {
    console.error(
      chalk.red(`❌ Error processing folder ${chalk.bold(folderPath)}:`),
      error
    );
  }
}

/**
 * Main function that coordinates the license generation process
 */
async function main(): Promise<void> {
  console.log(chalk.magenta.bold("\n🚀 GENERATING LICENSE FILES FOR ICONS\n"));

  const startTime = Date.now();

  // Process PNG files
  await generateLicensesForFolder(paths.png, [".png"]);

  // Process font files
  const fontsPath = path.resolve(process.cwd(), "./fonts");
  if (await pathExists(fontsPath)) {
    await generateLicensesForFolder(fontsPath, [
      ".woff",
      ".woff2",
      ".scss",
      ".css",
    ]);
  }

  const duration = ((Date.now() - startTime) / 1000).toFixed(2);

  console.log(
    chalk.magenta.bold(`\n✨ LICENSE GENERATION COMPLETED IN ${duration}s! ✨`)
  );
}

// Execute the main function
main().catch((error) => {
  console.error(chalk.red.bold("❌ FATAL ERROR:"), error);
  process.exit(1);
});
