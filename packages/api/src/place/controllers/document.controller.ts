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
import multer, { FileFilterCallback } from "multer";

import multerS3 from "multer-s3";

import { extname, basename } from "node:path";
import { escape } from "validator";
import { checkDocumentFileType } from "../utils/mediasUtils";
import { CONFIG, ExpressRequest } from "../../_models";

import { s3Client, deleteObject } from "../../general/services/s3";
import { ApiPlace, CommonPlaceDocument } from "@soliguide/common";
import mongoose from "mongoose";
import documentService from "../services/document.services";

const storage = multerS3({
  s3: s3Client,
  bucket: CONFIG.S3_DOCUMENTS_BUCKET_NAME,
  contentType: multerS3.AUTO_CONTENT_TYPE,
  key: (
    req: ExpressRequest,
    file: Express.Multer.File,
    cb: (error: any, key?: string) => void
  ) => {
    try {
      const fileName = `${req.params.objectId.toString()}/${
        req.lieu.seo_url
      }-${Date.now()}${extname(file.originalname)}`;
      cb(null, fileName);
    } catch (e) {
      cb(e);
    }
  },
});

export const uploadDocument = multer({
  fileFilter: (
    _req: ExpressRequest,
    file: Express.Multer.File,
    cb: FileFilterCallback
  ) => {
    checkDocumentFileType(file, cb);
  },
  limits: {
    fileSize: 1024 * 1024 * 20,
  },
  storage,
}).single("file");

export const addDocument = async (
  place: ApiPlace,
  file: Express.MulterS3.File,
  document: Partial<CommonPlaceDocument>
) => {
  if (!file) {
    throw new Error("NO_FILE_SELECTED_ERROR");
  }
  const serviceId = document?.serviceId ?? null;
  const newDocument = new CommonPlaceDocument({
    ...file,
    filename: basename(file.key),
    name: document.name ? escape(document.name) : "",
    lieu_id: place.lieu_id,
    serviceId,
    path: file.key,
  });

  const upload = await documentService.createDocument(newDocument);

  if (!upload._id) {
    throw new Error("CANNOT_SAVE_DOC");
  }

  await documentService.updatePlaceByPlaceIdAfterDocUpload(
    place.lieu_id,
    upload._id,
    "$addToSet",
    serviceId
  );

  return upload;
};

export const deleteDocument = async (
  selectedPlace: ApiPlace,
  documentObjectId: string | mongoose.Types.ObjectId,
  serviceId?: number | string | null
) => {
  const fileToDelete = await documentService.deleteDocument(documentObjectId);
  if (!fileToDelete) {
    throw new Error("DOC_NOT_FOUND");
  }

  if (!serviceId) {
    serviceId = null;
  } else if (typeof serviceId === "string") {
    serviceId = parseInt(serviceId, 10);
  }
  const place = await documentService.updatePlaceByPlaceIdAfterDocUpload(
    selectedPlace.lieu_id,
    documentObjectId,
    "$pull",
    serviceId
  );

  await deleteObject(CONFIG.S3_DOCUMENTS_BUCKET_NAME, fileToDelete.path);

  return place;
};
