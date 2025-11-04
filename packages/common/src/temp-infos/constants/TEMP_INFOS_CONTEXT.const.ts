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
import { TempInfoType } from "../enums";
import { TempInfoContext } from "../interfaces";

export const TEMP_INFOS_CONTEXT: {
  [key in TempInfoType]: TempInfoContext;
} = {
  closure: {
    descriptionLabel: "TEMP_CLOSURE_DESCRIPTION_LABEL",
    descriptionPlaceHolder: "TEMP_CLOSURE_REASON_FOR_CLOSING",
    title: "TEMP_CLOSURE_TITLE",
    alreadyPlannedTitle: "TEMP_CLOSURE_ALREADY_PLANNED_TITLE",
    nonePlannedValue: "TEMP_CLOSURE_NONE_PLANNED_VALUE",
    planTitle: "TEMP_CLOSURE_PLAN_TITLE",
    planTitleWithPlace: "TEMP_CLOSURE_PLAN_TITLE_WITH_PLACE",
  },
  hours: {
    descriptionLabel: "TEMP_HOURS_DESCRIPTION_LABEL",
    descriptionPlaceHolder: "TEMP_HOURS_DESCRIPTION_PLACEHOLDER",
    title: "TEMP_HOURS_TITLE",
    alreadyPlannedTitle: "TEMP_HOURS_ALREADY_PLANNED_TITLE",
    nonePlannedValue: "TEMP_HOURS_NONE_PLANNED_VALUE",
    planTitle: "TEMP_HOURS_PLAN_TITLE",
    planTitleWithPlace: "TEMP_HOURS_PLAN_TITLE_WITH_PLACE",
  },
  message: {
    descriptionLabel: "TEMP_MESSAGE_DESCRIPTION_LABEL",
    descriptionPlaceHolder: "",
    title: "TEMP_MESSAGE_TITLE",
    alreadyPlannedTitle: "TEMP_MESSAGE_ALREADY_PLANNED_TITLE",
    nonePlannedValue: "TEMP_MESSAGE_NONE_PLANNED_VALUE",
    planTitle: "TEMP_MESSAGE_PLAN_TITLE",
    planTitleWithPlace: "TEMP_MESSAGE_PLAN_TITLE_WITH_PLACE",
  },
  serviceClosure: {
    descriptionLabel: "TEMP_SERVICE_CLOSURE_DESCRIPTION_LABEL",
    descriptionPlaceHolder: "TEMP_SERVICE_CLOSURE_DESCRIPTION_LABEL",
    title: "TEMP_MESSAGE_TITLE",
    alreadyPlannedTitle: "TEMP_MESSAGE_ALREADY_PLANNED_TITLE",
    nonePlannedValue: "TEMP_MESSAGE_NONE_PLANNED_VALUE",
    planTitle: "TEMP_MESSAGE_PLAN_TITLE",
    planTitleWithPlace: "TEMP_MESSAGE_PLAN_TITLE_WITH_PLACE",
  },
};
