import { TranslatedPlace } from "@soliguide/common";

import mongoose from "mongoose";

export interface ApiTranslatedPlace extends TranslatedPlace {
  placeObjectId: mongoose.Types.ObjectId;
}
