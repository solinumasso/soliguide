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
  ApiPlace,
  Categories,
  CommonNewPlaceService,
  CountryCodes,
  GENDER_DEFAULT_VALUES,
  OTHER_DEFAULT_VALUES,
  PlaceClosedHolidays,
  PlaceType,
  PublicsAdministrative,
  PublicsFamily,
  PublicsGender,
  PublicsOther,
  ServiceSaturation,
  SoliguideCountries,
} from '@soliguide/common';

export const dummyPlaceId1 = '74a4dca1-9aa5-4284-8877-9405fb40e39a';
export const dummyPlaceId2 = '8ed66124-1deb-5559-4f27-9162157e6ce1';

export const dummyPlaceSource1 = `
  {
      "name": "custom_source_name",
      "ids": [
          {
              "id": "8ed66124-1deb-5559-4f27-9162157e6ce1",
              "url": null
          }
      ],
      "isOrigin": false
  }
`;

export const dummyExpectedResultsPairingToPair1 = {
  id: '086baa25-18e9-fab2-f6eb-3b54d6efb09f',
  source_name: 'test_source_name',
  structure_name: 'Accueil de Jour',
  latitude: 48.504334,
  longitude: -2.739063,
  address: '8 Rue Docteur Lamaze, 22000 Saint-Brieuc',
  city: 'Saint-Brieuc',
  postal_code: '22000',
  country: 'fr',
  department: "Côtes-d'armor",
  department_code: '22',
};

export const dummyExpectedResultsPairingToPair2 = {
  id: '8ed66124-1deb-5559-4f27-9162157e6ce1',
  source_name: 'custom_source_name',
  structure_name: 'Soligare Postgres Test',
  latitude: 48.845172,
  longitude: 2.285676,
  address: "15 Rue de l'Eglise, 75015 Paris",
  city: 'Paris',
  postal_code: '75015',
  country: 'fr',
  department: 'Paris',
  department_code: '75',
};

export const dummyExpectedResultsFormatSourceIdToSoliguideFormat: Pick<
  ApiPlace,
  | 'placeType'
  | 'name'
  | 'description'
  | 'entity'
  | 'languages'
  | 'position'
  | 'modalities'
  | 'publics'
  | 'newhours'
  | 'country'
> & {
  services_all: Array<
    Omit<CommonNewPlaceService, 'createdAt'> & { createdAt: string }
  >;
} = {
  placeType: PlaceType.PLACE,
  name: 'Soligare Postgres Test',
  description: '<p>Une description quelquonque</p>',
  entity: {
    phones: [
      {
        label: null,
        phoneNumber: '606060606',
        countryCode: 'fr',
        isSpecialPhoneNumber: false,
      },
    ],
    facebook: null!,
    fax: null!,
    instagram: null!,
    mail: 'unmailtest@mail.com',
    name: null!,
    website: 'https://solinum.org',
  },
  languages: ['fr', 'en', 'es'],
  position: {
    adresse: "15 Rue de l'Eglise, 75015 Paris",
    codePostal: '75015',
    complementAdresse: null,
    departement: 'Paris',
    departementCode: '75',
    location: {
      type: 'Point',
      coordinates: [2.285676, 48.845172],
    },
    pays: 'fr',
    ville: 'Paris',
    address: "15 Rue de l'Eglise, 75015 Paris",
    additionalInformation: null!,
    city: 'Paris',
    cityCode: '75115',
    postalCode: '75015',
    department: 'Paris',
    departmentCode: '75',
    region: 'Île-de-France',
    regionCode: '11',
    country: CountryCodes.FR,
    timeZone: 'Europe/Paris',
    slugs: {
      ville: 'paris',
      departement: 'paris',
      pays: 'fr',
      department: 'paris',
      country: 'fr',
      region: 'ile-de-france',
      city: 'paris',
    },
  },
  modalities: {
    inconditionnel: false,
    appointment: {
      checked: true,
      precisions: 'Une première précision',
    },
    inscription: {
      checked: false,
      precisions: null,
    },
    orientation: {
      checked: true,
      precisions: 'Une seconde précision',
    },
    price: {
      checked: false,
      precisions: null,
    },
    animal: {
      checked: false,
    },
    pmr: {
      checked: true,
    },
    docs: [],
    other: '<p>Une troisième précision plus globale</p>',
  },
  publics: {
    accueil: 2,
    description: 'Une information complémentaire',
    administrative: [
      PublicsAdministrative.regular,
      PublicsAdministrative.undocumented,
    ],
    familialle: [
      PublicsFamily.family,
      PublicsFamily.couple,
      PublicsFamily.pregnant,
    ],
    gender: [PublicsGender.women],
    other: [
      PublicsOther.addiction,
      PublicsOther.lgbt,
      PublicsOther.prison,
      PublicsOther.student,
      PublicsOther.ukraine,
      PublicsOther.violence,
    ],
    age: {
      max: 94,
      min: 32,
    },
    showAge: true,
  },
  newhours: {
    monday: {
      open: true,
      timeslot: [
        {
          start: '8h00',
          end: '17h00',
        },
      ],
    },
    tuesday: {
      open: true,
      timeslot: [
        {
          start: '8h00',
          end: '17h00',
        },
      ],
    },
    wednesday: {
      open: true,
      timeslot: [
        {
          start: '8h00',
          end: '12h00',
        },
        {
          start: '14h00',
          end: '17h00',
        },
      ],
    },
    thursday: {
      open: true,
      timeslot: [
        {
          start: '8h00',
          end: '17h00',
        },
      ],
    },
    friday: {
      open: true,
      timeslot: [
        {
          start: '8h00',
          end: '17h00',
        },
      ],
    },
    saturday: {
      open: true,
      timeslot: [
        {
          start: '5h00',
          end: '12h00',
        },
        {
          start: '13h00',
          end: '17h00',
        },
        {
          start: '20h00',
          end: '22h00',
        },
      ],
    },
    sunday: {
      open: true,
      timeslot: [
        {
          start: '8h00',
          end: '17h00',
        },
      ],
    },
    closedHolidays: PlaceClosedHolidays.OPEN,
    description: '',
  },
  services_all: [
    {
      close: {
        actif: false,
        dateDebut: null,
        dateFin: null,
      },
      description: '<p>La description du premier service</p>',
      differentHours: false,
      differentModalities: false,
      differentPublics: false,
      hours: {
        monday: {
          open: true,
          timeslot: [
            {
              end: '17h00',
              start: '8h00',
            },
          ],
        },
        tuesday: {
          open: true,
          timeslot: [
            {
              end: '17h00',
              start: '8h00',
            },
          ],
        },
        wednesday: {
          open: true,
          timeslot: [
            {
              end: '12h00',
              start: '8h00',
            },
            {
              end: '17h00',
              start: '14h00',
            },
          ],
        },
        thursday: {
          open: true,
          timeslot: [
            {
              end: '17h00',
              start: '8h00',
            },
          ],
        },
        friday: {
          open: true,
          timeslot: [
            {
              end: '17h00',
              start: '8h00',
            },
          ],
        },
        saturday: {
          open: true,
          timeslot: [
            {
              end: '12h00',
              start: '5h00',
            },
            {
              end: '17h00',
              start: '13h00',
            },
            {
              end: '22h00',
              start: '20h00',
            },
          ],
        },
        sunday: {
          open: true,
          timeslot: [
            {
              end: '17h00',
              start: '8h00',
            },
          ],
        },
        closedHolidays: PlaceClosedHolidays.OPEN,
        description: '',
      },
      isOpenToday: true,
      jobsList: '',
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
          checked: true,
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
          checked: true,
        },
        docs: [],
        other: null,
      },
      name: '',
      publics: {
        accueil: 2,
        description: null,
        administrative: [
          PublicsAdministrative.regular,
          PublicsAdministrative.undocumented,
        ],
        familialle: [
          PublicsFamily.family,
          PublicsFamily.couple,
          PublicsFamily.pregnant,
        ],
        gender: [PublicsGender.women],
        other: [
          PublicsOther.addiction,
          PublicsOther.lgbt,
          PublicsOther.prison,
          PublicsOther.student,
          PublicsOther.ukraine,
          PublicsOther.violence,
        ],
        age: {
          max: 94,
          min: 32,
        },
        showAge: true,
      },
      saturated: {
        status: ServiceSaturation.LOW,
        precision: null,
      },
      serviceObjectId: null,
      createdAt: '2024-10-25T00:00:00.000Z',
      category: Categories.FAMILY_AREA,
    },
    {
      close: {
        actif: false,
        dateDebut: null,
        dateFin: null,
      },
      description: '<p>Une seconde description de service</p>',
      differentHours: true,
      differentModalities: false,
      differentPublics: true,
      hours: {
        monday: {
          open: true,
          timeslot: [
            {
              end: '17h00',
              start: '8h00',
            },
          ],
        },
        tuesday: {
          open: true,
          timeslot: [
            {
              end: '17h00',
              start: '8h00',
            },
          ],
        },
        wednesday: {
          open: true,
          timeslot: [
            {
              end: '12h00',
              start: '8h00',
            },
            {
              end: '17h00',
              start: '14h00',
            },
          ],
        },
        thursday: {
          open: true,
          timeslot: [
            {
              end: '17h00',
              start: '8h00',
            },
          ],
        },
        friday: {
          open: true,
          timeslot: [
            {
              end: '17h00',
              start: '8h00',
            },
          ],
        },
        saturday: {
          open: true,
          timeslot: [
            {
              end: '12h00',
              start: '5h00',
            },
          ],
        },
        sunday: {
          open: true,
          timeslot: [
            {
              end: '17h00',
              start: '8h00',
            },
          ],
        },
        closedHolidays: PlaceClosedHolidays.OPEN,
        description: '',
      },
      isOpenToday: true,
      jobsList: '',
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
          checked: true,
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
          checked: true,
        },
        docs: [],
        other: null,
      },
      name: '',
      publics: {
        accueil: 0,
        description: 'Une information complémentaire spécifique au service',
        administrative: [
          PublicsAdministrative.regular,
          PublicsAdministrative.asylum,
          PublicsAdministrative.refugee,
          PublicsAdministrative.undocumented,
        ],
        familialle: [
          PublicsFamily.isolated,
          PublicsFamily.family,
          PublicsFamily.couple,
          PublicsFamily.pregnant,
        ],
        gender: structuredClone(GENDER_DEFAULT_VALUES),
        other: structuredClone(OTHER_DEFAULT_VALUES),
        age: {
          max: 99,
          min: 0,
        },
      },
      saturated: {
        status: ServiceSaturation.LOW,
        precision: null,
      },
      serviceObjectId: null,
      createdAt: '2024-10-25T00:00:01.000Z',
      category: Categories.ACCESS_TO_HOUSING,
    },
  ],
  country: 'fr' as SoliguideCountries,
};
