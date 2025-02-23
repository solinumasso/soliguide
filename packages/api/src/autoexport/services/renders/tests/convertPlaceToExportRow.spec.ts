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
import {
  Categories,
  CountryCodes,
  ExportFileType,
  GeoTypes,
  PlaceType,
  SortingFilters,
  SupportedLanguagesCode,
  CategoriesService,
} from "@soliguide/common";

import { convertPlaceToExportRow } from "../convertPlaceToExportRow";

import { ExportSearchParams } from "../../../interfaces";

import { ONLINE_PLACE } from "../../../../../mocks";
import { MULTIPLE_TEMP_INFO_MOCK } from "../../parsers/tests/TEMP_INFO.mock";
import { CONFIG } from "../../../../_models";
import { TypeCategoriesServiceNotFromThemeEnum } from "../../../../categories/enums/type-categories-service-not-from-theme.enum";
import { getServiceCategoriesApi } from "../../../../categories/functions/get-service-categories-api.function";

let categoryService: CategoriesService;

beforeAll(() => {
  jest.useFakeTimers();
  jest.setSystemTime(new Date("2022-10-01T01:00:00.000Z"));

  categoryService = getServiceCategoriesApi(
    TypeCategoriesServiceNotFromThemeEnum.ALL
  );
});

describe("convertPlaceToExportRow ", () => {
  const place = structuredClone(ONLINE_PLACE);
  const frontUrl = CONFIG.SOLIGUIDE_FR_URL;

  const searchData: ExportSearchParams = {
    options: { sortBy: "createdAt", sortValue: "-1" },
    category: null,
    close: null,
    label: null,
    word: null,
    country: CountryCodes.FR,
    territories: [],
    location: {
      geoType: GeoTypes.CITY,
      geoValue: "villetaneuse",
      coordinates: [2.3459158, 48.9609899],
      distance: 5,
      label: "Villetaneuse",
      areas: {
        departement: "Seine-Saint-Denis",
        region: "Île-de-France",
        ville: "villetaneuse",
        city: "villetaneuse",
        pays: "France",
        country: CountryCodes.FR,
        slugs: {},
      },
      slugs: {},
    },
    toCampaignUpdate: false,
    languages: null,
    autonomy: [],
    campaignStatus: null,
    catToExclude: [],
    lieu_id: null,
    organization: null,
    placeType: PlaceType.PLACE,
    priority: null,
    sourceMaj: [],
    status: null,
    visibility: null,
    exportParams: {
      showUpcomingTempInfo: false,
      fileType: ExportFileType.CSV,
      sortingFilter: SortingFilters.CITY,
      language: SupportedLanguagesCode.EN,
      infos: {
        address: true,
        city: true,
        email: true,
        hours: true,
        latitude: true,
        lieu_id: true,
        linkToSoliguide: true,
        longitude: true,
        modalities: true,
        name: true,
        phoneNumbers: true,
        postalCode: true,
        publics: true,
        services: true,
        tempClosure: true,
        tempHours: true,
        tempMessage: true,
        updatedAt: true,
      },
    },
  };

  it("Convert place, filter by city", () => {
    const placeToExport = convertPlaceToExportRow(
      frontUrl,
      categoryService,
      searchData,
      place,
      MULTIPLE_TEMP_INFO_MOCK,
      false
    );

    const result = {
      address: "11 bis boulevard de l'Hôpital, 75013 Paris",
      category: "",
      city: "Paris",
      email: "antenne14@structure-en-ligne.org",
      hours: "Monday: 9h30 to 12h\nThursday: 9h30 to 12h",
      latitude: "48.8418381",
      lieu_id: 33,
      linkToSoliguide: "http://localhost:4200/en/fiche/33",
      longitude: "2.3631959",
      modalities:
        "By appointment only\nOther details: Personnes domiciliées dans les 5e, 6e, 7e, 14e, 15e et 16e arrondissements. ",
      name: "Antenne Marcel Paul - Secours Populaire Français",
      phoneNumbers: "Accueil: 06 06 06 06 06",
      postalCode: "75013",
      publics: "Unconditional welcome",
      sectionName: "Paris",
      services: "Social support",
      tempClosure:
        "Temporary closure: from 01/09/2022 to 06/11/2022\nA fake temp closure",
      tempHours:
        "Temporary schedules: from 01/09/2022 to 06/11/2022\nA fake temp hours",
      tempMessage:
        "Temporary Message: from 01/09/2022 to 06/11/2022\nA fake temp message",
      updatedAt: "10-09-2021",
    };
    expect(placeToExport).toEqual(result);
  });

  it("Convert place, filter by service and selected category", () => {
    searchData.exportParams.sortingFilter = SortingFilters.SERVICE;

    // Test first service
    const placeToExport = convertPlaceToExportRow(
      frontUrl,
      categoryService,
      searchData,
      place,
      MULTIPLE_TEMP_INFO_MOCK,
      true,
      0
    );

    const result = {
      address: "11 bis boulevard de l'Hôpital, 75013 Paris",
      category: Categories.COUNSELING,
      city: "Paris",
      email: "antenne14@structure-en-ligne.org",
      hours: "Monday: 9h30 to 12h\nThursday: 9h30 to 12h",
      latitude: "48.8418381",
      lieu_id: 33,
      linkToSoliguide: "http://localhost:4200/en/fiche/33",
      longitude: "2.3631959",
      modalities:
        "By appointment only\nOther details: Personnes domiciliées dans les 5e, 6e, 7e, 14e, 15e et 16e arrondissements. ",
      name: "Antenne Marcel Paul - Secours Populaire Français",
      phoneNumbers: "Accueil: 06 06 06 06 06",
      postalCode: "75013",
      publics: "Unconditional welcome",
      sectionName: "Social support",
      services: "Social support",
      tempClosure:
        "Temporary closure: from 01/09/2022 to 06/11/2022\nA fake temp closure",
      tempHours:
        "Temporary schedules: from 01/09/2022 to 06/11/2022\nA fake temp hours",
      tempMessage:
        "Temporary Message: from 01/09/2022 to 06/11/2022\nA fake temp message",
      updatedAt: "10-09-2021",
    };
    expect(placeToExport).toEqual(result);
  });
});
