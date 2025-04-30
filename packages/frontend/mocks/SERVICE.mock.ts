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
  Categories,
  FAMILY_DEFAULT_VALUES,
  GENDER_DEFAULT_VALUES,
  OTHER_DEFAULT_VALUES,
  PlaceClosedHolidays,
  ServiceSaturation,
  WelcomedPublics,
  OpeningHours,
} from "@soliguide/common";

import { Service } from "../src/app/models/place";

export const SERVICE_MOCK: Service = {
  category: Categories.DAY_HOSTING,
  close: {
    actif: false,
    dateDebut: null,
    dateFin: null,
    description: null,
    infoColor: null,
    name: null,
    hours: null,
    status: null,
  },
  description: "Un service test",
  differentHours: false,
  differentModalities: false,
  differentPublics: false,
  hasSpecialName: false,
  hours: new OpeningHours({
    description: "",
    friday: {
      open: false,
      timeslot: [],
    },
    monday: {
      open: false,
      timeslot: [],
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
      open: false,
      timeslot: [],
    },
    closedHolidays: PlaceClosedHolidays.UNKNOWN,
  }),
  isOpenToday: false,
  modalities: {
    animal: { checked: true },
    appointment: { checked: false, precisions: null },
    inconditionnel: true,
    inscription: { checked: false, precisions: null },
    orientation: { checked: false, precisions: null },
    other: null,
    pmr: { checked: true },
    price: { checked: false, precisions: null },
    docs: [],
  },
  name: "",
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
  saturated: {
    status: ServiceSaturation.LOW,
    precision: "",
  },
  serviceObjectId: "617c031e4076c81e360c9c6d",
  show: false,
  showHoraires: false,
  showModalities: false,
  showPublics: false,
  createdAt: new Date(),
};
