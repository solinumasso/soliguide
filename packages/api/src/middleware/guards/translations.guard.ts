import { NextFunction } from "express";

import { UserStatus } from "@soliguide/common";

import { findTranslatedField } from "../../translations/services/translatedField.service";

import { ExpressRequest, ExpressResponse } from "../../_models";

export const getTranslatedFieldFromUrl = async (
  req: ExpressRequest,
  res: ExpressResponse,
  next: NextFunction
) => {
  if (
    req.params.translatedFieldObjectId != null && // !null and !undefined
    req.params.translatedFieldObjectId !== "null"
  ) {
    const translatedFieldObjectId = req.params.translatedFieldObjectId;

    try {
      const translatedField = await findTranslatedField({
        _id: translatedFieldObjectId,
      });
      if (translatedField) {
        req.translatedField = translatedField;
        next();
      } else {
        return res.status(400).send({ message: "TRANSLATED_FIELD_NOT_EXIST" });
      }
    } catch (e) {
      return res.status(400).send({ message: "TRANSLATED_FIELD_NOT_EXIST" });
    }
  } else {
    return res.status(400).send({ message: "TRANSLATED_FIELD_ID_NOT_EXIST" });
  }
};

export const isTranslator = async (
  req: ExpressRequest,
  res: ExpressResponse,
  next: NextFunction
) => {
  if (!req.user.isLogged()) {
    return res.status(403).send({ message: "FORBIDDEN_USER" });
  }

  if (
    (req.isAdmin || req.user.translator) &&
    req.user.status !== UserStatus.API_USER
  ) {
    next();
  } else {
    return res.status(403).send({ message: "FORBIDDEN" });
  }
};
