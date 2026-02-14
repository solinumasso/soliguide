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
import { Db } from "mongodb";
import { franc } from "franc-min";
import { SearchSuggestion, SupportedLanguagesCode } from "@soliguide/common";

import { logger } from "../src/general/logger";

const message =
  "Verify that search suggestion labels, seoTitles and seoDescriptions are in the correct source language";

// Mapping between franc ISO 639-3 codes and Soliguide language codes
const francToSoliguideMap: Record<string, SupportedLanguagesCode> = {
  ara: SupportedLanguagesCode.AR, // Arabic
  cat: SupportedLanguagesCode.CA, // Catalan
  eng: SupportedLanguagesCode.EN, // English
  spa: SupportedLanguagesCode.ES, // Spanish
  pes: SupportedLanguagesCode.FA, // Farsi/Persian
  kat: SupportedLanguagesCode.KA, // Georgian
  pus: SupportedLanguagesCode.PS, // Pashto
  ron: SupportedLanguagesCode.RO, // Romanian
  rus: SupportedLanguagesCode.RU, // Russian
  ukr: SupportedLanguagesCode.UK, // Ukrainian
  fra: SupportedLanguagesCode.FR, // French
};

interface LanguageIssue {
  sourceId: string;
  expectedLang: string;
  country: string;
  type: string;
  issues: {
    field: "label" | "seoTitle" | "seoDescription";
    value: string;
    detectedLang: string;
    confidence: "low" | "high";
  }[];
}

/**
 * Detects language and converts franc code to Soliguide code
 */
function detectLanguage(text: string): {
  detected: SupportedLanguagesCode | null;
  confidence: "low" | "high";
} {
  if (!text || text.trim().length < 10) {
    return { detected: null, confidence: "low" };
  }

  const francCode = franc(text);

  // franc returns "und" when it cannot determine the language
  if (francCode === "und") {
    return { detected: null, confidence: "low" };
  }

  // Convert franc code to Soliguide code
  const detected = francToSoliguideMap[francCode] || null;

  // High confidence if text is longer than 30 chars
  const confidence = text.trim().length > 30 ? "high" : "low";

  return { detected, confidence };
}

export const up = async (db: Db) => {
  logger.info(`[MIGRATION] - ${message}`);

  const collection = db.collection<SearchSuggestion>("search_suggestions");

  // Count total documents
  const totalCount = await collection.countDocuments();
  logger.info(`[MIGRATION] - Found ${totalCount} search suggestions to verify`);

  if (totalCount === 0) {
    logger.warn(`[MIGRATION] - No search suggestions found, skipping`);
    return;
  }

  // Fetch all suggestions
  const suggestions = await collection.find().toArray();

  const issues: LanguageIssue[] = [];
  let checkedCount = 0;

  for (const suggestion of suggestions) {
    checkedCount++;

    if (checkedCount % 100 === 0) {
      logger.info(
        `[MIGRATION] - Progress: ${checkedCount}/${totalCount} suggestions checked`
      );
    }

    const suggestionIssues: LanguageIssue["issues"] = [];

    // Check label
    if (suggestion.label) {
      const { detected, confidence } = detectLanguage(suggestion.label);
      if (
        detected &&
        detected !== suggestion.lang &&
        confidence === "high"
      ) {
        suggestionIssues.push({
          field: "label",
          value: suggestion.label,
          detectedLang: detected,
          confidence,
        });
      }
    }

    // Check seoTitle
    if (suggestion.seoTitle) {
      const { detected, confidence } = detectLanguage(suggestion.seoTitle);
      if (
        detected &&
        detected !== suggestion.lang &&
        confidence === "high"
      ) {
        suggestionIssues.push({
          field: "seoTitle",
          value: suggestion.seoTitle,
          detectedLang: detected,
          confidence,
        });
      }
    }

    // Check seoDescription
    if (suggestion.seoDescription) {
      const { detected, confidence } = detectLanguage(
        suggestion.seoDescription
      );
      if (
        detected &&
        detected !== suggestion.lang &&
        confidence === "high"
      ) {
        suggestionIssues.push({
          field: "seoDescription",
          value: suggestion.seoDescription,
          detectedLang: detected,
          confidence,
        });
      }
    }

    // If issues found, add to report
    if (suggestionIssues.length > 0) {
      issues.push({
        sourceId: suggestion.sourceId,
        expectedLang: suggestion.lang,
        country: suggestion.country,
        type: suggestion.type,
        issues: suggestionIssues,
      });
    }
  }

  // Report results
  logger.info(
    `[MIGRATION] - Verification completed. Checked ${checkedCount} suggestions.`
  );

  if (issues.length === 0) {
    logger.info(
      `[MIGRATION] - ✅ All search suggestions have correct language in their fields!`
    );
  } else {
    logger.warn(
      `[MIGRATION] - ⚠️  Found ${issues.length} search suggestions with potential language mismatches:`
    );

    // Group by country and language for better readability
    const groupedIssues = issues.reduce(
      (acc, issue) => {
        const key = `${issue.country}/${issue.expectedLang}`;
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(issue);
        return acc;
      },
      {} as Record<string, LanguageIssue[]>
    );

    for (const [group, groupIssues] of Object.entries(groupedIssues)) {
      logger.warn(`\n[MIGRATION] - Issues for ${group}:`);
      for (const issue of groupIssues) {
        logger.warn(
          `  - sourceId: ${issue.sourceId}, type: ${issue.type}`
        );
        for (const fieldIssue of issue.issues) {
          logger.warn(
            `    * ${fieldIssue.field}: detected as "${fieldIssue.detectedLang}" instead of "${issue.expectedLang}"`
          );
          logger.warn(
            `      Value: "${fieldIssue.value.substring(0, 100)}${fieldIssue.value.length > 100 ? "..." : ""}"`
          );
        }
      }
    }

    logger.warn(
      `\n[MIGRATION] - Summary: ${issues.length} suggestions with language issues found.`
    );
    logger.warn(
      `[MIGRATION] - These should be reviewed and potentially corrected in the source JSON files.`
    );
  }
};

export const down = async (db: Db) => {
  logger.info(`[ROLLBACK] - ${message}`);
  logger.info(`[ROLLBACK] - This is a read-only verification migration, no rollback needed.`);
};
