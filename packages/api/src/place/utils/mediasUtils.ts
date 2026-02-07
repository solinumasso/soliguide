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
import { extname } from "node:path";

import { FileFilterCallback } from "multer";

const _checkFileType = (
  fileTypes: RegExp,
  mimeTypes: string[],
  file: { originalname: string; mimetype: string },
  callback: FileFilterCallback
) => {
  // Check extensions
  const extension_name = fileTypes.test(
    extname(file.originalname).toLowerCase()
  );
  // DoubleCheck mimetype
  const mimetype = mimeTypes.includes(file.mimetype);

  if (mimetype && extension_name) {
    return callback(null, true);
  } else {
    callback(new Error("file type not supported"));
  }
};

export const checkImgFileType = (
  file: { originalname: string; mimetype: string },
  callback: FileFilterCallback
) => {
  // Supported img extensions
  const fileTypes = /jpeg|jpg|png|gif/;
  const mimeTypesAllowed = [
    "image/jpg",
    "image/jpeg",
    "image/png",
    "image/gif",
  ];
  _checkFileType(fileTypes, mimeTypesAllowed, file, callback);
};

export const checkDocumentFileType = (
  file: { originalname: string; mimetype: string },
  callback: FileFilterCallback
) => {
  // Supported docs extensions
  const fileTypes = /pdf|doc|docx|odt|png|jpg|jpeg|png/;
  // Supported mimetype
  const mimeTypesAllowed = [
    "image/jpg",
    "image/jpeg",
    "image/png",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.oasis.opendocument.text",
  ];
  _checkFileType(fileTypes, mimeTypesAllowed, file, callback);
};
