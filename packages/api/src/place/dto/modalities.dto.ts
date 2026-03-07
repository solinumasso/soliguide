import type { Modalities } from "@soliguide/common";
import { body } from "express-validator";
import mongoose from "mongoose";
import { booleanDto, stringDto } from "../../_utils/dto";

const checkedAndPrecisionsDto = (path: string) => [
  booleanDto(path + ".checked"),
  stringDto(path + ".precisions", false),
];

export const modalitiesDto = (path = "") => [
  booleanDto(path + "modalities.inconditionnel"),

  ...checkedAndPrecisionsDto(path + "modalities.appointment"),
  ...checkedAndPrecisionsDto(path + "modalities.inscription"),
  ...checkedAndPrecisionsDto(path + "modalities.orientation"),

  stringDto(path + "modalities.other", false),

  body(path + "modalities.docs")
    .isArray()
    .customSanitizer((docs: any[]) => {
      return !docs
        ? []
        : docs.map((doc) => {
            return new mongoose.Types.ObjectId(doc._id.toString());
          });
    }),

  body(path + "modalities?.price")
    .optional()
    .isBoolean(),
  body(path + "modalities.animal?.checked")
    .optional()
    .isBoolean(),
  body(path + "modalities.pmr?.checked")
    .optional()
    .isBoolean(),

  body(path + "modalities").custom((value: Modalities) => {
    if (
      !value.inconditionnel &&
      !value.orientation.checked &&
      !value.appointment.checked &&
      !value.inscription.checked
    ) {
      throw new Error("At least one of the access conditions must be checked");
    } else if (
      value.inconditionnel &&
      (value.orientation.checked ||
        value.appointment.checked ||
        value.inscription.checked)
    ) {
      throw new Error(
        "The access conditions can't be unconditional and at the same time on orientation or on appointment or on registration"
      );
    }
    return true;
  }),
];
