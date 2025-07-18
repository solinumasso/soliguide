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
import { ModelWithId } from "../../_models";
import { ApiPlace } from "@soliguide/common";
import mongoose, { ClientSession, FilterQuery } from "mongoose";
import { PlaceModel } from "../models/place.model";

import { OrganizationModel } from "../../organization/models/organization.model";

/**
 * @summary Get a place from an SEO url or ID
 * @param {any} params place ID or seo_url
 */
export const getPlaceByParams = async (
  params: FilterQuery<ApiPlace>,
  session?: ClientSession
): Promise<ModelWithId<ApiPlace> | null> => {
  if (params._id) {
    params._id = new mongoose.Types.ObjectId(params._id);
  }
  const place = await PlaceModel.findOne(params)
    .select("+atSync")
    .populate([
      {
        path: "parcours",
        populate: { model: "Photos", path: "photos" },
      },
      { model: "Photos", path: "photos" },
      {
        path: "services_all",
        populate: { model: "Docs", path: "modalities.docs" },
      },
      { model: "Docs", path: "modalities.docs" },
    ])
    .session(session ?? null)
    .lean<ModelWithId<ApiPlace>>()
    .exec();

  if (place) {
    place.organizations = await OrganizationModel.find(
      { places: { $in: place._id } },
      { name: 1, organization_id: 1, _id: 0 }
    )
      .session(session ?? null)
      .exec();
  }
  return place;
};

export const findPlacesByParams = async (
  params: FilterQuery<ApiPlace>
): Promise<Array<ModelWithId<ApiPlace>>> => {
  if (params._id) {
    params._id = new mongoose.Types.ObjectId(params._id);
  }

  return PlaceModel.find(params).lean<Array<ModelWithId<ApiPlace>>>().exec();
};
