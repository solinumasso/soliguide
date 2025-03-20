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
import mongoose from "mongoose";
import { locationAreasSchema } from "./location-areas.model";
import { SubSchemaId } from "../../../_models/mongo/types";
import { GeoPosition } from "@soliguide/common";

export const LocationLightSchema = new mongoose.Schema<
  SubSchemaId<
    Pick<
      GeoPosition,
      | "areas"
      | "coordinates"
      | "region"
      | "country"
      | "city"
      | "department"
      | "postalCode"
    >
  >
>(
  {
    areas: locationAreasSchema,
    coordinates: {
      default: [0, 0],
      type: [Number],
    },
    // New fields in data's worfklow schema
    region: {
      trim: true,
      type: String,
    },
    country: {
      trim: true,
      type: String,
    },
    city: {
      trim: true,
      type: String,
    },
    department: {
      trim: true,
      type: String,
    },
    postalCode: {
      index: true,
      trim: true,
      type: String,
    },
  },
  {
    strict: true,
    _id: false,
  }
);
