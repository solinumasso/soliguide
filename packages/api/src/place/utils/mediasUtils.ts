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
