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
import {
  AutoCompleteType,
  Categories,
  SearchSuggestion,
  SUPPORTED_LANGUAGES,
  SupportedLanguagesCode,
} from "@soliguide/common";
import mongoose from "mongoose";

const SearchSuggestionSchema = new mongoose.Schema<SearchSuggestion>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    referenceId: {
      type: String,
      required: true,
      index: true,
    },

    lang: {
      type: String,
      required: true,
      index: true,
      enum: [...SUPPORTED_LANGUAGES],
    },

    // Categories ID: 600, 100 etc.
    categoryId: {
      default: null,
      enum: [...Object.values(Categories), null],
      index: true,
      type: String,
    },

    description: {
      default: "",
      type: String,
    },

    expressionId: {
      default: null,
      index: true,
      type: String,
    },

    // Translated Label: Restauration, Domiciliation, etc
    label: {
      default: "",
      required: true,
      type: String,
    },

    // Slug URL (ancien "seo")
    slug: {
      default: "",
      type: String,
      index: true,
    },

    // Synonymes en tableau
    synonyms: {
      type: [String],
      default: [],
    },

    // Type d'autocomplete
    type: {
      default: AutoCompleteType.CATEGORY,
      enum: AutoCompleteType,
      type: String,
      required: true,
    },

    // Nouveaux champs SEO
    seoTitle: {
      type: String,
      default: "",
    },

    seoDescription: {
      type: String,
      default: "",
      maxlength: 220,
    },

    // Champ de recherche optimisé (généré automatiquement)
    searchText: {
      type: String,
      default: "",
      index: "text", // Index texte pour recherche native MongoDB si besoin
    },

    // Champ normalisé pour les langues non-latines
    normalizedSearchText: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

SearchSuggestionSchema.index({ lang: 1, type: 1 });
SearchSuggestionSchema.index({ referenceId: 1, lang: 1 }, { unique: true });

SearchSuggestionSchema.pre("save", function () {
  if (!this.id) {
    this.id = `${this.referenceId}_${this.lang}`;
  }

  this.searchText = [this.label, ...this.synonyms, this.description]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  if (this.lang === SupportedLanguagesCode.AR) {
    this.normalizedSearchText = normalizeArabic(this.searchText);
  } else if (["ru", "uk"].includes(this.lang)) {
    this.normalizedSearchText = normalizeCyrillic(this.searchText);
  } else {
    this.normalizedSearchText = this.searchText
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }
});

const normalizeArabic = function (text: string): string {
  return text
    .replace(/[إأآا]/g, "ا")
    .replace(/[ىي]/g, "ي")
    .replace(/[ةه]/g, "ه");
};

const normalizeCyrillic = function (text: string): string {
  return text.replace(/ё/g, "е");
};

export const SearchSuggestionModel = mongoose.model(
  "SearchSuggestion",
  SearchSuggestionSchema,
  "search_suggestions"
);
