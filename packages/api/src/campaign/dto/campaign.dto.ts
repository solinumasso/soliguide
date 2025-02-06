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
import { PlaceChangesSection } from "@soliguide/common";

import { param, body } from "express-validator";

import { isValidDate } from "../../_utils/functions/dates/date.functions";

export const campaignFormSection = param("section").isIn(
  Object.values(PlaceChangesSection)
);

export const orgaIdChecker = param("section").optional().exists().isInt();

export const remindMe = [
  body("date")
    .custom((value) => isValidDate(value))
    .customSanitizer((value) => new Date(value)),
];
