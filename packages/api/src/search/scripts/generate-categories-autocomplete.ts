// scripts/translateCategories.ts
import "../../config/database/connection";
import { GoogleGenAI } from "@google/genai";
import {
  AutoCompleteType,
  SearchSuggestion,
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
  "sourceId" | "label" | "seoDescription" | "synonyms" | "type" | "categoryId"
>;

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
    const frenchCategories = await this.getFrenchCategories();
    console.log(`📊 ${frenchCategories.length} catégories françaises trouvées`);

    for (const suggestion of frenchCategories) {
      console.log(`\n📝 Traduction de: ${suggestion.label}`);

      try {
        const translation = await this.translateCategory(
          suggestion,
          SupportedLanguagesCode.FR
        );

        await SearchSuggestionModel.updateOne(
          { sourceId: suggestion.sourceId },
          {
            lang: translation.lang,
            seoTitle: translation.seoTitle,
            seoDescription: translation.seoDescription,
            synonyms: translation.synonyms,
          }
        );

        await this.delay(1500);
      } catch (error) {
        console.error(`  ❌ Erreur ${suggestion.label}:`, error.message);
      }
    }

    console.log(`\n✅ Terminé ! ${this.results.length} traductions générées`);
  }

  private async getFrenchCategories(): Promise<
    Array<SearchSuggestionForTranslation>
  > {
    const categories = await SearchSuggestionModel.find({
      lang: SupportedLanguagesCode.FR,
    });

    return categories.map((doc) => ({
      sourceId: doc.sourceId,
      label: doc.label,
      seoDescription: doc.seoDescription || "",
      synonyms: doc.synonyms || [],
      type: doc.type,
      categoryId: doc.categoryId,
    }));
  }

  private async translateCategory(
    suggestion: SearchSuggestionForTranslation,
    targetLang?: SupportedLanguagesCode
  ): Promise<TranslationResult> {
    const prompt = this.buildPrompt(suggestion, targetLang);

    const response = await this.genAI.models.generateContent({
      model: "gemini-2.0-flash-001",
      contents: prompt,
    });

    if (response) {
      const text = response.text as string;

      return this.parseResponse(text, suggestion, targetLang);
    } else {
      throw new Error("NO RESPONSE");
    }
  }

  private buildPrompt(
    suggestion: SearchSuggestionForTranslation,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _targetLang?: SupportedLanguagesCode
  ): string {
    const getContentTypeContext = (type: AutoCompleteType): string => {
      switch (type) {
        case AutoCompleteType.ORGANIZATION:
          return `Il s'agit d'un ORGANISME/ASSOCIATION spécifique (${suggestion.label}). Les utilisateurs cherchent cette organisation précise près de chez eux.`;

        case AutoCompleteType.ESTABLISHMENT_TYPE:
          return `Il s'agit d'un TYPE D'ÉTABLISSEMENT (${suggestion.label}). Les utilisateurs cherchent n'importe quel établissement de ce type près de chez eux.`;

        case AutoCompleteType.CATEGORY:
          return `Il s'agit d'une CATÉGORIE thématique d'aide sociale (${suggestion.label}). Les utilisateurs cherchent de l'aide dans ce domaine.`;

        default:
          return `Il s'agit d'une recherche libre (${suggestion.label}). Les utilisateurs cherchent des informations ou de l'aide sur ce sujet.`;
      }
    };

    // Définir si on a besoin de synonymes
    const needsSynonyms = suggestion.type === AutoCompleteType.CATEGORY;
    const synonymsSection = needsSynonyms
      ? `
- Synonymes: mots que le public cible utilise vraiment pour cette catégorie. Mettre 8-12 synonymes maximum en langage courant.`
      : "";

    const jsonFormat = needsSynonyms
      ? `{
  "seoTitle": "Titre SEO adapté au type de contenu",
  "seoDescription": "Description adaptée au type avec géolocalisation",
  "synonyms": ["synonyme1", "synonyme2", "etc"]. Ils ne doivent pas faire plus de 2 mots
}`
      : `{
  "seoTitle": "Titre SEO adapté au type de contenu",
  "seoDescription": "Description adaptée au type avec géolocalisation"
}`;

    return `Tu es expert en SEO et tu comprends très bien le Français Facile à Lire et à Comprendre pour un site qui recense des milliers de lieux solidaires: associations, ccas, maison des solidarités, accueils de jour, etc.

CONTEXTE SOLIGUIDE:
- Soliguide ne fait que référencer, on ne propose pas d'aide direct. Les lieux ne nous appartiennent pas
- Site d'aide sociale pour personnes précaires. Nous référençons des lieux
- Public: sans-abri, personnes vulnérables, réfugiées, professionnels du Social
- Langue très simple, chaleureux, mots courants, phrases courtes
- Ton bienveillant et rassurant

CONTEXTE DU CONTENU:
${getContentTypeContext(suggestion.type)}

Elements de référence:
- Nom: "${suggestion.label}"
- Description: "${suggestion.seoDescription || "Pas de description fournie"}"
- Type: ${suggestion.type}

RÈGLES FALC:
Le facile à lire et à comprendre est une méthode qui a pour but de traduire un langage classique en un langage simplifié. Le FALC permet de rendre l'information plus simple et plus claire et est ainsi utile à tout le monde, notamment aux personnes en situation de handicap, dyslexiques, âgées ou encore maîtrisant mal la langue française.

- Mots simples et courants
- Ne pas répéter un même mot plusieurs fois dans le titre
- Phrases courtes (max 22 mots)
- Éviter jargon administratif/médical
- Utiliser "vous" jamais "tu"
- Être concret et direct avec des exemples

OBLIGATIONS:
- Titre SEO: le titre doit être le plus optimal possible pour être référencé sur Google. Il doit partir d'exemples concrets et mentionner "Soliguide". Le "Nom" doit être intégré dans la phrase, de manière naturelle. Adapter le style selon le type (organisme vs établissement vs catégorie).
- Description: mentionner "Soliguide" + géolocalisation ("près de chez vous"). 150-180 chars max. Adapter le message selon le type de contenu.${synonymsSection}.Des exemples d'aide apporté doivent figurer dans la description

EXEMPLES DE STYLE SELON LE TYPE:
- ORGANISME: "La CAF près de chez vous avec Soliguide" Indiquer des exemples d'aides à trouver : repas, vétements, accueil, etc
- ÉTABLISSEMENT: "CCAS pour votre domiciliation"
- CATÉGORIE: "Les aides au logement près de chez vous grâce à Soliguide"

RÉPONDS UNIQUEMENT AVEC CE JSON (aucun autre texte):
${jsonFormat}`;
  }

  private parseResponse(
    text: string,
    suggestion: SearchSuggestionForTranslation,
    lang: SupportedLanguagesCode = SupportedLanguagesCode.FR
  ): TranslationResult {
    try {
      const cleanText = text
        .trim()
        .replace(/```json|```/g, "")
        .trim();

      const parsed = JSON.parse(cleanText);
      console.log(parsed);
      if (!parsed.seoTitle || !parsed.seoDescription) {
        throw new Error(
          "Champs manquants dans la réponse JSON (seoTitle et seoDescription requis)"
        );
      }

      const result: TranslationResult = {
        sourceId: suggestion.sourceId,
        lang,
        seoTitle: parsed.seoTitle.trim(),
        seoDescription: parsed.seoDescription.trim(),
        synonyms: [],
      };

      // Add synonyms only for categories. For other things we will add them manually
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
        result.synonyms = suggestion.synonyms;
      }

      return result;
    } catch (error) {
      console.error("Réponse Gemini brute:", text);
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
