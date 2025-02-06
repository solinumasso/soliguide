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
import mongoose, { model } from "mongoose";
import { Categories, PlaceStatus, PlaceType } from "@soliguide/common";
import { UserForLogsSchema } from "./subschemas/user-for-logs.schema";
import { LocationLightSchema } from "../../search/models/subschemas/location-light.model";

const LogFicheSchema = new mongoose.Schema(
  {
    fiche: {
      ref: "Place",
      required: true,
      type: mongoose.Schema.Types.ObjectId,
    },

    ficheId: { required: true, type: Number },

    location: {
      default: null,
      type: LocationLightSchema,
    },

    // Whether the place still exist in Soliguide
    placeOnline: {
      default: true,
      required: true,
      type: Boolean,
    },

    placeType: {
      default: PlaceType.PLACE,
      enum: PlaceType,
      required: true,
      type: String,
    },

    seoUrl: { default: null, required: true, trim: true, type: String },

    // All categories from the place services
    serviceCategories: {
      default: [],
      enum: Categories,
      type: [String],
    },

    status: {
      default: PlaceStatus.ONLINE,
      enum: PlaceStatus,
      required: true,
      type: String,
    },

    userDatas: { type: UserForLogsSchema },
  },
  {
    collection: "logFiches",
    strict: true,
    timestamps: true,
  }
);

export const LogFicheModel = model("LogFiche", LogFicheSchema);
