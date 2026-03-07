// scripts/translateCategories.ts
import "../../config/database/connection";
import {
  AutoCompleteType,
  SearchSuggestion,
  SOLIGUIDE_COUNTRIES,
  SupportedLanguagesCode,
} from "@soliguide/common";
import { ModelWithId } from "../../_models";
import { SearchSuggestionModel } from "../models/search-suggestion.model";
import Anthropic from "@anthropic-ai/sdk";
import { Command } from "commander";
import { LANGUAGE_NAMES } from "./constants";

interface TranslationResult {
  sourceId: string;
  lang: SupportedLanguagesCode;
  seoTitle: string;
  seoDescription: string;
  synonyms: string[];
}

type SearchSuggestionForTranslation = ModelWithId<
  Pick<
    SearchSuggestion,
    | "sourceId"
    | "label"
    | "seoDescription"
    | "synonyms"
    | "type"
    | "categoryId"
    | "lang"
    | "country"
    | "seoTitle"
  >
>;

interface ScriptOptions {
  country: string;
  lang: string;
  type: string;
  clean: boolean;
}

class CategoryTranslationScript {
  private readonly results: TranslationResult[] = [];
  private readonly anthropic: Anthropic;
  private readonly options: ScriptOptions;

  constructor(options: ScriptOptions) {
    this.options = options;

    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error(
        "❌ ANTHROPIC_API_KEY is not set in environment variables"
      );
    }

    this.anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
  }

  async run() {
    console.log("🚀 Starting automatic category translation...");
    console.log("📋 Parameters:");
    console.log(`  - Country: ${this.options.country}`);
    console.log(`  - Language: ${this.options.lang}`);
    console.log(`  - Type: ${this.options.type}`);
    console.log(`  - Clean mode: ${this.options.clean}`);
    console.log("");

    // If clean mode, clean existing data first
    if (this.options.clean) {
      await this.cleanExistingTranslations();
    }

    const categories = await this.getCategories();

    if (categories.length === 0) {
      console.log("✅ No categories to translate with the given criteria");
      return;
    }

    console.log(`📊 Found ${categories.length} categories to translate\n`);

    let successCount = 0;
    let errorCount = 0;

    for (const suggestion of categories) {
      console.log(
        `\n🌍 Translating: ${suggestion.label} into ${
          LANGUAGE_NAMES[suggestion.lang]
        } - Country ${suggestion.country}`
      );
      try {
        const langTranslation = await this.translateCategory(suggestion);

        await SearchSuggestionModel.updateOne(
          { _id: suggestion._id },
          {
            seoTitle: langTranslation.seoTitle,
            seoDescription: langTranslation.seoDescription,
            synonyms: langTranslation.synonyms,
          },
          { upsert: true }
        );

        this.results.push(langTranslation);
        successCount++;
        console.log(`  ✅ Successfully translated`);

        // Add delay to avoid rate limiting
        await this.delay(1000);
      } catch (error: any) {
        errorCount++;
        console.error(
          `  ❌ Error while translating ${suggestion.label} into ${
            LANGUAGE_NAMES[suggestion.lang]
          }:`,
          error.message
        );
      }
    }

    console.log("\n" + "=".repeat(50));
    console.log("📊 Translation Summary:");
    console.log(`  ✅ Success: ${successCount}`);
    console.log(`  ❌ Errors: ${errorCount}`);
    console.log(`  📝 Total processed: ${categories.length}`);
    console.log("=".repeat(50));
  }

  private buildMongoQuery(forCleaning: boolean = false): any {
    const query: any = {};

    // Only filter by seoTitle if not cleaning (we want untranslated items)
    if (!forCleaning) {
      query.$or = [{ seoTitle: "" }, { seoTitle: { $exists: false } }];
    }

    // Add type filters if necessary
    if (this.options.type !== "all") {
      const typeMap: Record<string, AutoCompleteType> = {
        categories: AutoCompleteType.CATEGORY,
        establishments: AutoCompleteType.ESTABLISHMENT_TYPE,
        organizations: AutoCompleteType.ORGANIZATION,
      };

      if (typeMap[this.options.type]) {
        query.type = typeMap[this.options.type];
      }
    }

    // Add country filters if necessary
    if (this.options.country !== "all") {
      query.country = this.options.country;
    }

    // Add language filters if necessary
    if (this.options.lang !== "all") {
      query.lang = this.options.lang;
    }

    return query;
  }

  private async cleanExistingTranslations(): Promise<void> {
    console.log("🧹 Cleaning existing translations...");

    // Build query for cleaning - select ALL items matching country/lang filters
    const query = this.buildMongoQuery(true);

    const result = await SearchSuggestionModel.updateMany(query, {
      $set: {
        seoTitle: "",
        seoDescription: "",
      },
    });

    console.log(`  ✅ Cleaned ${result.modifiedCount} existing translations\n`);
  }

  private async getCategories(): Promise<SearchSuggestionForTranslation[]> {
    // Build query - will filter by empty seoTitle (items to translate)
    const query = this.buildMongoQuery(false);

    const categories = await SearchSuggestionModel.find(query);

    return categories.map((doc) => ({
      sourceId: doc.sourceId,
      label: doc.label,
      seoTitle: doc.seoTitle || "",
      seoDescription: doc.seoDescription || "",
      synonyms: doc.synonyms || [],
      type: doc.type,
      lang: doc.lang,
      country: doc.country,
      _id: doc._id,
      categoryId: doc.categoryId,
    }));
  }

  private async translateCategory(
    suggestion: SearchSuggestionForTranslation
  ): Promise<TranslationResult> {
    const prompt = this.buildPrompt(suggestion);

    try {
      const response = await this.anthropic.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1024,
        temperature: 0.3,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      });

      // Extract content
      const content = response.content[0];
      if (content.type === "text") {
        const jsonText = content.text.trim();
        return this.parseResponse(jsonText, suggestion);
      }

      throw new Error("Unexpected response format");
    } catch (error) {
      console.error("Claude generation error:", error);
      throw error;
    }
  }

  private buildPrompt(suggestion: SearchSuggestionForTranslation): string {
    const { label, country, lang, type } = suggestion;
    const language = LANGUAGE_NAMES[lang];
    const needsSynonyms = type === AutoCompleteType.CATEGORY;

    const getContentTypeContext = (type: AutoCompleteType): string => {
      const contexts: { [key in AutoCompleteType]?: string } = {
        [AutoCompleteType.ORGANIZATION]: "ORGANISME spécifique",
        [AutoCompleteType.ESTABLISHMENT_TYPE]: "TYPE D'ÉTABLISSEMENT",
        [AutoCompleteType.CATEGORY]: "CATÉGORIE d'aide sociale",
      };
      const context = contexts[type] || "RECHERCHE LIBRE";
      const usage =
        type === AutoCompleteType.CATEGORY
          ? "utilisateurs cherchent de l'aide dans ce domaine"
          : type === AutoCompleteType.ORGANIZATION ||
            type === AutoCompleteType.ESTABLISHMENT_TYPE
          ? "utilisateurs cherchent ce lieu près de chez eux"
          : "informations sur ce sujet";

      return `${context} (${label}) - ${usage}`;
    };

    const jsonFormat = needsSynonyms
      ? `{
  "seoTitle": "Titre SEO optimisé",
  "seoDescription": "Description 150-160 chars",
  "synonyms": ["terme1", "terme2"]
}`
      : `{
  "seoTitle": "Titre SEO optimisé",
  "seoDescription": "Description 150-160 chars"
}`;

    return `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 PARAMÈTRES OBLIGATOIRES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PAYS: ${country}
LANGUE: ${language} (${lang})
ÉLÉMENT: "${label}"
TYPE: ${getContentTypeContext(type)}

⚠️ CRITIQUE: TOUT le JSON doit être en ${language}, aucune autre langue acceptée.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PUBLIC: Personnes précaires, sans-abri, réfugiés, professionnels sociaux en ${country}

📋 NORME OBLIGATOIRE: ISO 24495-1:2023 - Langage clair et simple
- Phrases courtes (max 22 mots), mots simples
- Ton bienveillant, "vous", sans jargon ni stigmatisation
- Exemples concrets et locaux (${country})

CONSIGNES SEO:
1. TITRE (empathique, non commercial)
   • Inclure "${label}" + "Soliguide" naturellement
   • Pas de ":" ni majuscule en milieu de phrase

2. DESCRIPTION (150-160 caractères)
   • Inclure "Soliguide"
   • 3 exemples concrets d'aide en ${country}
${
  needsSynonyms
    ? `
3. SYNONYMES (15 mots en ${language})
   • Termes concrets illustrant le service
   • Pas de répétition (ex: repos, reposer → une seule forme)
   • Éviter: social, aide, accompagnement (trop génériques)
   • Ex. accueil: cafe repos parler femme harcelement discuter rencontrer`
    : ""
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EXEMPLES (à adapter en ${language}):

Titres:
- "Trouvez des soins gratuits avec Soliguide"
- "Face à l'addiction, ne restez plus seuls. Découvrez les lieux d'aide sur Soliguide"

Descriptions:
- "Soliguide vous propose des centaines de lieux pour manger, obtenir un colis alimentaire ou des chèques alimentation"
${
  needsSynonyms
    ? `
Synonymes:
- Espace de repos: reposer dormir repos pause`
    : ""
}

Établissements ${country}:
- "CCAS pour votre domiciliation"
- "Maison de santé près de chez vous"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✓ JSON 100% en ${language} | ✓ Exemples locaux ${country} | ✓ ISO 24495-1:2023

${jsonFormat}

RÉPONDS UNIQUEMENT AVEC LE JSON. COMMENCE PAR { ET TERMINE PAR }`;
  }

  private parseResponse(
    text: string,
    suggestion: SearchSuggestionForTranslation
  ): TranslationResult {
    try {
      let cleanText = text.trim();
      cleanText = cleanText.replace(/```json\s*|```\s*/g, "");

      const firstBrace = cleanText.indexOf("{");
      const lastBrace = cleanText.lastIndexOf("}");

      if (firstBrace === -1 || lastBrace === -1 || firstBrace >= lastBrace) {
        throw new Error("Invalid JSON format - braces missing");
      }

      const jsonText = cleanText.substring(firstBrace, lastBrace + 1);
      const parsed = JSON.parse(jsonText);

      if (!parsed.seoTitle || !parsed.seoDescription) {
        throw new Error(
          "Missing fields in JSON response (seoTitle and seoDescription required)"
        );
      }

      const result: TranslationResult = {
        sourceId: suggestion.sourceId,
        lang: suggestion.lang,
        seoTitle: parsed.seoTitle.trim(),
        seoDescription: parsed.seoDescription.trim(),
        synonyms: [],
      };

      if (suggestion.type === AutoCompleteType.CATEGORY) {
        if (!parsed.synonyms || !Array.isArray(parsed.synonyms)) {
          throw new Error(
            "Synonyms are required and must be an array for categories"
          );
        }
        result.synonyms = parsed.synonyms.filter(
          (s: string) => s && s.trim().length > 0
        );
      } else {
        result.synonyms = suggestion.synonyms || [];
      }

      return result;
    } catch (error: any) {
      console.error("❌ Raw Claude response:", text);
      console.error("❌ Parsing error:", error.message);
      throw new Error(`Failed to parse JSON: ${error.message}`);
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// Configure commander
const program = new Command();

program
  .name("translate-categories")
  .description("Translate Soliguide categories with AI")
  .version("1.0.0")
  .requiredOption(
    "-c, --country <country>",
    "Country code (FR, ES, etc.) or 'all' for all countries"
  )
  .requiredOption(
    "-l, --lang <lang>",
    "Language code (fr, en, es, etc.) or 'all' for all languages"
  )
  .requiredOption(
    "-t, --type <type>",
    "Type to translate: categories, establishments, organizations, or all"
  )
  .option("--clean", "Clean existing translations before starting", false)
  .action(async (options) => {
    try {
      // Validate type
      const validTypes = [
        "categories",
        "establishments",
        "organizations",
        "all",
      ];
      if (!validTypes.includes(options.type)) {
        console.error(`❌ Invalid type: ${options.type}`);
        console.error(`Valid options: ${validTypes.join(", ")}`);
        process.exit(1);
      }

      if (options.country !== "all") {
        if (!SOLIGUIDE_COUNTRIES.includes(options.country)) {
          console.error(`❌ Invalid country: ${options.country}`);
          console.error(
            `Valid options: ${SOLIGUIDE_COUNTRIES.join(", ")}, all`
          );
          process.exit(1);
        }
      }

      if (options.lang !== "all") {
        const validLangs = Object.values(SupportedLanguagesCode);
        if (!validLangs.includes(options.lang)) {
          console.error(`❌ Invalid language: ${options.lang}`);
          console.error(`Valid options: ${validLangs.join(", ")}, all`);
          process.exit(1);
        }
      }

      const script = new CategoryTranslationScript({
        country: options.country,
        lang: options.lang,
        type: options.type,
        clean: options.clean,
      });

      await script.run();
      process.exit(0);
    } catch (error) {
      console.error("❌ Fatal error:", error);
      process.exit(1);
    }
  });

program.addHelpText(
  "after",
  `
Required Parameters:
  --country, -c    Country code (required)
  --lang, -l       Language code (required)
  --type, -t       Type to translate (required)

Valid country codes: ${SOLIGUIDE_COUNTRIES.join(", ")}, all
Valid language codes: ${Object.values(SupportedLanguagesCode).join(", ")}, all
Valid types: categories, establishments, organizations, all

Examples:
  $ tsx scripts/translateCategories.ts --country FR --lang en --type categories
    Translate all French categories to English

  $ tsx scripts/translateCategories.ts --country all --lang es --type organizations
    Translate organizations from all countries to Spanish

  $ tsx scripts/translateCategories.ts --country all --lang all --type all --clean
    Clean all existing translations and retranslate everything

  $ tsx scripts/translateCategories.ts --country FR --lang fr --type establishments --clean
    Clean and retranslate all French establishments in French
`
);

// Display help if no arguments provided
if (process.argv.length === 2) {
  program.help();
}

// Parse arguments
try {
  program.parse(process.argv);
} catch (error) {
  // Commander will automatically display error and help for missing required options
  process.exit(1);
}

export { CategoryTranslationScript };
