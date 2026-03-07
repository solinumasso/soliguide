import { ApiPlace, CommonPlaceChanges, PlaceType } from "@soliguide/common";
import mongoose from "mongoose";
import { ModelWithId } from "../../_models";

export interface PlaceChanges extends ModelWithId<CommonPlaceChanges> {
  placeOnline?: boolean;
  placeType: PlaceType;
  automation?: boolean;
  place: mongoose.Types.ObjectId;
}

export interface PlaceChangesPopulate extends Omit<PlaceChanges, "place"> {
  place: Pick<ApiPlace, "name">;
}
