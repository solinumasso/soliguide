import mongoose from "mongoose";

export const getMongoId = (_id: any): mongoose.Types.ObjectId => {
  if (mongoose.isValidObjectId(_id)) {
    return _id;
  }
  return new mongoose.Types.ObjectId(_id);
};
