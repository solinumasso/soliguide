import { FilterQuery } from "mongoose";
import { PlaceModel } from "../../place/models/place.model";
import { ApiPlace } from "@soliguide/common";

export const countPlacesWithParams = async (
  params: FilterQuery<ApiPlace>
): Promise<number> => {
  return await PlaceModel.countDocuments(params);
};

export const countServicesWithParams = async (
  params: FilterQuery<ApiPlace>
): Promise<{ _id: null; count: number }[]> => {
  return await PlaceModel.aggregate([
    { $match: params },
    { $group: { _id: null, count: { $sum: { $size: "$services_all" } } } },
  ]);
};
