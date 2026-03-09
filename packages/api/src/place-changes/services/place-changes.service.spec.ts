import mongoose from "mongoose";
import { PLACE_CHANGES_MOCK } from "../../../mocks/placeChanges/PLACE_CHANGES.mock";
import { PlaceChanges } from "../interfaces/PlaceChanges.interface";
import { PlaceChangesModel } from "../models/place-changes.model";
import { findOnePlaceChanges, savePlaceChanges } from "./place-changes.service";

let placeChanges: PlaceChanges;

describe("History saving", () => {
  it("Should create a new row in collection 'placeChanges'", async () => {
    const savedChanges = await savePlaceChanges(PLACE_CHANGES_MOCK);
    expect(savedChanges?._id).not.toBeNull();
    placeChanges = savedChanges as PlaceChanges;
  });

  it("Should check if the saved change is readable", async () => {
    const updatedPlaceChanges = await findOnePlaceChanges({
      _id: placeChanges._id,
    });
    expect(updatedPlaceChanges?.automation).toEqual(false);
    expect(updatedPlaceChanges?.campaignName).toEqual(null);
    expect(updatedPlaceChanges?.isCampaign).toEqual(false);
    expect(updatedPlaceChanges?.lieu_id).toEqual(0);
  });

  afterAll(async () => {
    await PlaceChangesModel.deleteOne({
      _id: new mongoose.Types.ObjectId(placeChanges._id),
    });
    mongoose.connection.close();
  });
});
