import { Db } from "mongodb";
import Anthropic from "@anthropic-ai/sdk";
import { SearchSuggestion, SupportedLanguagesCode } from "@soliguide/common";

import { logger } from "../../src/general/logger";
import { CONFIG } from "../../src/_models";

const message =
  "Use Claude API to verify and correct search suggestion language";

// Language names mapping for Claude
const LANGUAGE_NAMES: Record<SupportedLanguagesCode, string> = {
  [SupportedLanguagesCode.AR]: "Arabic",
  [SupportedLanguagesCode.CA]: "Catalan",
  [SupportedLanguagesCode.EN]: "English",
  [SupportedLanguagesCode.ES]: "Spanish",
  [SupportedLanguagesCode.FA]: "Farsi/Persian",
  [SupportedLanguagesCode.FR]: "French",
  [SupportedLanguagesCode.KA]: "Georgian",
  [SupportedLanguagesCode.PS]: "Pashto",
  [SupportedLanguagesCode.PT]: "Portuguese",
  [SupportedLanguagesCode.RO]: "Romanian",
  [SupportedLanguagesCode.RU]: "Russian",
  [SupportedLanguagesCode.UK]: "Ukrainian",
};

interface SuggestionToVerify {
  _id: string;
  sourceId: string;
  lang: SupportedLanguagesCode;
  label: string;
  seoTitle: string;
  seoDescription: string;
  synonyms: string[];
  type: string;
  slug: string;
  country: string;
}

interface CorrectedSuggestion {
  sourceId: string;
  seoTitle: {
    expectedLang: string;
    currentLang: string;
    needUpdate: boolean;
    correctedText: string | null;
  };
  corrected: {
    label: string | null; // null if already correct
    seoDescription: string | null; // null if already correct
    synonyms: string[] | null; // null if already correct
  };
}

/**
 * Generate new sourceId in format CATEGORY_{SLUG}
 */
function generateSourceId(suggestion: Pick<SearchSuggestion, "slug">): string {
  return `CATEGORY_${suggestion.slug.toUpperCase()}`;
}

/**
 * Verify and correct a single suggestion using Claude API
 */
async function verifyAndCorrectSuggestion(
  anthropic: Anthropic,
  suggestion: SuggestionToVerify
): Promise<CorrectedSuggestion | null> {
  const systemPrompt = `You are a translation verification and correction assistant for a social services directory.

CRITICAL RULES:
1. DO NOT translate proper nouns: organization names (CAF, CIDFF, Restos du Cœur), establishment names, place names, acronyms
2. Mixed Catalan/Spanish is acceptable - DO NOT change
3. If text is ALREADY in the correct language, return null for that field
4. Only correct text that is clearly in the wrong language
5. Preserve the meaning and style of the original text when correcting
6. Keep acronyms and their explanations as-is (e.g., "CAF: caisse des allocations familiales")

YOU MUST respond with ONLY valid JSON, no other text.`;

  const userPrompt = `Verify if the fields of this suggestion are in ${
    LANGUAGE_NAMES[suggestion.lang]
  } (language code: ${suggestion.lang}).
If a field is already correct, return null. If it needs correction, return the corrected text in ${
    LANGUAGE_NAMES[suggestion.lang]
  }.

Suggestion:
- sourceId: ${suggestion.sourceId}
- type: ${suggestion.type}
- label: "${suggestion.label}"
- seoTitle: "${suggestion.seoTitle}"
- seoDescription: "${suggestion.seoDescription}"
- synonyms: [${suggestion.synonyms.map((s) => `"${s}"`).join(", ")}]

Respond with ONLY this JSON (no markdown):
{
  "sourceId": "${suggestion.sourceId}",
  "seoTitle": {
    "expectedLang": "${suggestion.lang}",
    "currentLang": "detected language code or same as expectedLang",
    "needUpdate": true or false,
    "correctedText": null or "corrected text"
  },
  "corrected": {
    "label": null or "corrected text",
    "seoDescription": null or "corrected text",
    "synonyms": null or ["corrected", "synonyms"]
  }
}`;

  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      temperature: 0,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: userPrompt,
        },
      ],
    });

    const content = response.content[0];
    if (content.type !== "text") {
      throw new Error("Unexpected response type from Claude");
    }

    // Clean the response text
    let jsonText = content.text.trim();

    // Remove markdown code blocks if present
    if (jsonText.startsWith("```json")) {
      jsonText = jsonText.replace(/^```json\s*/, "").replace(/\s*```$/, "");
    } else if (jsonText.startsWith("```")) {
      jsonText = jsonText.replace(/^```\s*/, "").replace(/\s*```$/, "");
    }

    jsonText = jsonText.trim();

    // Parse the JSON response
    const result = JSON.parse(jsonText) as CorrectedSuggestion;

    return result;
  } catch (error) {
    console.error(`   ❌ Error verifying: ${error}`);
    return null;
  }
}

export const up = async (db: Db) => {
  if (CONFIG.ENV !== "local") {
    logger.info(
      `[MIGRATION] - Skipping ${message} in local environment to avoid hitting API limits`
    );
    return;
  }
  console.log(`\n🚀 [MIGRATION] - ${message}\n`);

  // Check for API key
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error(
      "ANTHROPIC_API_KEY environment variable is required for this migration"
    );
  }

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const collection = db.collection<SearchSuggestion>("search_suggestions");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const query: any = {
    type: "CATEGORY",
  };

  const totalCount = await collection.countDocuments(query);
  console.log(`📊 Found ${totalCount} CATEGORY suggestions to verify\n`);

  if (totalCount === 0) {
    console.log(`⚠️  No search suggestions found to verify`);
    return;
  }

  const suggestions = await collection.find(query).toArray();

  console.log(`🔄 Starting verification...\n`);

  let okCount = 0;
  let correctionCount = 0;

  // Process each suggestion one by one
  for (let i = 0; i < suggestions.length; i++) {
    const s = suggestions[i];
    const suggestion: SuggestionToVerify = {
      _id: s._id.toString(),
      sourceId: s.sourceId,
      lang: s.lang,
      label: s.label || "",
      seoTitle: s.seoTitle || "",
      seoDescription: s.seoDescription || "",
      synonyms: s.synonyms || [],
      type: s.type,
      slug: s.slug,
      country: s.country,
    };

    // Display progress
    console.log(
      `[${i + 1}/${totalCount}] ${suggestion.country}/${suggestion.lang} - ${
        suggestion.sourceId
      } (${suggestion.type})`
    );

    try {
      const result = await verifyAndCorrectSuggestion(anthropic, suggestion);

      if (!result) {
        console.log(`   ⚠️  Error during verification\n`);
        continue;
      }

      // Log seoTitle analysis
      console.log(
        `   📝 seoTitle: expectedLang=${result.seoTitle.expectedLang}, currentLang=${result.seoTitle.currentLang}, needUpdate=${result.seoTitle.needUpdate}`
      );
      if (result.seoTitle.needUpdate) {
        console.log(
          `      ❌ "${suggestion.seoTitle}" → "${result.seoTitle.correctedText}"`
        );
      }

      // Count fields that need correction
      const needsLabelCorrection = result.corrected.label !== null;
      const needsSeoTitleCorrection = result.seoTitle.needUpdate;
      const needsSeoDescriptionCorrection =
        result.corrected.seoDescription !== null;
      const needsSynonymsCorrection = result.corrected.synonyms !== null;

      const needsAnyCorrection =
        needsLabelCorrection ||
        needsSeoTitleCorrection ||
        needsSeoDescriptionCorrection ||
        needsSynonymsCorrection;

      // Display result
      if (!needsAnyCorrection) {
        console.log(`   ✅ Tout est carré\n`);
        okCount++;
      } else {
        console.log(`   ⚠️  Corrections nécessaires:`);

        // Show fields that need correction
        if (needsLabelCorrection) {
          console.log(
            `      ❌ label: "${suggestion.label}" → "${result.corrected.label}"`
          );
        }
        if (needsSeoDescriptionCorrection) {
          console.log(
            `      ❌ seoDescription: "${suggestion.seoDescription}" → "${result.corrected.seoDescription}"`
          );
        }
        if (needsSynonymsCorrection) {
          console.log(
            `      ❌ synonyms: [${suggestion.synonyms.join(
              ", "
            )}] → [${result?.corrected?.synonyms?.join(", ")}]`
          );
        }
        console.log("");
        correctionCount++;
      }

      // Generate new sourceId based on label
      const newSourceId = generateSourceId(suggestion);
      const sourceIdChanged = newSourceId !== suggestion.sourceId;

      if (sourceIdChanged) {
        console.log(
          `   🔄 sourceId: "${suggestion.sourceId}" → "${newSourceId}"`
        );
      }

      // Prepare update object
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const updateFields: any = {
        updatedAt: new Date(),
      };

      // Add corrections to update
      if (needsLabelCorrection) {
        updateFields.label = result.corrected.label;
      }
      if (needsSeoTitleCorrection) {
        updateFields.seoTitle = result.seoTitle.correctedText;
      }
      if (needsSeoDescriptionCorrection) {
        updateFields.seoDescription = result.corrected.seoDescription;
      }
      if (needsSynonymsCorrection) {
        updateFields.synonyms = result.corrected.synonyms;
      }
      if (sourceIdChanged) {
        updateFields.sourceId = newSourceId;
      }

      // Update the document
      await collection.updateOne({ _id: s._id }, { $set: updateFields });

      // Small delay to avoid rate limiting
      if (i < suggestions.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 300));
      }
    } catch (error) {
      console.error(`   ❌ Error: ${error}\n`);

      // Still update updatedAt even on error, so we don't retry immediately
      await collection.updateOne(
        { _id: s._id },
        { $set: { updatedAt: new Date() } }
      );
    }
  }

  // Final summary
  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`📊 FINAL SUMMARY`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`✅ OK: ${okCount}`);
  console.log(`⚠️  Need corrections: ${correctionCount}`);
  console.log(`📊 Total: ${totalCount}`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
};

export const down = async () => {
  logger.info(`[ROLLBACK] - ${message}`);
  logger.info(
    `[ROLLBACK] - This is a read-only verification migration, no rollback needed.`
  );
};
