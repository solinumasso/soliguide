import mongoose from "mongoose";

export type ModelWithId<T> = T & Required<{ _id: mongoose.Types.ObjectId }>;
