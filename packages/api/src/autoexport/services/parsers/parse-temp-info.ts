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
import { decode } from "html-entities";
import { i18n } from "i18next";
import striptags from "striptags";

import {
  type SupportedLanguagesCode,
  TempInfoType,
  translateDateInterval,
} from "@soliguide/common";

import { parseHours } from "./parse-hours.parser";
import type { TempInfo } from "../../../temp-info/types";

const ucFirst = (value: string): string => {
  return value ? value.charAt(0).toUpperCase() + value.slice(1) : "";
};

const cleanRichText = (description: string): string => {
  description = description.replace("</p>", "\n");
  description = decode(description, {
    level: "html5",
  });
  return striptags(description).trim();
};

export const parseTempInfo = (
  i18next: i18n,
  lng: SupportedLanguagesCode,
  tempInfo: Array<
    Partial<
      Pick<
        TempInfo,
        | "tempInfoType"
        | "dateDebut"
        | "dateFin"
        | "name"
        | "description"
        | "hours"
      >
    >
  >,
  tempInfoType: TempInfoType
): string => {
  let message = "";

  const filteredTempInfos = tempInfo.filter(
    (temp) => temp.tempInfoType === tempInfoType
  );

  if (filteredTempInfos.length === 0 || tempInfo.length === 0) {
    return message;
  }

  for (const temp of filteredTempInfos) {
    let tempInfoMessage = ucFirst(
      i18next.t(`EXPORTS_HEADER_TEMP_${tempInfoType.toUpperCase()}`, { lng })
    );

    const dateInterval = translateDateInterval(
      i18next,
      lng,
      temp.dateDebut ?? null,
      temp.dateFin ?? null
    );

    tempInfoMessage += `: ${dateInterval.toLowerCase()}`;

    if (temp.name || temp.description) {
      const description = temp.description
        ? cleanRichText(temp.description)
        : "";

      if (temp.name && description) {
        tempInfoMessage += `\n${temp.name}: ${description}`;
      } else if (temp.name && !description) {
        tempInfoMessage += `\n${temp.name}`;
      } else if (!temp.name && description) {
        tempInfoMessage += `\n${description}`;
      }
    }

    if (tempInfoType === TempInfoType.HOURS && temp.hours) {
      tempInfoMessage += `\n${parseHours(temp.hours, lng)}`;
    }

    message += `${tempInfoMessage.trim()}\n\n`;
  }

  return message.trim();
};
