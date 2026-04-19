import {
  AutoCompleteType,
  SearchSuggestion,
  SUPPORTED_LANGUAGES_BY_COUNTRY,
  SoliguideCountries,
  SupportedLanguagesCode,
} from "@soliguide/common";
import Anthropic from "@anthropic-ai/sdk";
import { getLangsForCountry } from "../utils/getLangsForCountry";
import { LANGUAGE_NAMES } from "./constants";
import { searchSuggestionsService } from "../search-suggestions.service";

// === Types ===

export interface TranslationResult {
  seoTitle: string;
  seoDescription: string;
  synonyms: string[];
}

// === JSON I/O ===

export async function generateAutocompleteFiles(): Promise<void> {
  console.log(
    "🚀 Listing search suggestions JSON in @soliguide/common (by country)"
  );

  const countries = Object.keys(
    SUPPORTED_LANGUAGES_BY_COUNTRY
  ) as SoliguideCountries[];

  for (const country of countries) {
    const langs = getLangsForCountry(country);
    console.log(`\n🌍 Country: ${country} — Languages: ${langs.join(", ")}`);

    for (const lang of langs) {
      const suggestions = searchSuggestionsService.readSourceFile(
        country,
        lang
      );
      console.log(`  📝 ${country}/${lang}.json: ${suggestions.length} items`);
    }
  }

  console.log("\n✅ Done");
}

// === Translation functions ===

export function buildPrompt(suggestion: SearchSuggestion): string {
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

export function parseResponse(
  text: string,
  suggestion: SearchSuggestion
): TranslationResult {
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
    throw new Error("Missing required fields (seoTitle and seoDescription)");
  }

  const result: TranslationResult = {
    seoTitle: parsed.seoTitle.trim() as string,
    seoDescription: parsed.seoDescription.trim() as string,
    synonyms: [],
  };

  if (suggestion.type === AutoCompleteType.CATEGORY) {
    if (!parsed.synonyms || !Array.isArray(parsed.synonyms)) {
      throw new Error(
        "Synonyms are required and must be an array for categories"
      );
    }
    result.synonyms = parsed.synonyms.filter(
      (s: unknown): s is string => typeof s === "string" && s.trim().length > 0
    );
  } else {
    result.synonyms = suggestion.synonyms || [];
  }

  return result;
}

export async function translateCategory(
  suggestion: SearchSuggestion,
  anthropic: Anthropic
): Promise<TranslationResult> {
  const prompt = buildPrompt(suggestion);

  const response = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1024,
    temperature: 0.3,
    messages: [{ role: "user", content: prompt }],
  });

  const content = response.content[0];
  if (content.type !== "text") {
    throw new Error("Unexpected response format");
  }

  const jsonText = content.text.trim();
  return parseResponse(jsonText, suggestion);
}
