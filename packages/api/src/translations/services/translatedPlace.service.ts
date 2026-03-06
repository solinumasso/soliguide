import { TranslatedPlace } from "@soliguide/common";
import { FilterQuery, QueryOptions } from "mongoose";
import { ApiTranslatedPlace } from "../interfaces";
import { TranslatedPlaceModel } from "../models/translatedPlace.model";

export const countTranslatedPlaces = async (
  params: FilterQuery<ApiTranslatedPlace>
): Promise<number> => {
  return await TranslatedPlaceModel.countDocuments(params);
};

/**
 * @summary Get translated places
 * @param {Object} params <ApiTranslatedPlace>
 * @param {Object} options
 */
export const findTranslatedPlaces = async (
  params: FilterQuery<ApiTranslatedPlace>,
  options: QueryOptions
): Promise<TranslatedPlace[]> => {
  return await TranslatedPlaceModel.find(params)
    .limit(options?.limit ?? 100)
    .skip(options?.skip ?? 0)
    .sort(options.sort)
    .populate("place", "_id lieu_id seo_url name")
    .exec();
};

export const findTranslatedPlace = async (
  params: FilterQuery<ApiTranslatedPlace>
): Promise<ApiTranslatedPlace | null> => {
  return await TranslatedPlaceModel.findOne(params).exec();
};

export const patchTranslatedPlace = async (
  lieu_id: number,
  data: Partial<ApiTranslatedPlace>
): Promise<TranslatedPlace | null> => {
  // Set the right value
  // Update the element in the database
  return await TranslatedPlaceModel.findOneAndUpdate(
    { lieu_id },
    { $set: data },
    { new: true }
  )
    .lean()
    .exec();
};
