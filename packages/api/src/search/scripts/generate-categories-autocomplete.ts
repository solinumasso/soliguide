// scripts/translateCategories.ts
import "../../config/database/connection";
import { GoogleGenAI } from "@google/genai";
import {
  AutoCompleteType,
  CountryCodes,
  SearchSuggestion,
  SoliguideCountries,
  SupportedLanguagesCode,
} from "@soliguide/common";
import { CONFIG } from "../../_models";
import { SearchSuggestionModel } from "../models/search-suggestion.model";

interface TranslationResult {
  sourceId: string;
  lang: SupportedLanguagesCode;
  seoTitle: string;
  seoDescription: string;
  synonyms: string[];
}

type SearchSuggestionForTranslation = Pick<
  SearchSuggestion,
  | "sourceId"
  | "label"
  | "seoDescription"
  | "synonyms"
  | "type"
  | "categoryId"
  | "lang"
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
  private readonly genAI: GoogleGenAI;
  private readonly results: TranslationResult[] = [];

  constructor() {
    if (!CONFIG.GEMINI_API_KEY) {
      return;
    }
    this.genAI = new GoogleGenAI({
      apiKey: CONFIG.GEMINI_API_KEY,
    });
  }

  async run() {
    console.log("🚀 Démarrage traduction automatique des catégories...");

    // Get french Categories
    const categories = await this.getCategories();

    for (const suggestion of categories) {
      console.log(
        `\n🌍 Traduction de: ${suggestion.label} en ${
          LANGUAGE_NAMES[suggestion.lang]
        }`
      );
      try {
        const langTranslation = await this.translateCategory(suggestion);
        console.log({ langTranslation });
        console.log({ sourceId: suggestion.sourceId, lang: suggestion.lang });

        await SearchSuggestionModel.updateOne(
          { sourceId: suggestion.sourceId, lang: suggestion.lang },
          {
            seoTitle: langTranslation.seoTitle,
            seoDescription: langTranslation.seoDescription,
            synonyms: langTranslation.synonyms,
          },
          { upsert: true }
        );

        this.results.push(langTranslation);
      } catch (error) {
        console.error(
          `  ❌ Erreur ${suggestion.label} en ${
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
      categoryId: doc.categoryId,
    }));
  }

  private async translateCategory(
    suggestion: SearchSuggestionForTranslation
  ): Promise<TranslationResult> {
    const prompt = this.buildPrompt(suggestion);

    const response = await this.genAI.models.generateContent({
      model: "gemini-2.0-flash-001",
      contents: prompt,
    });

    if (response) {
      const text = response.text as string;
      return this.parseResponse(text, suggestion);
    } else {
      throw new Error("NO RESPONSE");
    }
  }

  private buildPrompt(
    suggestion: SearchSuggestionForTranslation,
    country?: SoliguideCountries
  ): string {
    const getContentTypeContext = (type: AutoCompleteType): string => {
      switch (type) {
        case AutoCompleteType.ORGANIZATION:
          return `ORGANISME spécifique (${suggestion.label}) - utilisateurs cherchent cette organisation près de chez eux`;

        case AutoCompleteType.ESTABLISHMENT_TYPE:
          return `TYPE D'ÉTABLISSEMENT (${suggestion.label}) - utilisateurs cherchent ce type d'établissement près de chez eux`;

        case AutoCompleteType.CATEGORY:
          return `CATÉGORIE d'aide sociale (${suggestion.label}) - utilisateurs cherchent de l'aide dans ce domaine`;

        default:
          return `RECHERCHE LIBRE (${suggestion.label}) - informations sur ce sujet`;
      }
    };

    const needsSynonyms = suggestion.type === AutoCompleteType.CATEGORY;
    const jsonFormat = `{
  "seoTitle": "Titre SEO optimisé",
  "seoDescription": "Description 150-160 chars avec géolocalisation"${
    needsSynonyms ? ',\n  "synonyms": ["terme1", "terme2"]' : ""
  }
}`;

    // Instructions langue et pays
    const langInstruction =
      suggestion.lang && suggestion.lang !== SupportedLanguagesCode.FR
        ? `\nIMPORTANT: Traduis tout dans la langue suivante: ${
            LANGUAGE_NAMES[suggestion.lang]
          }.`
        : "";

    const countryInstruction =
      country && country !== CountryCodes.FR
        ? `\nAdapte pour ${country} (organismes locaux, terminologie du pays).`
        : "";

    return `Expert SEO + FALC pour Soliguide (plateforme de lieux solidaires).

PUBLIC: Personnes précaires, sans-abri, réfugiés, professionnels sociaux
CONTEXTE: ${getContentTypeContext(suggestion.type)}

Nom: "${suggestion.label}"
Description: "${suggestion.seoDescription || "Non définie"}"
Pays: ${country || CountryCodes.FR}

RÈGLES:
- Mots simples, phrases courtes (max 22 mots)
- Éviter jargon administratif
- Utiliser "vous", ton bienveillant et direct
- Être concret avec exemples

OBLIGATIONS:
- Titre: PUNCHY et DIRECT, adapter selon le contexte émotionnel. Utiliser "${
      suggestion.label
    }" naturellement. Mentionner "Soliguide". PAS de ":" dans le titre. Language direct et engageant.
- Description: "Soliguide" + 3 EXEMPLES CONCRETS d'aide + géolocalisation (150-160 chars)${
      needsSynonyms ? "\n- Synonymes: 8-12 termes courants" : ""
    }

EXEMPLES DE TITRES PUNCHY SELON LE CONTEXTE:
- Santé: "Trouvez des soins gratuits avec Soliguide"
- Logement: "Trouvez de l'aide au logement avec Soliguide"
- Addiction: "Problèmes d'addiction ? Des structures spécialisées sont là pour vous aider"
- Alimentation: "Ne restez plus sans manger, Soliguide vous aide"
- Emploi: "Décrochez un travail, formez-vous avec Soliguide"
- Urgence sociale: "Besoin d'aide maintenant ? Soliguide vous trouve des solutions"

EXEMPLES DE DESCRIPTIONS AVEC 3 EXEMPLES CONCRETS:
- "Soliguide trouve près de chez vous : médecin gratuit, dentiste solidaire, infirmerie. Soins accessibles sans avance de frais."
- "Soliguide vous aide : hébergement d'urgence, logement social, aide au loyer. Solutions logement près de chez vous."

EXEMPLES D'ÉTABLISSEMENTS:
- "CCAS pour votre domiciliation"
- "Maison de santé près de chez vous"${langInstruction}${countryInstruction}

RÉPONDS UNIQUEMENT AVEC LE JSON BRUT, AUCUN TEXTE AVANT OU APRÈS. COMMENCE DIRECTEMENT PAR { ET TERMINE PAR }:
${jsonFormat}`;
  }

  private parseResponse(
    text: string,
    suggestion: SearchSuggestionForTranslation
  ): TranslationResult {
    try {
      // Nettoyer le texte
      let cleanText = text.trim();

      // Supprimer les balises de code si présentes
      cleanText = cleanText.replace(/```json\s*|```\s*/g, "");

      // Extraire le JSON entre les premières { et dernières }
      const firstBrace = cleanText.indexOf("{");
      const lastBrace = cleanText.lastIndexOf("}");

      if (firstBrace === -1 || lastBrace === -1 || firstBrace >= lastBrace) {
        throw new Error("Format JSON invalide - accolades manquantes");
      }

      const jsonText = cleanText.substring(firstBrace, lastBrace + 1);
      const parsed = JSON.parse(jsonText);

      console.log("✅ JSON parsé:", parsed);

      if (!parsed.seoTitle || !parsed.seoDescription) {
        throw new Error(
          "Champs manquants dans la réponse JSON (seoTitle et seoDescription requis)"
        );
      }

      const result: TranslationResult = {
        sourceId: suggestion.sourceId,
        lang: suggestion.lang,
        seoTitle: parsed.seoTitle.trim(),
        seoDescription: parsed.seoDescription.trim(),
        synonyms: [],
      };

      // Add synonyms only for categories
      if (suggestion.type === AutoCompleteType.CATEGORY) {
        if (!parsed.synonyms || !Array.isArray(parsed.synonyms)) {
          throw new Error(
            "Les synonymes sont requis et doivent être un tableau pour les catégories"
          );
        }
        result.synonyms = parsed.synonyms.filter(
          (s: string) => s && s.trim().length > 0
        );
      } else {
        result.synonyms = suggestion.synonyms || [];
      }

      return result;
    } catch (error) {
      console.error("❌ Réponse Gemini brute:", text);
      console.error("❌ Erreur de parsing:", error.message);
      throw new Error(`Impossible de parser le JSON: ${error.message}`);
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
    console.error("❌ Erreur fatale:", error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

export { CategoryTranslationScript };
