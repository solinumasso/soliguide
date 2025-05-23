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

import type { Modalities } from "../../../modalities";
import { SupportedLanguagesCode } from "../../enums";

export interface PlaceModalitiesMock {
  lieu_id: number;
  modalities: Modalities;
  expectedResults: {
    [key in SupportedLanguagesCode]: string;
  };
  name: string;
}

export const PLACE_MODALITIES_MOCK: PlaceModalitiesMock[] = [
  {
    expectedResults: {
      ar: "",
      ca: "",
      en: "",
      es: "",
      fa: "",
      fr: "",
      ka: "",
      ps: "",
      ro: "",
      ru: "",
      uk: "",
    },
    lieu_id: 21,
    modalities: {
      inconditionnel: true,
      appointment: {
        checked: false,
        precisions: null,
      },
      inscription: {
        checked: false,
        precisions: null,
      },
      orientation: {
        checked: false,
        precisions: null,
      },
      price: {
        checked: false,
        precisions: null,
      },
      animal: {
        checked: false,
      },
      pmr: {
        checked: false,
      },
      docs: [],
      other: null,
    },
    name: "Unconditional - ESI La maison dans la rue",
  },
  {
    expectedResults: {
      ar: "بناءً على موعد",
      ca: "Amb cita prèvia",
      en: "By appointment only",
      es: "Con cita previa",
      fa: "در قرار ملاقات",
      fr: "Sur rendez-vous",
      ka: "Დანიშვნაზე",
      ps: "په تقرر کې",
      ro: "Pe bază de programare",
      ru: "Только по предварительной записи",
      uk: "За призначенням",
    },
    lieu_id: 300,
    modalities: {
      inconditionnel: false,
      appointment: {
        checked: true,
        precisions: null,
      },
      inscription: {
        checked: false,
        precisions: null,
      },
      orientation: {
        checked: false,
        precisions: null,
      },
      price: {
        checked: false,
        precisions: null,
      },
      animal: {
        checked: false,
      },
      pmr: {
        checked: false,
      },
      docs: [],
      other: null,
    },
    name: "Accueil exclusif en situation régulière. - Service Social de Proximité (SSP) du 18ème ",
  },
  {
    expectedResults: {
      ar: "الحيوانات المقبولة\nتفاصيل أخرى: Data in french, only for test",
      ca: "S'accepten animals\nAltres detalls: Data in french, only for test",
      en: "Accepted animals\nOther details: Data in french, only for test",
      es: "Animales aceptados\nOtros detalles: Data in french, only for test",
      fa: "حیوانات پذیرفته شده\nجزئیات دیگر: Data in french, only for test",
      fr: "Animaux acceptés\nAutres précisions: Data in french, only for test",
      ka: "Პაროლები უნდა იყოს იგივე\nᲡხვა დეტალები: Data in french, only for test",
      ps: "منل شوي څاروي\nنور جزیات: Data in french, only for test",
      ro: "Animalele sunt binevenite\nAlte detalii: Data in french, only for test",
      ru: "Принятые животные\nДругие детали: Data in french, only for test",
      uk: "Прийнятих тварин\nІнші деталі: Data in french, only for test",
    },
    lieu_id: 30,
    modalities: {
      inconditionnel: true,
      appointment: {
        checked: false,
        precisions: null,
      },
      inscription: {
        checked: false,
        precisions: null,
      },
      orientation: {
        checked: false,
        precisions: null,
      },
      price: {
        checked: false,
        precisions: null,
      },
      animal: {
        checked: true,
      },
      pmr: {
        checked: false,
      },
      docs: [],
      other: "Data in french, only for test",
    },
    name: "Accueil inconditionnel : Bus Abri",
  },
];
