import { readdirSync, existsSync } from "fs";
import { extname, basename, join } from "path";
import chalk from "chalk";
import { Categories } from "@soliguide/common";
import ora from "ora";

/**
 * Checks if each category has an associated icon
 * @param {string} svgDir - Directory containing SVG icons
 * @returns {Promise<void>}
 */
export async function checkCategoriesIcons(
  svgDir = "./icons/svg"
): Promise<void> {
  console.log(
    chalk.bold.cyan(`
╭───────────────────────────────────────────╮
│                                           │
│   ${chalk.magenta("✨ CATEGORY ICON CHECKER ✨")}          │
│                                           │
╰───────────────────────────────────────────╯
`)
  );

  // Create spinner
  const spinner = ora({
    text: chalk.blue("🔍 Checking category icons..."),
    spinner: "dots",
  }).start();

  // Verify directory exists
  if (!existsSync(svgDir)) {
    spinner.fail(chalk.red(`❌ Error: Directory ${svgDir} does not exist!`));
    return;
  }

  // Read SVG files
  const files: string[] = readdirSync(svgDir);
  const svgFiles: string[] = files
    .filter((file: string) => extname(file) === ".svg")
    .map((file: string) => basename(file, ".svg"));

  spinner.text = chalk.blue(`🔍 Found ${svgFiles.length} SVG icons`);

  // Get all category values
  const categories: string[] = Object.values(Categories);

  spinner.text = chalk.blue(
    `🔍 Checking ${categories.length} categories against ${svgFiles.length} icons...`
  );

  // Results storage
  const missing: string[] = [];
  const found: string[] = [];

  // Check each category
  categories.forEach((category: string) => {
    if (svgFiles.includes(category)) {
      found.push(category);
    } else {
      missing.push(category);
    }
  });

  // Display results
  if (missing.length === 0) {
    spinner.succeed(
      chalk.green(
        `✅ All ${categories.length} categories have associated icons! 🎉`
      )
    );
  } else {
    spinner.fail(
      chalk.red(
        `❌ Found ${missing.length} categories without icons (${found.length}/${categories.length} complete)`
      )
    );

    console.log(chalk.yellow("\n📋 Categories with missing icons:"));
    missing.forEach((category: string) => {
      console.log(chalk.red(`  • ${category}`));
    });

    console.log(chalk.cyan("\n💡 Quick fix: create the following files:"));
    missing.forEach((category: string) => {
      console.log(chalk.cyan(`  - ${join(svgDir, category)}.svg`));
    });
  }

  // Summary
  console.log(
    chalk.cyan(`
╭───────────────────────────────────────────╮
│                                           │
│  ${chalk.magenta("📊 CHECK SUMMARY")}                   │
│                                           │
│  ${chalk.green(
      `✓ Found:    ${found.length.toString().padStart(3)}`
    )}                    │
│  ${chalk.red(
      `✗ Missing:  ${missing.length.toString().padStart(3)}`
    )}                    │
│  ${chalk.blue(
      `∑ Total:    ${categories.length.toString().padStart(3)}`
    )}                    │
│                                           │
╰───────────────────────────────────────────╯
`)
  );
}

(async (): Promise<void> => {
  await checkCategoriesIcons();
})();
