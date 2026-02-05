#!/usr/bin/env tsx
/*
 * Soliguide: Useful information for those who need it
 *
 * SPDX-FileCopyrightText: © 2024 Solinum
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

import * as fs from "fs";
import * as path from "path";
import {
  CATEGORIES,
  ROOT_CATEGORIES,
  CATEGORIES_SOLIGUIDE_FR,
  CATEGORIES_SOLIGUIA_ES,
  CATEGORIES_SOLIGUIA_AD,
} from "@soliguide/common";

const iconsDir = path.join(__dirname, "assets/icons-copied");
const outputFile = path.join(__dirname, "icons-list.json");

// French translations for root categories
const CATEGORY_NAMES: Record<string, string> = {
  welcome: "Accueil",
  activities: "Activités",
  food: "Alimentation",
  counseling: "Accompagnement",
  training_and_jobs: "Formation et emploi",
  accomodation_and_housing: "Hébergement et logement",
  hygiene_and_wellness: "Hygiène et bien-être",
  equipment: "Équipement",
  health: "Santé",
  technology: "Technologie",
  mobility: "Mobilité",
};

interface IconsOutput {
  categories: Record<
    string,
    {
      name: string;
      rank: number;
      icons: string[];
      children: Record<string, string[]>;
    }
  >;
  countriesCategories: {
    FR: Record<string, { name: string; icons: string[]; children: Record<string, string[]> }>;
    ES: Record<string, { name: string; icons: string[]; children: Record<string, string[]> }>;
    AD: Record<string, { name: string; icons: string[]; children: Record<string, string[]> }>;
  };
  unmapped: string[];
  total: number;
  mappedCount: number;
  unmappedCount: number;
}

try {
  // Check if icons directory exists
  if (!fs.existsSync(iconsDir)) {
    console.error(`❌ Icons directory not found: ${iconsDir}`);
    console.log('   Run "yarn docs:build" to copy icons first');
    process.exit(1);
  }

  // Read all files in the icons directory
  const files = fs.readdirSync(iconsDir);

  // Filter only SVG files (exclude .license files)
  const svgFiles = files.filter(
    (file) => file.endsWith(".svg") && !file.endsWith(".svg.license"),
  );

  // Create a map of all category IDs for quick lookup
  const allCategoryIds = new Set<string>();
  CATEGORIES.forEach((cat) => {
    allCategoryIds.add(cat.id);
    cat.children.forEach((child) => allCategoryIds.add(child.id));
  });

  // Also add country-specific categories
  CATEGORIES_SOLIGUIDE_FR.forEach((cat) => {
    allCategoryIds.add(cat.id);
    cat.children.forEach((child) => allCategoryIds.add(child.id));
  });
  CATEGORIES_SOLIGUIA_ES.forEach((cat) => {
    allCategoryIds.add(cat.id);
    cat.children.forEach((child) => allCategoryIds.add(child.id));
  });
  CATEGORIES_SOLIGUIA_AD.forEach((cat) => {
    allCategoryIds.add(cat.id);
    cat.children.forEach((child) => allCategoryIds.add(child.id));
  });

  // Group icons by category
  const iconsByCategory: Record<string, string[]> = {};
  const unmapped: string[] = [];

  svgFiles.forEach((file) => {
    const fileWithoutExt = file.replace(".svg", "");
    const fileWithoutOutlined = fileWithoutExt.replace("_outlined", "");

    // Check if this file matches a category
    if (allCategoryIds.has(fileWithoutOutlined)) {
      if (!iconsByCategory[fileWithoutOutlined]) {
        iconsByCategory[fileWithoutOutlined] = [];
      }
      iconsByCategory[fileWithoutOutlined].push(file);
    } else {
      unmapped.push(file);
    }
  });

  // Helper function to determine which countries a category belongs to
  function getCategoryCountries(categoryId: string): string[] {
    const countries: string[] = [];

    // Check if it's in base CATEGORIES
    const inBase = CATEGORIES.find(
      (cat) =>
        cat.id === categoryId || cat.children.some((c) => c.id === categoryId),
    );

    // Check FR specific
    const inFR = CATEGORIES_SOLIGUIDE_FR.find(
      (cat) =>
        cat.id === categoryId || cat.children.some((c) => c.id === categoryId),
    );

    // Check ES specific
    const inES = CATEGORIES_SOLIGUIA_ES.find(
      (cat) =>
        cat.id === categoryId || cat.children.some((c) => c.id === categoryId),
    );

    // Check AD specific
    const inAD = CATEGORIES_SOLIGUIA_AD.find(
      (cat) =>
        cat.id === categoryId || cat.children.some((c) => c.id === categoryId),
    );

    // Logic:
    // - If in CATEGORIES (base) only = "all" (world flag)
    // - If in specific country lists = only those country flags
    if (inBase && !inFR && !inES && !inAD) {
      // In base only, so available in all countries
      countries.push("all");
    } else {
      // Has specific country variants, only add those
      if (inFR) countries.push("FR");
      if (inES) countries.push("ES");
      if (inAD) countries.push("AD");
    }

    return countries;
  }

  // Build structured output based on ROOT_CATEGORIES
  const output: IconsOutput = {
    categories: {},
    countriesCategories: {
      FR: {},
      ES: {},
      AD: {},
    },
    unmapped,
    total: svgFiles.length,
    mappedCount: 0,
    unmappedCount: unmapped.length,
  };

  // Process common categories (from CATEGORIES base)
  ROOT_CATEGORIES.forEach((rootCat) => {
    const categoryData = CATEGORIES.find((cat) => cat.id === rootCat.id);
    if (!categoryData) return;

    const categoryIcons = iconsByCategory[rootCat.id] || [];
    const childrenIcons: Record<string, string[]> = {};

    // Get icons for all children from base CATEGORIES
    categoryData.children.forEach((child) => {
      const childIcons = iconsByCategory[child.id] || [];
      if (childIcons.length > 0) {
        childrenIcons[child.id] = childIcons.sort();
      }
    });

    output.categories[rootCat.id] = {
      name: CATEGORY_NAMES[rootCat.id] || rootCat.id,
      rank: rootCat.rank,
      icons: categoryIcons.sort(),
      children: childrenIcons,
    };

    output.mappedCount +=
      categoryIcons.length +
      Object.values(childrenIcons).reduce(
        (sum, icons) => sum + icons.length,
        0,
      );
  });

  // Process country-specific categories
  // France
  CATEGORIES_SOLIGUIDE_FR.forEach((frCat) => {
    const categoryIcons = iconsByCategory[frCat.id] || [];
    const childrenIcons: Record<string, string[]> = {};

    frCat.children.forEach((child) => {
      const childIcons = iconsByCategory[child.id] || [];
      if (childIcons.length > 0) {
        childrenIcons[child.id] = childIcons.sort();
      }
    });

    if (categoryIcons.length > 0 || Object.keys(childrenIcons).length > 0) {
      output.countriesCategories.FR[frCat.id] = {
        name: CATEGORY_NAMES[frCat.id] || frCat.id,
        icons: categoryIcons.sort(),
        children: childrenIcons,
      };

      output.mappedCount +=
        categoryIcons.length +
        Object.values(childrenIcons).reduce(
          (sum, icons) => sum + icons.length,
          0,
        );
    }
  });

  // Spain
  CATEGORIES_SOLIGUIA_ES.forEach((esCat) => {
    const categoryIcons = iconsByCategory[esCat.id] || [];
    const childrenIcons: Record<string, string[]> = {};

    esCat.children.forEach((child) => {
      const childIcons = iconsByCategory[child.id] || [];
      if (childIcons.length > 0) {
        childrenIcons[child.id] = childIcons.sort();
      }
    });

    if (categoryIcons.length > 0 || Object.keys(childrenIcons).length > 0) {
      output.countriesCategories.ES[esCat.id] = {
        name: CATEGORY_NAMES[esCat.id] || esCat.id,
        icons: categoryIcons.sort(),
        children: childrenIcons,
      };

      output.mappedCount +=
        categoryIcons.length +
        Object.values(childrenIcons).reduce(
          (sum, icons) => sum + icons.length,
          0,
        );
    }
  });

  // Andorra
  CATEGORIES_SOLIGUIA_AD.forEach((adCat) => {
    const categoryIcons = iconsByCategory[adCat.id] || [];
    const childrenIcons: Record<string, string[]> = {};

    adCat.children.forEach((child) => {
      const childIcons = iconsByCategory[child.id] || [];
      if (childIcons.length > 0) {
        childrenIcons[child.id] = childIcons.sort();
      }
    });

    if (categoryIcons.length > 0 || Object.keys(childrenIcons).length > 0) {
      output.countriesCategories.AD[adCat.id] = {
        name: CATEGORY_NAMES[adCat.id] || adCat.id,
        icons: categoryIcons.sort(),
        children: childrenIcons,
      };

      output.mappedCount +=
        categoryIcons.length +
        Object.values(childrenIcons).reduce(
          (sum, icons) => sum + icons.length,
          0,
        );
    }
  });

  // Write to JSON file
  fs.writeFileSync(outputFile, JSON.stringify(output, null, 2));

  console.log(`✅ Generated icons-list.json with ${svgFiles.length} icons`);
  console.log(`   📁 ${Object.keys(output.categories).length} root categories`);
  console.log(`   ✓ ${output.mappedCount} mapped icons`);
  if (output.unmappedCount > 0) {
    console.log(
      `   ⚠️  ${output.unmappedCount} unmapped icons (will be shown in "Autres")`,
    );
  }
} catch (error) {
  console.error("❌ Error generating icons list:", error);
  process.exit(1);
}
