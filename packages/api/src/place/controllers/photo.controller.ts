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
import multer from "multer";

import multerS3 from "multer-s3";

import { extname, basename } from "node:path";

import * as PhotoServices from "../services/photo.services";

import { checkImgFileType } from "../utils/mediasUtils";

import { CONFIG, ApiPlacePhoto, ExpressRequest } from "../../_models";

import { s3Client, deleteObject } from "../../general/services/s3";

const storage = multerS3({
  s3: s3Client,
  bucket: CONFIG.S3_PICTURES_BUCKET_NAME,
  key: (req: ExpressRequest, file, cb) => {
    try {
      const fileName =
        req.params.objectId.toString() +
        "/" +
        req.lieu.seo_url +
        "-" +
        Date.now() +
        extname(file.originalname);
      cb(null, fileName);
    } catch (e) {
      cb(e);
    }
  },
});

export const uploadImg = multer({
  fileFilter: (_req: ExpressRequest, file, cb) => {
    checkImgFileType(file, cb);
  },
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  storage,
}).single("file");

export const addPhoto = async (req: ExpressRequest) => {
  if (!req.file) {
    throw new Error("NO_FILE_SELECTED_ERROR");
  }

  const parcours_id = req.body.parcoursId
    ? parseInt(req.body.parcoursId, 10)
    : null;

  const file: ApiPlacePhoto = {
    ...req.file,
    filename: basename(req.file.key),
    lieu_id: req.lieu.lieu_id,
    parcours_id,
    path: req.file.key,
  };

  const photo = await PhotoServices.createPhoto(file);

  if (!photo._id) {
    throw new Error("CANNOT_SAVE_PHOTO");
  }

  await PhotoServices.updatePlaceByPlaceIdAfterPhotoUpload(
    req.lieu.lieu_id,
    photo._id,
    "$addToSet",
    parcours_id
  );

  return photo;
};

export const deletePhoto = async (req: ExpressRequest) => {
  const fileToDelete = await PhotoServices.deletePhoto(
    req.params.photoObjectId
  );

  if (!fileToDelete) {
    throw new Error("PHOTO_NOT_FOUND");
  }

  let parcoursId = null;

  if (typeof req.params.parcoursId !== "undefined") {
    parcoursId = parseInt(req.params.parcoursId, 10);
  }

  const place = await PhotoServices.updatePlaceByPlaceIdAfterPhotoUpload(
    req.lieu.lieu_id,
    req.params.photoObjectId,
    "$pull",
    parcoursId
  );

  await deleteObject(CONFIG.S3_PICTURES_BUCKET_NAME, fileToDelete.path);

  return place;
};
