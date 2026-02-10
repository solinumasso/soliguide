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

import { createPhoto, deletePhoto } from "./photo.services";

import { ApiPlacePhoto } from "../../_models";

describe("CRUD for pictures", () => {
  afterAll(() => {
    mongoose.connection.close();
  });

  const fakePhoto = {
    encoding: "7bit",
    filename: "fake-photo.png",
    mimetype: "image/png",
    path: "fake/path/fake-photo.png",
    size: 158514,
    lieu_id: 10,
  };

  let fakePhotoObjectId: string;
  let fakePhotoDoc: ApiPlacePhoto;

  it("Must create a picture", async () => {
    fakePhotoDoc = await createPhoto(fakePhoto);

    expect(fakePhotoDoc).toBeDefined();

    if (fakePhotoDoc._id) {
      fakePhotoObjectId = fakePhotoDoc._id;
    }
  });

  it("Must delete a picture", async () => {
    const result = await deletePhoto(fakePhotoObjectId);
    if (!result || !result._id) {
      return;
    }
    fakePhotoObjectId = result._id;
    expect(result._id).toEqual(fakePhotoDoc._id);
  });
});
