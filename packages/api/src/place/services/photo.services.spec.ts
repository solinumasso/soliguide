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
