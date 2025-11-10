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
  SOLIGUIDE_COUNTRIES,
  SUPPORTED_LANGUAGES,
} from "@soliguide/common";
import mongoose from "mongoose";

const SearchSuggestionSchema = new mongoose.Schema<SearchSuggestion>(
  {
    sourceId: {
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

    label: {
      type: String,
      required: true,
    },

    // Categories ID: 600, 100 etc.
    categoryId: {
      default: null,
      nullable: true,
      enum: [...Object.values(Categories), null],
      index: true,
      type: String,
    },

    // Slug URL (ancien "seo")
    slug: {
      type: String,
      default: "",
      index: true,
    },

    // Synonymes en tableau
    synonyms: {
      type: [String],
      default: [],
    },

    // Type d'autocomplete
    type: {
      type: String,
      required: true,
      enum: Object.values(AutoCompleteType),
      index: true,
    },
    country: {
      type: String,
      required: true,
      enum: SOLIGUIDE_COUNTRIES,
      index: true,
    },

    content: {
      type: String,
      default: "",
    },

    seoTitle: {
      type: String,
      default: "",
    },

    seoDescription: {
      type: String,
      default: "",
      maxlength: 220,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
SearchSuggestionSchema.index({ sourceId: 1, lang: 1 }, { unique: true });
SearchSuggestionSchema.index({ lang: 1, type: 1 });

export const SearchSuggestionModel = mongoose.model(
  "SearchSuggestion",
  SearchSuggestionSchema,
  "search_suggestions"
);
