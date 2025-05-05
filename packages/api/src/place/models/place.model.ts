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
  type ApiPlace,
  CommonOpeningHours,
  Modalities,
  PlaceStatus,
  PlaceType,
  PlaceUpdateCampaign,
  PlaceVisibility,
  Publics,
  CommonPlaceEntity,
  SOLIGUIDE_COUNTRIES,
  SUPPORTED_LANGUAGES,
} from "@soliguide/common";

import mongoose, { model } from "mongoose";

import { GeoZoneSchema } from "./geoZone.model";
import { ModalitiesSchema } from "./modalities.model";
import { PlaceUpdateCampaignSchema } from "./placeUpdateCampaign.model";
import { PublicsSchema } from "./publics.model";

import {
  AirtableSyncSchema,
  AIRTABLE_SYNC_DEFAULT,
} from "../../airtable/models/airtableSync.model";
import { OpeningHoursSchema } from "./opening-hours.model";
import { TEMP_INFO } from "./default_values/TEMP_INFO.const";
import { ParcoursSchema } from "./parcours.model";
import { PositionSchema } from "./position.model";
import { ServiceSchema } from "./service.model";
import { SourceSchema } from "./source.model";
import { TempInfoSchema } from "./temp-info.model";
import { EntitySchema } from "./entity.model";

const PlaceSchema = new mongoose.Schema(
  {
    atSync: {
      default: AIRTABLE_SYNC_DEFAULT,
      required: true,
      type: AirtableSyncSchema,
    },

    auto: { default: false, type: Boolean },

    campaigns: {
      MAJ_ETE_2022: {
        default: new PlaceUpdateCampaign(),
        type: PlaceUpdateCampaignSchema,
      },
      MAJ_ETE_2023: {
        default: new PlaceUpdateCampaign(),
        type: PlaceUpdateCampaignSchema,
      },
      MAJ_ETE_2024: {
        default: new PlaceUpdateCampaign(),
        type: PlaceUpdateCampaignSchema,
      },
      MAJ_HIVER_2022: {
        default: new PlaceUpdateCampaign(),
        type: PlaceUpdateCampaignSchema,
      },
      MAJ_HIVER_2023: {
        default: new PlaceUpdateCampaign(),
        type: PlaceUpdateCampaignSchema,
      },
      END_YEAR_2024: {
        default: new PlaceUpdateCampaign(),
        type: PlaceUpdateCampaignSchema,
      },
      MID_YEAR_2025: {
        default: new PlaceUpdateCampaign(),
        type: PlaceUpdateCampaignSchema,
      },
      UKRAINE_2022: {
        changes: { default: false, type: Boolean },
        date: { default: null, type: Date },
        updated: { default: false, type: Boolean },
      },
    },
    createdBy: { default: null, trim: true, type: String },

    description: { default: null, trim: true, type: String },

    // Information about the place organizations
    entity: {
      type: EntitySchema,
      default: new CommonPlaceEntity(),
    },

    geoZones: {
      default: [],
      type: [GeoZoneSchema],
    },

    isOpenToday: {
      default: true,
      required: true,
      type: Boolean,
    },

    sourceLanguage: {
      type: String,
      enum: SUPPORTED_LANGUAGES,
    },
    country: {
      type: String,
      enum: SOLIGUIDE_COUNTRIES,
    },
    languages: {
      default: [],
      type: [String],
    },

    lieu_id: { required: true, type: Number, unique: true },

    modalities: {
      default: new Modalities(),
      type: ModalitiesSchema,
    },

    name: {
      index: true,
      required: true,
      trim: true,
      type: String,
    },

    newhours: {
      default: new CommonOpeningHours(),
      type: OpeningHoursSchema,
    },

    parcours: {
      default: [],
      type: [ParcoursSchema],
    },

    photos: {
      default: [],
      ref: "Photos",
      type: [mongoose.Schema.Types.ObjectId],
    },

    placeType: {
      default: PlaceType.PLACE,
      enum: PlaceType,
      index: true,
      trim: true,
      type: String,
      uppercase: true,
    },

    position: {
      default: null,
      type: PositionSchema,
    },

    priority: {
      default: false,
      type: Boolean,
    },

    publics: {
      default: new Publics(),
      type: PublicsSchema,
    },

    seo_url: {
      type: String,
      unique: true,
      required: true,
    },

    services_all: {
      default: [],
      type: [ServiceSchema],
    },

    slugs: {
      infos: {
        description: { default: null, trim: true, type: String },
        name: { default: null, trim: true, type: String },
      },
    },

    status: {
      default: PlaceStatus.DRAFT,
      enum: PlaceStatus,
      required: true,
      index: true,
      type: String,
    },

    // Form steps already filled
    // infos | contacts | photos | horaires | publics | conditions | services;
    stepsDone: {
      conditions: { default: false, type: Boolean },
      contacts: { default: false, type: Boolean },
      emplacement: { default: false, type: Boolean },
      horaires: { default: false, type: Boolean },
      infos: { default: true, type: Boolean },
      photos: { default: false, type: Boolean },
      publics: { default: false, type: Boolean },
      services: { default: false, type: Boolean },
    },

    sources: {
      default: [],
      type: [SourceSchema],
    },

    // Temporary closure information: closure, opening hours or message
    tempInfos: {
      default: TEMP_INFO,
      type: TempInfoSchema,
    },
    updatedByUserAt: { default: new Date(), type: Date, index: true },
    visibility: {
      default: PlaceVisibility.ALL,
      enum: PlaceVisibility,
      required: true,
      type: String,
    },
  },
  {
    strict: true,
    timestamps: true,
  }
);

PlaceSchema.index({ createdAt: 1, updatedAt: 1 });

export const PlaceModel = model<ApiPlace>("Place", PlaceSchema, "lieux");
