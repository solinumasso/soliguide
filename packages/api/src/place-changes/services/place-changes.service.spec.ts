/*
 * Soliguide: Useful information for those who need it
 *
 * SPDX-FileCopyrightText: © 2024 Solinum
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
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
