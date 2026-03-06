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
  params: FilterQuery<ApiPlace>,
  withOrga = false
): Promise<Array<ModelWithId<ApiPlace>>> => {
  if (params._id) {
    params._id = new mongoose.Types.ObjectId(params._id);
  }

  let places = await PlaceModel.find(params)
    .lean<Array<ModelWithId<ApiPlace>>>()
    .exec();

  if (withOrga) {
    places = await Promise.all(
      places.map(async (place) => {
        place.organizations = await OrganizationModel.find(
          { places: { $in: place._id } },
          { name: 1, organization_id: 1, _id: 0 }
        ).exec();

        return place;
      })
    );
  }

  return places;
};

/**
 * @summary Get places by IDs for favorites
 * @param {number[]} ids Array of place IDs
 */
export const getPlacesByIds = async (ids: number[]): Promise<ApiPlace[]> => {
  const places = await PlaceModel.find({
    lieu_id: { $in: ids },
  })
    .lean<Array<ModelWithId<ApiPlace>>>()
    .exec();

  return places;
};
