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
// scripts/translateCategories.ts
import "../../config/database/connection";
// import { GoogleGenAI } from "@google/genai";
import {
  AutoCompleteType,
  SearchSuggestion,
  SupportedLanguagesCode,
} from "@soliguide/common";
import { ModelWithId, CONFIG } from "../../_models";
import { SearchSuggestionModel } from "../models/search-suggestion.model";
import Anthropic from "@anthropic-ai/sdk";

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
  >
>;

const LANGUAGE_NAMES: Record<SupportedLanguagesCode, string> = {
  [SupportedLanguagesCode.AR]: "arabe",
  [SupportedLanguagesCode.CA]: "catalan",
  [SupportedLanguagesCode.EN]: "anglais",
  [SupportedLanguagesCode.ES]: "espagnol",
  [SupportedLanguagesCode.FA]: "farsi",
  [SupportedLanguagesCode.KA]: "géorgien",
  [SupportedLanguagesCode.PS]: "pachto",
  [SupportedLanguagesCode.RO]: "roumain",
  [SupportedLanguagesCode.RU]: "russe",
  [SupportedLanguagesCode.UK]: "ukrainien",
  [SupportedLanguagesCode.FR]: "français",
};

class CategoryTranslationScript {
  // private readonly genAI: GoogleGenAI;
  private readonly results: TranslationResult[] = [];
  private anthropic: Anthropic;

  constructor() {
    if (!CONFIG.GEMINI_API_KEY) {
      return;
    }
    this.anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY, // Ou votre méthode de config
    });
    // this.genAI = new GoogleGenAI({
    //   apiKey: CONFIG.GEMINI_API_KEY,
    // });
  }

  async run() {
    console.log("🚀 Starting automatic category translation...");

    const categories = await this.getCategories();

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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        console.error(
          `  ❌ Error while translating ${suggestion.label} into ${
            LANGUAGE_NAMES[suggestion.lang]
          }:`,
          error.message
        );
      }
    }
  }

  private async getCategories(): Promise<
    Array<SearchSuggestionForTranslation>
  > {
    const categories = await SearchSuggestionModel.find({ seoTitle: "" });

    return categories.map((doc) => ({
      sourceId: doc.sourceId,
      label: doc.label,
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
    // const response = await this.genAI.models.generateContent({
    //   model: "gemini-2.0-flash-001",
    //   contents: prompt,
    // });

    const prompt = this.buildPrompt(suggestion);

    try {
      const response = await this.anthropic.messages.create({
        model: "claude-sonnet-4-20250514", // Ou "claude-sonnet-4-5-20250929" (le plus intelligent)
        max_tokens: 1024,
        temperature: 0.3, // Plus bas = plus cohérent pour du JSON structuré
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      });

      // Extraction du contenu
      const content = response.content[0];
      if (content.type === "text") {
        const jsonText = content.text.trim();
        return this.parseResponse(jsonText, suggestion);
      }

      throw new Error("Format de réponse inattendu");
    } catch (error) {
      console.error("Erreur génération Claude:", error);
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
      console.error("❌ Raw Gemini response:", text);
      console.error("❌ Parsing error:", error.message);
      throw new Error(`Failed to parse JSON: ${error.message}`);
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

async function main() {
  try {
    const script = new CategoryTranslationScript();
    await script.run();
    process.exit(0);
  } catch (error) {
    console.error("❌ Fatal error:", error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

export { CategoryTranslationScript };
