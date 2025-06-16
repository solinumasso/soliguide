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
import { format } from "date-fns";

import {
  type ApiPlace,
  type DocExportRow,
  PlaceStatus,
  TempInfoType,
  translateModalities,
  translatePublics,
  CategoriesService,
} from "@soliguide/common";

import {
  getAllServicesNames,
  parseAddress,
  parseHours,
  parsePhones,
  parseSectionName,
  parseTempInfo,
} from "../parsers";

import { translator } from "../../../config";
import type { ExportSearchParams } from "../../interfaces";
import type { TempInfo } from "../../../temp-info/types";

export const convertPlaceToExportRow = (
  frontUrl: string,
  categoriesService: CategoriesService,
  exportSettings: ExportSearchParams,
  place: ApiPlace,
  upcomingTempInfo: TempInfo[],
  isService = false,
  serviceIndex?: number
): DocExportRow => {
  const language = exportSettings.exportParams.language;
  const docExportRow: DocExportRow = {
    sectionName: parseSectionName(exportSettings, place),
    address: parseAddress(place.position),
    city: parseString(place.position?.city),
    hours: parseHours(place.newhours, language),
    latitude: parseString(place.position?.location.coordinates[1]),
    lieu_id: place.lieu_id,
    linkToSoliguide: `${frontUrl}/${language}/fiche/${place.lieu_id}`,
    longitude: parseString(place.position?.location.coordinates[0]),
    email: parseString(place.entity.mail),
    modalities: translateModalities(translator, language, place.modalities),
    name: parseString(place.name),
    phoneNumbers: parsePhones(language, place.entity.phones),
    publics: translatePublics(translator, language, place.publics, false, true),
    services: getAllServicesNames(place, language, true),
    category: "",
    tempClosure: "",
    tempHours: "",
    tempMessage: "",
    updatedAt: format(new Date(place.updatedByUserAt), "dd-MM-yyyy"),
    postalCode: place.position?.postalCode,
  };

  docExportRow.tempClosure = parseTempInfo(
    translator,
    language,
    upcomingTempInfo,
    TempInfoType.CLOSURE
  );

  docExportRow.tempHours = parseTempInfo(
    translator,
    language,
    upcomingTempInfo,
    TempInfoType.HOURS
  );

  docExportRow.tempMessage = parseTempInfo(
    translator,
    language,
    upcomingTempInfo,
    TempInfoType.MESSAGE
  );

  // If we need one service per line
  if (isService && typeof serviceIndex !== "undefined") {
    const service = place.services_all[serviceIndex];

    docExportRow.sectionName = parseSectionName(exportSettings, place, service);
    docExportRow.category = service.category
      ? categoriesService.getParentsCategories(service.category)?.[0] ?? ""
      : "";

    if (service.differentHours) {
      docExportRow.hours = parseHours(service.hours, language);
    }

    if (service.close?.actif) {
      docExportRow.tempClosure = parseTempInfo(
        translator,
        language,
        [
          {
            ...service.close,
            dateDebut: service.close.dateDebut ?? undefined,
            tempInfoType: TempInfoType.CLOSURE,
          },
        ],
        TempInfoType.CLOSURE
      );
    }

    if (service.differentModalities) {
      docExportRow.modalities = translateModalities(
        translator,
        language,
        service.modalities
      );
    }

    if (service.differentPublics) {
      docExportRow.publics = translatePublics(
        translator,
        language,
        service.publics,
        false,
        true
      );
    }
  }

  if (place.status === PlaceStatus.PERMANENTLY_CLOSED) {
    docExportRow.tempClosure = translator.t(PlaceStatus.PERMANENTLY_CLOSED, {
      lng: language,
    }) as string;
  }
  return docExportRow;
};

const parseString = (value: any): string => {
  if (value) {
    return value.toString().trim();
  }
  return "";
};
