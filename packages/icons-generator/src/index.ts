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
import sharp from "sharp";
import svgtofont, { SvgToFontOptions } from "svgtofont";
import { resolve, extname, join } from "path";
import { readdirSync, existsSync, mkdirSync } from "fs";
import ora from "ora";
import chalk from "chalk";
import { cleanSvgFilenames } from "./svg-cleaner";

const SOURCE_SVG_DIR: string = "./icons/svg";
const OUTPUT_PNG_DIR: string = "./icons/png";
const showBanner = (): void => {
  console.log(
    chalk.bold.cyan(`
╭───────────────────────────────────────────╮
│                                           │
│  ${chalk.magenta("✨ SOLIGUIDE ICON GENERATOR ✨")}   │
│                                           │
╰───────────────────────────────────────────╯
`)
  );
};

const generateFont = async (): Promise<void> => {
  const spinner = ora({
    text: chalk.blue("🔤 Generating fonts from SVG..."),
    spinner: "dots",
  }).start();

  const options: SvgToFontOptions = {
    config: {
      mustExist: true,
    },
    svgicons2svgfont: {
      normalize: true,
      fontHeight: 1000,
      descent: 0,
      fixedWidth: true, // Optionnel : largeur fixe pour tous les icônes
      centerHorizontally: true, // Optionnel : centrage horizontal
      centerVertically: true, // Optionnel : centrage vertical
    },
    fontName: "categories-icons",
    classNamePrefix: "category-icon",
    src: resolve(process.cwd(), SOURCE_SVG_DIR),
    dist: resolve(process.cwd(), "fonts"),
    excludeFormat: ["eot", "ttf", "svg", "symbol.svg"],
    css: true,
    log: true,
    website: {
      title: "Soliguide categories icons",
      logo: resolve(process.cwd(), "soliguide.svg"),
      meta: {
        description: "Converts SVG icons to a font format.",
      },
      description: ``,
      corners: {
        url: "https://github.com/solinumasso/soliguide/",
        width: 100, // default: 60
        height: 100, // default: 60
        bgColor: "#dc3545", // default: '#151513'
      },
      links: [
        {
          title: "GitHub",
          url: "https://github.com/solinumasso/soliguide/",
        },
        {
          title: "Font Class",
          url: "index.html",
        },
        {
          title: "Unicode",
          url: "unicode.html",
        },
      ],
      footerInfo: `Soliguide: Useful information for those who need it
      Copyright (C) 2023  Solinum \n\n

      This program is free software: you can redistribute it and/or modify
      it under the terms of the GNU Affero General Public License as published
      by the Free Software Foundation, either version 3 of the License, or
      (at your option) any later version. \n\n

      This program is distributed in the hope that it will be useful,
      but WITHOUT ANY WARRANTY; without even the implied warranty of
      MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
      GNU Affero General Public License for more details. \n\n

      You should have received a copy of the GNU Affero General Public License
      along with this program.  If not, see <https://www.gnu.org/licenses/>.`,
    },
  };

  try {
    await svgtofont(options);
    spinner.succeed(
      chalk.green("✅ Font generation completed successfully! 🎉")
    );
  } catch (error) {
    spinner.fail(chalk.red(`❌ Error during font generation: ${error}`));
  }
};

async function convertSvgToPng(): Promise<void> {
  const svgFiles: string[] = readdirSync(SOURCE_SVG_DIR);
  const spinner = ora({
    text: chalk.blue(`🖼️  Converting SVG to PNG (0/${svgFiles.length})...`),
    spinner: "dots",
  }).start();

  let completed = 0;
  let errors = 0;

  for await (const file of svgFiles) {
    if (extname(file) === ".svg") {
      try {
        const svgPath: string = resolve(join(SOURCE_SVG_DIR, file));
        const pngPath: string = resolve(
          join(OUTPUT_PNG_DIR, file.replace(".svg", "") + ".png")
        );

        await sharp(svgPath).resize(256, 256).png().toFile(pngPath);
        completed++;
        spinner.text = chalk.blue(
          `🖼️  Converting SVG to PNG (${completed}/${svgFiles.length})...`
        );
      } catch (error) {
        errors++;
        spinner.warn(
          chalk.yellow(`⚠️  Error converting ${file} to PNG: ${error}`)
        );
      }
    }
  }

  if (errors === 0) {
    spinner.succeed(
      chalk.green(`✅ ${completed} PNG files created successfully! 🎉`)
    );
  } else {
    spinner.succeed(
      chalk.yellow(`⚠️  ${completed} PNG files created with ${errors} errors.`)
    );
  }
}

(async (): Promise<void> => {
  showBanner();
  console.log(chalk.cyan("📋 Checking directories..."));

  if (!existsSync(OUTPUT_PNG_DIR)) {
    mkdirSync(OUTPUT_PNG_DIR, { recursive: true });
    console.log(chalk.green(`✅ Directory ${OUTPUT_PNG_DIR} created.`));
  }

  if (!existsSync(SOURCE_SVG_DIR)) {
    mkdirSync(SOURCE_SVG_DIR, { recursive: true });
    console.log(chalk.green(`✅ Directory ${SOURCE_SVG_DIR} created.`));
  }

  const startTime = Date.now();

  console.log(chalk.cyan("🚀 Starting processing..."));

  console.log(chalk.bold.magenta("\n📌 Step 1/3: clean SVG files"));
  cleanSvgFilenames();

  // Step 2
  console.log(chalk.bold.magenta("\n📌 Step 2/3: generate PNG from SVG"));
  await convertSvgToPng();

  // Step 3
  console.log(chalk.bold.magenta("\n📌 Step 3/3: generate fonts"));
  await generateFont();

  const duration = ((Date.now() - startTime) / 1000).toFixed(2);

  console.log(chalk.bold.green(`\n✨ Mission complete: ${duration}s ✨`));
  console.log(
    chalk.cyan(`
╭───────────────────────────────────────────╮
│                                           │
│  ${chalk.magenta("🎉 ICON GENERATION SUCCESSFUL 🎉")}    │
│                                           │
╰───────────────────────────────────────────╯
`)
  );
})();
