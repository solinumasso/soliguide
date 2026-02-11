#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");

const TARGET_VERSION = "5.0.0";
const PACKAGES_DIR = path.join(__dirname, "packages");

// Get all package directories
const packageDirs = fs.readdirSync(PACKAGES_DIR).filter((dir) => {
  const packageJsonPath = path.join(PACKAGES_DIR, dir, "package.json");
  return fs.existsSync(packageJsonPath);
});

console.log(`Found ${packageDirs.length} packages to update\n`);

packageDirs.forEach((dir) => {
  const packageJsonPath = path.join(PACKAGES_DIR, dir, "package.json");
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));

  const oldVersion = packageJson.version;
  packageJson.version = TARGET_VERSION;

  fs.writeFileSync(
    packageJsonPath,
    JSON.stringify(packageJson, null, 2) + "\n",
  );
  console.log(`✓ ${packageJson.name}: ${oldVersion} → ${TARGET_VERSION}`);
});

console.log(
  `\nAll ${packageDirs.length} packages updated to version ${TARGET_VERSION}`,
);
