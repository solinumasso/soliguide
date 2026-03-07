import { Types } from "mongoose";

import { PhotoModel } from "../models/photo.model";

import { ApiPlacePhoto, ModelWithId } from "../../_models";

import { getMongoId } from "../../_utils/functions/mongo/getMongoId";

import { PlaceModel } from "../../place/models/place.model";
import { ApiPlace } from "@soliguide/common";

export const createPhoto = async (data: any): Promise<ApiPlacePhoto> => {
  return new PhotoModel(data).save();
};

export const updatePlaceByPlaceIdAfterPhotoUpload = (
  lieu_id: number,
  _id: string,
  action: "$pull" | "$addToSet",
  parcoursId: number | null
): Promise<ModelWithId<ApiPlace> | null> => {
  const photoMongoId = new Types.ObjectId(_id);
  const update: any = {
    [action]: {
      photos: photoMongoId,
    },
  };

  if (parcoursId !== null) {
    update[action] = {
      [`parcours.${parcoursId}.photos`]: photoMongoId,
    };
  }

  return PlaceModel.findOneAndUpdate({ lieu_id }, update, { new: true })
    .populate(["photos"])
    .populate([
      {
        model: "Photos",
        path: parcoursId !== null ? `parcours.${parcoursId}.photos` : "photos",
      },
    ])
    .select(`lieu_id ${parcoursId !== null ? "parcours" : "photos"}`)
    .lean<ModelWithId<ApiPlace>>()
    .exec();
};

export const deletePhoto = async (
  _id: string
): Promise<ApiPlacePhoto | null> => {
  return await PhotoModel.findOneAndDelete({
    _id: getMongoId(_id),
  })
    .lean<ApiPlacePhoto>()
    .exec();
};
