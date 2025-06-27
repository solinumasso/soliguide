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
  ADMINISTRATIVE_DEFAULT_VALUES,
  CommonTimeslot,
  CountryCodes,
  FAMILY_DEFAULT_VALUES,
  GENDER_DEFAULT_VALUES,
  OTHER_DEFAULT_VALUES,
  OpeningHoursContext,
  PlaceClosedHolidays,
  PlaceStatus,
  PlaceType,
  PlaceUpdateCampaign,
  PlaceVisibility,
  SupportedLanguagesCode,
  WelcomedPublics,
} from "@soliguide/common";

import { SERVICE_MOCK } from "./SERVICE.mock";
import { Place } from "../src/app/models/place/classes";

const TIMESLOT_MOCK: CommonTimeslot = new CommonTimeslot(
  { end: 1700, start: 800 },
  OpeningHoursContext.PUBLIC
);

export const PAIRED_ONLINE_PLACE_MOCK = new Place({
  _id: "614bb2f678fc0312c43e5850",
  auto: false,
  country: CountryCodes.FR,
  campaigns: {
    runningCampaign: new PlaceUpdateCampaign({ toUpdate: true }),
  },
  createdBy: "User",
  createdAt: new Date("2021-09-22T22:49:26.040Z"),
  description: "Ceci est une structure en ligne pour des tests",
  entity: {
    facebook: "",
    fax: "",
    mail: "ma-place-en-ligne@place.fr",
    name: "Ma première orga — Ma deuxième orga",
    phones: [],
    website: "http://test.orga.fr",
  },
  isOpenToday: true,
  sourceLanguage: SupportedLanguagesCode.FR,
  languages: ["fr"],
  lieu_id: 14270,
  modalities: {
    animal: { checked: true },
    appointment: { checked: false, precisions: null },
    inconditionnel: true,
    inscription: { checked: false, precisions: null },
    orientation: { checked: false, precisions: null },
    other: null,
    docs: [],
    pmr: { checked: true },
    price: { checked: false, precisions: null },
  },
  newhours: {
    description: "",
    friday: {
      open: true,
      timeslot: [TIMESLOT_MOCK],
    },
    monday: {
      open: true,
      timeslot: [TIMESLOT_MOCK],
    },
    saturday: {
      open: false,
      timeslot: [],
    },
    sunday: {
      open: false,
      timeslot: [],
    },
    thursday: {
      open: false,
      timeslot: [],
    },
    tuesday: {
      open: false,
      timeslot: [],
    },
    wednesday: {
      open: true,
      timeslot: [TIMESLOT_MOCK],
    },
    closedHolidays: PlaceClosedHolidays.UNKNOWN,
  },
  name: "Place en ligne de test",
  parcours: [],
  photos: [],
  organizations: [],
  placeType: PlaceType.PLACE,
  position: {
    country: CountryCodes.FR,
    department: "Paris",
    departementCode: "75",
    departmentCode: "75",
    location: {
      coordinates: [2.3247446268353475, 48.884793024789374],
      type: "Point",
    },
    adresse: "21 rue des Dames, 75017 Paris",
    address: "21 rue des Dames, 75017 Paris",
    codePostal: "75017",
    postalCode: "75017",
    cityCode: "75017",
    additionalInformation: null,
    complementAdresse: null,
    departement: "Paris",
    city: "Paris",
    region: "Île-de-France",
    regionCode: "11",
    pays: "France",
    ville: "Paris",
    timeZone: "Europe/Paris",
  },
  publics: {
    accueil: WelcomedPublics.UNCONDITIONAL,
    administrative: ADMINISTRATIVE_DEFAULT_VALUES,
    age: {
      max: 99,
      min: 0,
    },
    description: null,
    familialle: FAMILY_DEFAULT_VALUES,
    gender: GENDER_DEFAULT_VALUES,
    other: OTHER_DEFAULT_VALUES,
  },
  seo_url: "place-en-ligne-de-test-14270",
  services_all: [SERVICE_MOCK],
  status: PlaceStatus.ONLINE,
  stepsDone: {
    conditions: true,
    contacts: true,
    horaires: true,
    infos: true,
    photos: true,
    emplacement: true,
    publics: true,
    services: true,
  },
  tempInfos: {
    closure: {
      actif: false,
      dateDebut: null,
      dateFin: null,
      description: null,
    },
    hours: {
      actif: false,
      dateDebut: null,
      dateFin: null,
      description: null,
      hours: null,
    },
    message: {
      actif: false,
      dateDebut: null,
      dateFin: null,
      description: null,
      message: null,
    },
  },
  updatedAt: new Date("2021-09-23T12:47:26.854Z"),
  updatedByUserAt: new Date("2021-09-23T12:47:26.854Z"),
  visibility: PlaceVisibility.ALL,
  sources: [
    {
      ids: [
        {
          id: "XXXXXXX",
          url: "https://dora.inclusion.beta.gouv.fr/structures/",
        },
      ],
      isOrigin: true,
      license: "https://www.etalab.gouv.fr/",
      name: "dora",
    },
  ],
});
