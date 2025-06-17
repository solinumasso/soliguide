// scripts/translateCategories.ts
import "../../config/database/connection";
import { GoogleGenAI } from "@google/genai";
import { SupportedLanguagesCode } from "@soliguide/common";
import path from "path";
import { CONFIG } from "../../_models";
import { SearchSuggestionModel } from "../models/search-suggestion.model";
import { SearchSuggestion } from "../types/search-suggestion.interface";
import { writeFile } from "fs/promises";

interface TranslationResult {
  referenceId: string;
  lang: SupportedLanguagesCode;
  seoTitle: string;
  seoDescription: string;
  synonyms: string[];
}

type SearchSuggestionForTranslation = Pick<
  SearchSuggestion,
  "referenceId" | "label" | "description" | "synonyms" | "type" | "categoryId"
>;
class CategoryTranslationScript {
  private genAI: GoogleGenAI;
  private results: TranslationResult[] = [];

  constructor() {
    if (!CONFIG.GOOGLE_API_KEY) {
      return;
    }
    this.genAI = new GoogleGenAI({ apiKey: CONFIG.GOOGLE_API_KEY });
  }

  async run() {
    console.log("🚀 Démarrage traduction automatique des catégories...");

    // 1. Récupérer les catégories françaises
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
          { referenceId: suggestion.referenceId },
          {
            lang: translation.lang,
            seoTitle: translation.seoTitle,
            seoDescription: translation.seoDescription,
            synonyms: translation.synonyms,
          }
        );

        // Délai pour éviter rate limit
        await this.delay(1500);
      } catch (error) {
        console.error(`  ❌ Erreur ${suggestion.label}:`, error.message);
        throw new Error("kpokpok");
      }
    }

    // 3. Sauvegarder les résultats
    await this.saveResults();
    console.log(`\n✅ Terminé ! ${this.results.length} traductions générées`);
  }

  private async getFrenchCategories(): Promise<
    Array<SearchSuggestionForTranslation>
  > {
    const categories = await SearchSuggestionModel.find({
      lang: SupportedLanguagesCode.FR,
      seoTitle: "",
    });

    return categories.map((doc) => ({
      referenceId: doc.referenceId,
      label: doc.label,
      description: doc.description || "",
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
      console.log({ text });
      return this.parseResponse(text, suggestion.referenceId, targetLang);
    } else {
      throw new Error("NO RESPONSE");
    }
  }

  private buildPrompt(
    suggestion: SearchSuggestionForTranslation,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _targetLang?: SupportedLanguagesCode
  ): string {
    return `Tu es expert en SEO et tu comprends très bien le Français Facile à Lire et à Comprendre pour un site qui recense des milliers de lieux solidaires: associations, ccas, maison des solidarités, accueils de jour, etc.

CONTEXTE SOLIGUIDE:
- Soliguide ne fait que référencer, on ne propose pas d'aide direct. Les lieux ne nous appartiennent pas
- Site d'aide sociale pour personnes précaires. Nous référencons des lieux,
- Public: sans-abri, personnes vulnérables, réfugiées, professionnels du Social
- Langue très simple, chaleureux, mots courants, phrases courtes
- Ton bienveillant et rassurant

Elements de référence:
- Nom: "${suggestion.label}"
- Description: "${suggestion.description}"
- Synonymes: ${suggestion.synonyms.join(
      ", "
    )} (15 maximum, dont 4 très familiers)

RÈGLES FALC:
Le facile à lire et à comprendre est une méthode qui a pour but de traduire un langage classique en un langage simplifié. Le FALC permet de rendre l’information plus simple et plus claire et est ainsi utile à tout le monde, notamment aux personnes en situation de handicap, dyslexiques, âgées ou encore maîtrisant mal la langue française.

- Mots simples et courants
- Phrases courtes (max 17 mots)
- Éviter jargon administratif/médical
- Utiliser "vous" jamais "tu"
- Être concret et direct avec des exemples

OBLIGATIONS:
- Titre SEO: le titre doit être le plus optimal poissble pour être référencé sur Google. Mentionner "Soliguide" à la fin ou milieu de phrase. Le 'label' doit être intégré dans la phrase, de manière naturelle. Intègre un exemple de synonyme dans le titre pour mettre du contexte. Pour certains cas, tu peux intégrer un émoji s'il permet de comprendre d'un clin d'oeil le sujet
- Description: mentionner "Soliguide" + géolocalisation ("près de chez vous"). 150-180 chars max
- Synonymes: mots que le public cible utilise vraiment. prendre en compte les synonymes proposés, en ajouter et mettre 10 synonymes maximum

RÉPONDS UNIQUEMENT AVEC CE JSON (aucun autre texte):
{
  "seoTitle": "Titre SEO",
  "seoDescription": "Description",
  "synonyms": ["synonyme 1", synonyme 2, etc]
}`;
  }

  private parseResponse(
    text: string,
    referenceId: string,
    lang: SupportedLanguagesCode = SupportedLanguagesCode.FR
  ): TranslationResult {
    try {
      const cleanText = text
        .trim()
        .replace(/```json|```/g, "")
        .trim();

      const parsed = JSON.parse(cleanText);

      if (!parsed.seoTitle || !parsed.seoDescription || !parsed.synonyms) {
        throw new Error("Champs manquants dans la réponse JSON");
      }

      if (!Array.isArray(parsed.synonyms)) {
        throw new Error("Les synonymes doivent être un tableau");
      }

      return {
        referenceId,
        lang,
        seoTitle: parsed.seoTitle.trim(),
        seoDescription: parsed.seoDescription.trim(),
        synonyms: parsed.synonyms.filter(
          (s: string) => s && s.trim().length > 0
        ),
      };
    } catch (error) {
      console.error("Réponse Gemini brute:", text);
      throw new Error(`Impossible de parser le JSON: ${error.message}`);
    }
  }

  private async saveResults() {
    const outputPath = path.join(__dirname, "../data/translations-output.json");

    const data = {
      generatedAt: new Date().toISOString(),
      totalTranslations: this.results.length,
      translations: this.results,
    };

    await writeFile(outputPath, JSON.stringify(data, null, 2));
    console.log(`💾 Résultats sauvés dans: ${outputPath}`);
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
