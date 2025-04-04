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
import { PlaceModel } from "../../place/models/place.model";
import { DEFAULT_SEARCH_OPTIONS } from "../../_utils/constants";

import { ApiPlace, UserStatus } from "@soliguide/common";
import { ModelWithId, UserPopulateType } from "../../_models";
import { RootQuerySelector } from "mongoose";
import { generateApiUserRestriction } from "../utils/query/generate-api-user-restriction";
import { cleanPlaceCategorySpecificFields } from "../../place/utils";

/**
 * @summary   Count the amount of place with this geo position
 * @param     {RootQuerySelector<ApiPlace>}   params NoSQL query
 */
export const countPlacesWithLocationParams = async (
  params: RootQuerySelector<ApiPlace>,
  user: UserPopulateType
) => {
  const geoNearStage = params.$geoNear ? [{ $geoNear: params.$geoNear }] : [];
  const matchOrganizations = params.organizations
    ? [{ $match: { organizations: params.organizations } }]
    : [];

  let $match = structuredClone(params);

  delete $match.$geoNear;
  delete $match.organizations;

  // 13. Restrict data for API USER
  if (user.status === UserStatus.API_USER) {
    $match = generateApiUserRestriction($match, user);
  }

  const pipeline = [
    ...geoNearStage,
    { $match },
    {
      $lookup: {
        as: "organizations",
        foreignField: "places",
        from: "organization",
        localField: "_id",
      },
    },
    ...matchOrganizations,
    { $count: "total" },
  ];

  const result = await PlaceModel.aggregate(pipeline).exec();

  if (result.length > 0) {
    return result[0].total;
  } else {
    return 0;
  }
};

/**
 * @summary   Look for places
 * @param     {any}   params place ID or seo_url
 */
export const searchPlacesWithParams = async (
  params: RootQuerySelector<ApiPlace>,
  options = DEFAULT_SEARCH_OPTIONS
): Promise<ModelWithId<ApiPlace>[]> => {
  const $geoNear = params["$geoNear"];
  const $match = structuredClone(params);

  delete $match["$geoNear"];

  const $project: RootQuerySelector<ApiPlace> = {};

  options.fields.split(" ").forEach((field: string) => {
    if (field[0] === "-") {
      $project[field.slice(1)] = false;
    } else {
      $project[field] = true;
    }
  });

  return await PlaceModel.aggregate([
    ...($geoNear ? [{ $geoNear }] : []),
    { $match },
    { $project },
    {
      $addFields: {
        statusSort: {
          $cond: {
            if: { $eq: ["$status", "PERMANENTLY_CLOSED"] },
            then: 1,
            else: 0,
          },
        },
      },
    },
    {
      $sort: {
        ...options.sort,
        statusSort: 1,
        ...($geoNear ? { distance: 1 } : {}),
      },
    },
    ...(options.skip ? [{ $skip: options.skip }] : []),
    ...(options.limit ? [{ $limit: options.limit }] : []),
  ])
    .collation({ locale: "fr", strength: 1 })
    .allowDiskUse(true);
};

/**
 * @summary   Look for places
 * @param     {RootQuerySelector<ApiPlace>}   params Place ID or SEO URL
 */
export const adminSearchPlacesWithParams = async (
  params: RootQuerySelector<ApiPlace>,
  options = DEFAULT_SEARCH_OPTIONS
) => {
  const geoNearStage = params.$geoNear ? [{ $geoNear: params.$geoNear }] : [];
  const matchOrganizations = params.organizations
    ? [{ $match: { organizations: params.organizations } }]
    : [];
  const $match = structuredClone(params);

  delete $match.$geoNear;
  delete $match.organizations;

  const $project: RootQuerySelector<ApiPlace> = {};

  options.fields.split(" ").forEach((field: string) => {
    if (field[0] === "-") {
      $project[field.slice(1)] = false;
    } else {
      $project[field] = true;
    }
  });

  const pipeline = [
    ...geoNearStage,
    { $match },
    {
      $lookup: {
        as: "organizations",
        foreignField: "places",
        from: "organization",
        localField: "_id",
      },
    },
    ...matchOrganizations,
    ...(options.sort &&
    typeof options.sort === "object" &&
    Object.keys(options.sort).length
      ? [{ $sort: options.sort }]
      : []),
    ...(options.skip ? [{ $skip: options.skip }] : []),
    ...(options.limit ? [{ $limit: options.limit }] : []),
    { $project },
  ];

  const result = await PlaceModel.aggregate(pipeline)
    .collation({ locale: "fr", strength: 1 })
    .allowDiskUse(true);

  return result;
};

/**
 * @summary Search for places for an API user
 * @param {RootQuerySelector<ApiPlace>}   params NoSQL query
 */
export const apiSearchPlacesWithParams = async (
  params: RootQuerySelector<ApiPlace>,
  user: UserPopulateType,
  options = DEFAULT_SEARCH_OPTIONS
): Promise<ApiPlace[]> => {
  const $geoNear = params["$geoNear"];
  let $match = structuredClone(params);

  delete $match["$geoNear"];

  // 13. Restrict data for API USER
  $match = generateApiUserRestriction($match, user);

  const $project: RootQuerySelector<ApiPlace> = {};

  options.fields.split(" ").forEach((field: string) => {
    $project[field] = true;
  });

  if ($project.position || $project["position.address"]) {
    $project["position.address"] = {
      $cond: {
        else: "$position.address",
        if: { $eq: [true, "$modalities.orientation.checked"] },
        then: null,
      },
    };
  }

  if ($project.position || $project["position.address"]) {
    $project["position.complementAdresse"] = {
      $cond: {
        else: "$position.complementAdresse",
        if: { $eq: [true, "$modalities.orientation.checked"] },
        then: null,
      },
    };
  }

  const places = await PlaceModel.aggregate([
    ...($geoNear ? [{ $geoNear }] : []),
    { $match },
    ...($project ? [{ $project }] : []),
    { $unset: ["modalities.docs", "photos", "services_all.modalities.docs"] },
    ...(options.sort &&
    typeof options.sort === "object" &&
    Object.keys(options.sort).length
      ? [{ $sort: options.sort }]
      : []),
    ...(options.skip ? [{ $skip: options.skip }] : []),
    ...(options.limit ? [{ $limit: options.limit }] : []),
  ]).allowDiskUse(true);

  return places.map((place: ApiPlace) =>
    cleanPlaceCategorySpecificFields(place)
  );
};

export const searchPlacesIds = async (
  places: number[]
): Promise<Pick<ModelWithId<ApiPlace>, "_id" | "lieu_id">[]> => {
  return await PlaceModel.find({ lieu_id: { $in: places } })
    .select({ lieu_id: 1, _id: 1 })
    .lean<Pick<ModelWithId<ApiPlace>, "_id" | "lieu_id">[]>()
    .exec();
};
