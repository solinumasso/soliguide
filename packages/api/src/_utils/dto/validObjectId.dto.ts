import { ObjectId } from "bson";

import { body } from "express-validator";

import mongoose from "mongoose";

import { CHECK_STRING_NULL } from "../../config/expressValidator.config";

export const validObjectIdDto = [
  body("_id")
    .exists()
    .custom((value) => {
      return ObjectId.isValid(value);
    }),
];

export const parseObjectIdOptionalDto = [
  body("_id")
    .if(body("_id").exists(CHECK_STRING_NULL))
    .custom((value) => {
      if (!value) {
        return true;
      }
      return ObjectId.isValid(value);
    })
    .customSanitizer((value) => {
      if (value) {
        return new mongoose.Types.ObjectId(value);
      }
      return null;
    }),
];

export const parseServiceObjectIdDto = [
  body("serviceObjectId")
    .if(body("serviceObjectId").exists(CHECK_STRING_NULL))
    .custom((value) => {
      return ObjectId.isValid(value);
    })
    .customSanitizer((value) => {
      if (value) {
        return new mongoose.Types.ObjectId(value);
      }
      return null;
    }),
];
