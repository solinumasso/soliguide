import {
  Categories,
  SUPPORTED_LANGUAGES_BY_COUNTRY,
  SoliguideCountries,
  type FormattedSuggestion,
} from "@soliguide/common";
import { searchSuggestionsService } from "../search-suggestions.service";
import {
  getCategoryIdsForCountry,
  getCountryFlag,
} from "../utils/search-suggestions.utils";

// === Types ===

export interface MissingEntry {
  categoryKey: string;
  categoryId: string;
  country: string;
  lang: string;
  sourceId: string;
}

export interface ContentQualityIssue {
  entry: FormattedSuggestion;
  issues: string[];
}

export interface ContentQualityByCountry {
  country: SoliguideCountries;
  totalEntries: number;
  missingSeoTitle: number;
  missingSeoDescription: number;
  insufficientSynonyms: number;
  entriesWithIssues: ContentQualityIssue[];
}

export interface AnalysisResult {
  totalCategories: number;
  existingEntries: FormattedSuggestion[];
  missingEntries: MissingEntry[];
  entriesToTranslate: FormattedSuggestion[];
  extraEntries?: FormattedSuggestion[];
  expectedTotal?: number;
  contentQuality?: ContentQualityByCountry[];
}

// === Analysis ===

export function analyze(): AnalysisResult {
  console.log("🔍 Analysis: Scanning JSON source files and taxonomy...\n");

  const existingEntries = searchSuggestionsService.getAllSourceCategories();

  console.log("📋 Sample entries (first 5):");
  for (const entry of existingEntries.slice(0, 5)) {
    console.log(
      `  - ${entry.categoryId} | ${entry.country}-${entry.lang} | label: ${entry.label}`
    );
  }
  console.log("");

  const existingKeys = new Set(
    existingEntries.map((e) => `${e.categoryId}-${e.country}-${e.lang}`)
  );

  const expectedSourceIds = new Set<string>();
  const missingEntries: MissingEntry[] = [];
  let totalExpected = 0;

  for (const country of Object.keys(
    SUPPORTED_LANGUAGES_BY_COUNTRY
  ) as SoliguideCountries[]) {
    const categoryIdsForCountry = getCategoryIdsForCountry(country);
    const countryLanguages = SUPPORTED_LANGUAGES_BY_COUNTRY[country];
    const languages = [
      countryLanguages.source,
      ...countryLanguages.otherLanguages,
    ];

    for (const categoryId of categoryIdsForCountry) {
      const categoryKey =
        Object.keys(Categories).find(
          (key) => Categories[key as keyof typeof Categories] === categoryId
        ) || categoryId;

      for (const lang of languages) {
        const uniqueKey = `${categoryId}-${country}-${lang}`;
        expectedSourceIds.add(uniqueKey);
        totalExpected++;

        if (!existingKeys.has(uniqueKey)) {
          missingEntries.push({
            categoryKey,
            categoryId,
            country,
            lang,
            sourceId: categoryId,
          });
        }
      }
    }
  }

  const extraEntries = existingEntries.filter((entry) => {
    const categoryIdsForCountry = getCategoryIdsForCountry(
      entry.country as SoliguideCountries
    );
    return !categoryIdsForCountry.includes(entry.categoryId as Categories);
  });

  const entriesToTranslate =
    searchSuggestionsService.getUntranslatedSourceCategories();

  console.log("🔍 Analyzing content quality...\n");
  const contentQuality: ContentQualityByCountry[] = [];

  for (const country of Object.keys(
    SUPPORTED_LANGUAGES_BY_COUNTRY
  ) as SoliguideCountries[]) {
    const entriesForCountry = existingEntries.filter(
      (e) => e.country === country
    );
    const entriesWithIssues: ContentQualityIssue[] = [];
    let missingSeoTitle = 0;
    let missingSeoDescription = 0;
    let insufficientSynonyms = 0;

    for (const entry of entriesForCountry) {
      const issues: string[] = [];

      if (!entry.seoTitle || entry.seoTitle.trim() === "") {
        issues.push("Missing seoTitle");
        missingSeoTitle++;
      }

      if (!entry.seoDescription || entry.seoDescription.trim() === "") {
        issues.push("Missing seoDescription");
        missingSeoDescription++;
      }

      if (!entry.synonyms || entry.synonyms.length < 2) {
        issues.push(
          `Insufficient synonyms (${entry.synonyms?.length || 0}, need ≥2)`
        );
        insufficientSynonyms++;
      }

      if (issues.length > 0) {
        entriesWithIssues.push({ entry, issues });
      }
    }

    contentQuality.push({
      country,
      totalEntries: entriesForCountry.length,
      missingSeoTitle,
      missingSeoDescription,
      insufficientSynonyms,
      entriesWithIssues,
    });
  }

  displayAnalysisResult({
    totalCategories: Object.keys(Categories).length,
    existingEntries,
    missingEntries,
    entriesToTranslate,
    extraEntries,
    expectedTotal: totalExpected,
    contentQuality,
  });

  return {
    totalCategories: Object.keys(Categories).length,
    existingEntries,
    missingEntries,
    entriesToTranslate,
    extraEntries,
    contentQuality,
  };
}

export function displayAnalysisResult(result: AnalysisResult): void {
  console.log("=".repeat(80));
  console.log("📊 ANALYSIS SUMMARY - CATEGORIES ONLY");
  console.log("=".repeat(80));
  console.log(`Total categories in enum: ${result.totalCategories}`);
  console.log(
    `Expected total entries: ${result.expectedTotal || "calculating..."}`
  );
  console.log(`Existing entries in JSON: ${result.existingEntries.length}`);
  console.log(`Missing entries: ${result.missingEntries.length}`);
  console.log(`Extra entries (obsolete): ${result.extraEntries?.length || 0}`);
  console.log(
    `Entries needing translation: ${result.entriesToTranslate.length}`
  );
  console.log("=".repeat(80));

  console.log("\n📍 BREAKDOWN BY COUNTRY:\n");

  const existingByCountry: Record<string, number> = {};
  const missingByCountry: Record<string, number> = {};
  const toTranslateByCountry: Record<string, number> = {};
  const obsoleteByCountry: Record<string, number> = {};
  const newCategoriesByCountry: Record<string, number> = {};

  for (const country of Object.keys(SUPPORTED_LANGUAGES_BY_COUNTRY)) {
    existingByCountry[country] = 0;
    newCategoriesByCountry[country] = 0;
  }
  for (const entry of result.existingEntries) {
    existingByCountry[entry.country] =
      (existingByCountry[entry.country] || 0) + 1;
  }

  for (const entry of result.missingEntries) {
    missingByCountry[entry.country] =
      (missingByCountry[entry.country] || 0) + 1;
  }

  for (const entry of result.entriesToTranslate) {
    toTranslateByCountry[entry.country] =
      (toTranslateByCountry[entry.country] || 0) + 1;
  }

  if (result.extraEntries) {
    for (const entry of result.extraEntries) {
      obsoleteByCountry[entry.country] =
        (obsoleteByCountry[entry.country] || 0) + 1;
    }
  }

  for (const country of Object.keys(
    SUPPORTED_LANGUAGES_BY_COUNTRY
  ) as SoliguideCountries[]) {
    const categoryIdsForCountry = getCategoryIdsForCountry(country);
    const existingCategoriesForCountry = new Set(
      result.existingEntries
        .filter((e) => e.country === country)
        .map((e) => e.categoryId)
    );

    for (const categoryId of categoryIdsForCountry) {
      if (!existingCategoriesForCountry.has(categoryId)) {
        newCategoriesByCountry[country] =
          (newCategoriesByCountry[country] || 0) + 1;
      }
    }
  }

  const tableData = Object.keys(SUPPORTED_LANGUAGES_BY_COUNTRY).map(
    (country) => {
      const countryCode = country as SoliguideCountries;
      const countryLangs = SUPPORTED_LANGUAGES_BY_COUNTRY[countryCode];
      const langCount = 1 + countryLangs.otherLanguages.length;
      const categoriesCount = getCategoryIdsForCountry(countryCode).length;
      const expected = categoriesCount * langCount;
      const existing = existingByCountry[country] || 0;
      const missing = missingByCountry[country] || 0;
      const obsolete = obsoleteByCountry[country] || 0;
      const newCategories = newCategoriesByCountry[country] || 0;
      const toTranslate = toTranslateByCountry[country] || 0;

      return {
        Country: `${getCountryFlag(countryCode)} ${country.toUpperCase()}`,
        Categories: categoriesCount,
        Languages: langCount,
        Expected: expected,
        Existing: existing,
        Missing: missing,
        "New Cat.": newCategories,
        Obsolete: obsolete,
        "To Translate": toTranslate,
      };
    }
  );

  console.table(tableData);

  if (result.contentQuality && result.contentQuality.length > 0) {
    console.log("\n" + "=".repeat(80));
    console.log("📝 CONTENT QUALITY ANALYSIS");
    console.log("=".repeat(80));

    const qualityTable = result.contentQuality.map((quality) => ({
      Country: `${getCountryFlag(
        quality.country
      )} ${quality.country.toUpperCase()}`,
      Total: quality.totalEntries,
      "Missing seoTitle": quality.missingSeoTitle,
      "Missing seoDesc": quality.missingSeoDescription,
      "Insuff. synonyms": quality.insufficientSynonyms,
      "% Issues": `${(
        (quality.entriesWithIssues.length / quality.totalEntries) *
        100
      ).toFixed(1)}%`,
    }));

    console.table(qualityTable);
  }

  for (const country of Object.keys(
    SUPPORTED_LANGUAGES_BY_COUNTRY
  ) as SoliguideCountries[]) {
    console.log(`\n${"=".repeat(80)}`);
    console.log(`${getCountryFlag(country)} COUNTRY: ${country.toUpperCase()}`);
    console.log("=".repeat(80));

    const missingForCountry = result.missingEntries.filter(
      (e) => e.country === country
    );
    if (missingForCountry.length > 0) {
      console.log("\n🆕 MISSING CATEGORIES:");

      const byCategory: Record<string, string[]> = {};
      for (const entry of missingForCountry) {
        if (!byCategory[entry.categoryId]) {
          byCategory[entry.categoryId] = [];
        }
        byCategory[entry.categoryId].push(entry.lang);
      }

      for (const [categoryId, langs] of Object.entries(byCategory)) {
        const categoryKey = Object.keys(Categories).find(
          (key) => Categories[key as keyof typeof Categories] === categoryId
        );
        console.log(
          `  - ${categoryKey || categoryId}: ${langs.join(", ")} (${
            langs.length
          } languages)`
        );
      }
    } else {
      console.log("\n✅ No missing categories");
    }

    const obsoleteForCountry = result.extraEntries?.filter(
      (e) => e.country === country
    );
    if (obsoleteForCountry && obsoleteForCountry.length > 0) {
      console.log("\n🗑️  OBSOLETE CATEGORIES:");

      const byCategory: Record<string, { langs: string[]; label: string }> = {};
      for (const entry of obsoleteForCountry) {
        const categoryId = entry.categoryId as string;
        if (!byCategory[categoryId]) {
          byCategory[categoryId] = { langs: [], label: entry.label };
        }
        byCategory[categoryId].langs.push(entry.lang);
      }

      for (const [categoryId, info] of Object.entries(byCategory)) {
        console.log(
          `  - ${categoryId} (${info.label}): ${info.langs.join(", ")} (${
            info.langs.length
          } entries)`
        );
      }
    } else {
      console.log("\n✅ No obsolete categories");
    }

    const qualityForCountry = result.contentQuality?.find(
      (q) => q.country === country
    );
    if (qualityForCountry && qualityForCountry.entriesWithIssues.length > 0) {
      console.log("\n⚠️  CONTENT QUALITY ISSUES:");
      console.log(
        `  Total: ${qualityForCountry.entriesWithIssues.length}/${qualityForCountry.totalEntries} entries have issues\n`
      );

      const issuesByCategory: Record<
        string,
        { langs: string[]; issues: Set<string> }
      > = {};

      for (const { entry, issues } of qualityForCountry.entriesWithIssues) {
        const categoryId = entry.categoryId as string;
        if (!issuesByCategory[categoryId]) {
          issuesByCategory[categoryId] = { langs: [], issues: new Set() };
        }
        issuesByCategory[categoryId].langs.push(entry.lang);
        issues.forEach((issue) =>
          issuesByCategory[categoryId].issues.add(issue)
        );
      }

      const sortedCategories = Object.entries(issuesByCategory).sort(
        (a, b) => b[1].langs.length - a[1].langs.length
      );

      console.log("  Top categories with issues:");
      for (const [categoryId, info] of sortedCategories.slice(0, 10)) {
        const categoryKey =
          Object.keys(Categories).find(
            (key) => Categories[key as keyof typeof Categories] === categoryId
          ) || categoryId;
        console.log(
          `    - ${categoryKey}: ${info.langs.length} lang(s) - ${Array.from(
            info.issues
          ).join(", ")}`
        );
      }

      if (sortedCategories.length > 10) {
        console.log(`    ... and ${sortedCategories.length - 10} more`);
      }
    } else if (qualityForCountry) {
      console.log("\n✅ All entries have good content quality");
    }
  }

  console.log("");
}
