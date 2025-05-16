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
