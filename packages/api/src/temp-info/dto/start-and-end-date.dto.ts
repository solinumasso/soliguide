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
import { differenceInCalendarDays } from "date-fns";

import { body } from "express-validator";

import { checkTempInfoInterval } from "../utils/temp-info.utils";

import { isValidDate } from "../../_utils/functions/dates/date.functions";

import { CHECK_STRING_NULL } from "../../config/expressValidator.config";

export const startAndEndDateDto = (path = "") => {
  if (path === "") {
    return [
      body("dateDebut")
        .exists(CHECK_STRING_NULL)
        .custom((value) => isValidDate(value))
        .customSanitizer((value) => {
          const date = new Date(value);
          date.setUTCHours(0, 0, 0);
          return date;
        }),

      body("dateFin")
        .if(body("dateFin").exists(CHECK_STRING_NULL))
        .custom((value) => isValidDate(value))
        .customSanitizer((value) => {
          const givenEndDate = new Date(value);
          givenEndDate.setUTCHours(23, 59, 59);
          return givenEndDate;
        })
        .custom(
          (value, { req }) =>
            !value || differenceInCalendarDays(req.body.dateDebut, value) <= 0
        ),
    ];
  }

  return [
    body(path)
      .custom((value) => {
        if (value.actif) {
          if (!isValidDate(value.dateDebut)) {
            return false;
          }
          const dateFin = value.dateFin;
          return !dateFin || isValidDate(dateFin);
        }
        return true;
      })
      .customSanitizer((value) => {
        if (!value.actif) {
          return {
            ...value,
            dateDebut: null,
            dateFin: null,
          };
        }

        const dateDebut = new Date(value.dateDebut);
        dateDebut.setUTCHours(0, 0, 0);

        let dateFin = null;
        if (value.dateFin) {
          dateFin = new Date(value.dateFin);
          dateFin.setUTCHours(23, 59, 59);
        }

        return {
          ...value,
          dateDebut,
          dateFin,
        };
      })
      .custom((value) => {
        if (value.actif) {
          return (
            !value.dateFin ||
            differenceInCalendarDays(value.dateDebut, value.dateFin) <= 0
          );
        }
        return true;
      }),
  ];
};

export const checkTempInfoIntervalDto = [
  body("").custom(async (_, { req }) => {
    const newTempInfo = { ...req.body };
    const tempInfoType = req.params?.tempInfoType;

    try {
      await checkTempInfoInterval(req.lieu.lieu_id, newTempInfo, tempInfoType);
      return true;
    } catch (e) {
      throw new Error("TEMP_INFOS_DATE_OVERLAPPING");
    }
  }),
];
