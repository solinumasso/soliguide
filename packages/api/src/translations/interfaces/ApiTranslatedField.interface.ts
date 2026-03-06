import { TranslatedField } from "@soliguide/common";
import mongoose from "mongoose";

export interface ApiTranslatedField extends TranslatedField {
  placeObjectId: null | mongoose.Types.ObjectId;
  serviceObjectId: null | mongoose.Types.ObjectId;
}
