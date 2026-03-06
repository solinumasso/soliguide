import mongoose, { FilterQuery } from "mongoose";

import { LogFicheModel } from "../models/log-fiche.model";
import { FICHE_FIELDS_FOR_POPULATE } from "../constants";

export const save = async (fiche: any) => {
  return LogFicheModel.create(fiche);
};

export const findOne = async (params: FilterQuery<any>) => {
  if (params._id) {
    params._id = new mongoose.Types.ObjectId(params._id);
  }

  return LogFicheModel.findOne(params)
    .populate({ path: "fiche", select: FICHE_FIELDS_FOR_POPULATE })
    .lean()
    .exec();
};

export const updateWithParams = async (
  params: FilterQuery<any>,
  dataToUpdate: any
) => {
  if (params._id) {
    params._id = new mongoose.Types.ObjectId(params._id);
  }

  await LogFicheModel.updateMany(params, { $set: dataToUpdate }).lean().exec();
};

export const deleteMany = async (params: FilterQuery<any>) => {
  if (params._id) {
    params._id = new mongoose.Types.ObjectId(params._id);
  }

  return LogFicheModel.deleteMany(params).exec();
};
