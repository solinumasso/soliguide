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
  PlaceStatus,
  PlaceType,
  PlaceVisibility,
  Categories,
  ServiceStyleType,
  PlaceClosedHolidays,
  ServiceSaturation,
  CountryCodes,
  FR_DEPARTMENT_CODES,
  FR_REGION_CODES,
  FR_TIMEZONES,
  PlaceOpeningStatus,
  SupportedLanguagesCode,
  type ApiPlace,
  FAMILY_DEFAULT_VALUES,
  GENDER_DEFAULT_VALUES,
  ADMINISTRATIVE_DEFAULT_VALUES,
  OTHER_DEFAULT_VALUES
} from '@soliguide/common';
import { PlaceDetailsInfoType, type PlaceDetails } from './types';

const samplePlace: ApiPlace = Object.freeze({
  _id: '5a58c0c7c1797fe45e377324',
  // eslint-disable-next-line camelcase
  lieu_id: 154,
  name: 'Soupe Saint-Eustache',
  sourceLanguage: SupportedLanguagesCode.FR,
  country: CountryCodes.FR,
  description:
    "<p>Repas complets servis sur le parvis de l'église Saint-Eustache. Il est conseillé d'arriver en avance.</p><p><strong>Attention : il s'agit d'un dispositif hivernal qui commence le 1er décembre et qui finit le 31 mars.</strong></p>",
  entity: {
    mail: 'lasoupe@saint-eustache.org',
    facebook: '',
    website: 'http://www.soupesainteustache.fr',
    phones: [
      {
        label: '',
        phoneNumber: '01 42 36 31 05',
        countryCode: 'fr',
        isSpecialPhoneNumber: false
      }
    ]
  },
  updatedAt: '2024-06-11T15:27:13.409Z',
  // eslint-disable-next-line camelcase
  seo_url: 'soupe-saint-eustache-paris-154',
  // eslint-disable-next-line camelcase
  services_all: [
    {
      categorie: 601,
      close: { actif: false, dateDebut: null, dateFin: null },
      description: "Repas complets à emporter sur le parvis de l'église Saint-Eustache",
      differentHours: false,
      differentModalities: false,
      differentPublics: false,
      hours: {
        closedHolidays: PlaceClosedHolidays.UNKNOWN,
        description: null,
        friday: { open: true, timeslot: [{ end: 2015, start: 1930 }] },
        monday: { open: true, timeslot: [{ end: 2015, start: 1930 }] },
        saturday: { open: true, timeslot: [{ end: 2015, start: 1930 }] },
        sunday: { open: true, timeslot: [{ end: 2015, start: 1930 }] },
        thursday: { open: true, timeslot: [{ end: 2015, start: 1930 }] },
        tuesday: { open: true, timeslot: [{ end: 2015, start: 1930 }] },
        wednesday: { open: true, timeslot: [{ end: 2015, start: 1930 }] }
      },
      isOpenToday: true,
      modalities: {
        inconditionnel: true,
        appointment: { checked: false, precisions: null },
        inscription: { checked: false, precisions: null },
        orientation: { checked: false, precisions: null },
        price: { checked: false, precisions: null },
        animal: { checked: false },
        pmr: { checked: false },
        other: null,
        docs: []
      },
      name: 'Distribution alimentaire',
      publics: {
        accueil: 0,
        administrative: structuredClone(ADMINISTRATIVE_DEFAULT_VALUES),
        age: { max: 99, min: 0 },
        description: null,
        familialle: structuredClone(FAMILY_DEFAULT_VALUES),
        gender: structuredClone(GENDER_DEFAULT_VALUES),
        other: structuredClone(OTHER_DEFAULT_VALUES)
      },
      saturated: { precision: null, status: ServiceSaturation.LOW },
      serviceObjectId: '6181a6db8ac6b179ffb9ff3b',
      createdAt: new Date('2021-11-02T21:00:11.000Z'),
      category: Categories.FOOD_DISTRIBUTION,
      categorySpecificFields: { serviceStyleType: [ServiceStyleType.TAKE_AWAY] }
    },
    {
      categorie: 701,
      close: { actif: false, dateDebut: null, dateFin: null },
      description: "Accueil autour d'un caf&#233;",
      differentHours: false,
      differentModalities: false,
      differentPublics: false,
      hours: {
        closedHolidays: PlaceClosedHolidays.UNKNOWN,
        description: null,
        friday: {
          open: true,
          timeslot: [
            { end: 1300, start: 900 },
            { end: 1700, start: 1400 }
          ]
        },
        monday: {
          open: true,
          timeslot: [
            { end: 1300, start: 900 },
            { end: 1700, start: 1400 }
          ]
        },
        saturday: { open: false, timeslot: [] },
        sunday: { open: false, timeslot: [] },
        thursday: {
          open: true,
          timeslot: [
            { end: 1300, start: 900 },
            { end: 1700, start: 1400 }
          ]
        },
        tuesday: {
          open: true,
          timeslot: [
            { end: 1300, start: 900 },
            { end: 1700, start: 1400 }
          ]
        },
        wednesday: {
          open: true,
          timeslot: [
            { end: 1300, start: 900 },
            { end: 1700, start: 1400 }
          ]
        }
      },
      isOpenToday: false,
      jobsList: '',
      modalities: {
        inconditionnel: true,
        appointment: { checked: false, precisions: null },
        inscription: { checked: false, precisions: null },
        orientation: { checked: false, precisions: null },
        price: { checked: false, precisions: null },
        animal: { checked: false },
        pmr: { checked: false },
        docs: [],
        other: null
      },
      name: 'Accueil de jour',
      publics: {
        accueil: 0,
        administrative: structuredClone(ADMINISTRATIVE_DEFAULT_VALUES),

        age: { max: 99, min: 0 },
        description: null,
        familialle: structuredClone(FAMILY_DEFAULT_VALUES),
        gender: structuredClone(GENDER_DEFAULT_VALUES),
        other: structuredClone(OTHER_DEFAULT_VALUES)
      },
      saturated: { precision: null, status: ServiceSaturation.LOW },
      serviceObjectId: '6181a6d08ac6b179ffb9fcc1',
      createdAt: new Date('2021-11-02T21:00:00.000Z'),
      category: Categories.DAY_HOSTING
    },
    {
      categorie: 101,
      close: { actif: false, dateDebut: null, dateFin: null },
      description: '01 43 72 12 72&#10;R&#233;unions de groupe des Narcotiques Anonymes',
      differentHours: false,
      differentModalities: false,
      differentPublics: false,
      hours: {
        closedHolidays: PlaceClosedHolidays.UNKNOWN,
        description: null,
        friday: {
          open: true,
          timeslot: [
            { end: 1300, start: 900 },
            { end: 1700, start: 1400 }
          ]
        },
        monday: {
          open: true,
          timeslot: [
            { end: 1300, start: 900 },
            { end: 1700, start: 1400 }
          ]
        },
        saturday: { open: false, timeslot: [] },
        sunday: { open: false, timeslot: [] },
        thursday: {
          open: true,
          timeslot: [
            { end: 1300, start: 900 },
            { end: 1700, start: 1400 }
          ]
        },
        tuesday: {
          open: true,
          timeslot: [
            { end: 1300, start: 900 },
            { end: 1700, start: 1400 }
          ]
        },
        wednesday: {
          open: true,
          timeslot: [
            { end: 1300, start: 900 },
            { end: 1700, start: 1400 }
          ]
        }
      },
      isOpenToday: false,
      jobsList: '',
      modalities: {
        inconditionnel: true,
        appointment: { checked: false, precisions: null },
        inscription: { checked: false, precisions: null },
        orientation: { checked: false, precisions: null },
        price: { checked: false, precisions: null },
        animal: { checked: false },
        pmr: { checked: false },
        docs: [],
        other: null
      },
      publics: {
        accueil: 0,
        administrative: structuredClone(ADMINISTRATIVE_DEFAULT_VALUES),

        age: { max: 99, min: 0 },
        description: null,
        familialle: structuredClone(FAMILY_DEFAULT_VALUES),

        gender: structuredClone(GENDER_DEFAULT_VALUES),
        other: structuredClone(OTHER_DEFAULT_VALUES)
      },
      saturated: { precision: null, status: ServiceSaturation.LOW },
      serviceObjectId: '6181a6d08ac6b179ffb9fcc3',
      createdAt: new Date('2021-11-02T21:00:00.000Z'),
      category: Categories.ADDICTION
    }
  ],
  languages: ['fr'],
  modalities: {
    animal: { checked: false },
    appointment: { checked: false, precisions: null },
    inscription: { checked: false, precisions: null },
    orientation: { checked: false, precisions: null },
    pmr: { checked: false },
    price: { checked: false, precisions: null },
    inconditionnel: true,
    other: null,
    docs: []
  },
  publics: {
    age: { min: 0, max: 99 },
    accueil: 0,
    administrative: structuredClone(ADMINISTRATIVE_DEFAULT_VALUES),
    description: null,
    familialle: structuredClone(FAMILY_DEFAULT_VALUES),
    gender: structuredClone(GENDER_DEFAULT_VALUES),
    other: structuredClone(OTHER_DEFAULT_VALUES)
  },
  newhours: {
    description: '',
    friday: { open: true, timeslot: [{ end: 2015, start: 1930 }] },
    monday: { open: true, timeslot: [{ end: 2015, start: 1930 }] },
    saturday: { open: true, timeslot: [{ end: 2015, start: 1930 }] },
    sunday: { open: true, timeslot: [{ end: 2015, start: 1930 }] },
    thursday: { open: true, timeslot: [{ end: 2015, start: 1930 }] },
    tuesday: { open: true, timeslot: [{ end: 2015, start: 1930 }] },
    wednesday: { open: true, timeslot: [{ end: 2015, start: 1930 }] },
    closedHolidays: PlaceClosedHolidays.UNKNOWN
  },
  createdAt: new Date('2018-01-12T14:05:59.000Z'),
  tempInfos: {
    closure: { actif: false, dateDebut: null, dateFin: null, description: null },
    hours: { actif: false, dateDebut: null, dateFin: null, description: null, hours: null },
    message: { actif: false, dateDebut: null, dateFin: null, description: null, name: null }
  },
  placeType: PlaceType.PLACE,
  position: {
    adresse: '1 Rue Montmartre, 75001 Paris',
    codePostal: '75001',
    complementAdresse: '',
    departement: 'Paris',
    departementCode: '75',
    location: { coordinates: [2.345897, 48.86323609999999], type: 'Point' },
    pays: 'fr',
    region: 'Île-de-France',
    slugs: {
      ville: 'paris',
      departement: 'paris',
      pays: 'fr',
      department: 'paris',
      country: 'fr',
      region: 'ile-de-france',
      city: 'paris'
    },
    ville: 'Paris',
    address: '1 Rue Montmartre, 75001 Paris',
    additionalInformation: '',
    city: 'Paris',
    postalCode: '75001',
    cityCode: '75001',
    department: 'Paris',
    departmentCode: FR_DEPARTMENT_CODES['75'],
    country: CountryCodes.FR,
    regionCode: FR_REGION_CODES['11'],
    timeZone: FR_TIMEZONES[4]
  },
  campaigns: {
    UKRAINE_2022: { changes: false, date: '2022-04-01T09:36:05.977Z', updated: true },
    MAJ_ETE_2022: {
      currentStep: 4,
      general: {
        changes: false,
        endDate: '2022-06-29T12:52:48.657Z',
        startDate: '2022-06-29T12:52:48.657Z',
        updated: true
      },
      remindMeDate: null,
      sections: {
        closed: { changes: false, date: '2022-06-29T12:52:48.658Z', updated: true },
        hours: { changes: false, date: '2022-06-29T12:52:48.658Z', updated: true },
        services: { changes: false, date: '2022-06-29T12:52:48.658Z', updated: true },
        tempMessage: { changes: false, date: '2022-06-29T12:52:48.658Z', updated: true }
      },
      status: 'FINISHED',
      toUpdate: true,
      autonomy: 'NOT_AUTONOMOUS',
      source: 'CALL'
    },
    MAJ_HIVER_2022: {
      autonomy: 'NOT_AUTONOMOUS',
      currentStep: 4,
      general: {
        changes: false,
        endDate: '2022-11-30T11:40:40.410Z',
        startDate: '2022-11-30T11:40:40.410Z',
        updated: true
      },
      remindMeDate: null,
      sections: {
        tempClosure: { changes: false, date: '2022-11-30T11:40:40.410Z', updated: true },
        hours: { changes: false, date: '2022-11-30T11:40:40.410Z', updated: true },
        services: { changes: false, date: '2022-11-30T11:40:40.410Z', updated: true },
        tempMessage: { changes: false, date: '2022-11-30T11:40:40.410Z', updated: true }
      },
      status: 'FINISHED',
      toUpdate: true
    },
    MAJ_ETE_2023: {
      autonomy: 'NOT_AUTONOMOUS',
      currentStep: 4,
      general: {
        changes: false,
        endDate: '2023-06-13T08:51:24.996Z',
        startDate: '2023-06-13T08:51:24.996Z',
        updated: true
      },
      remindMeDate: null,
      sections: {
        tempClosure: { changes: false, date: '2023-06-13T08:51:24.996Z', updated: true },
        hours: { changes: false, date: '2023-06-13T08:51:24.996Z', updated: true },
        services: { changes: false, date: '2023-06-13T08:51:24.996Z', updated: true },
        tempMessage: { changes: false, date: '2023-06-13T08:51:24.996Z', updated: true }
      },
      source: 'CALL',
      status: 'FINISHED',
      toUpdate: true
    },
    MAJ_HIVER_2023: {
      autonomy: 'NOT_AUTONOMOUS',
      currentStep: 4,
      general: {
        changes: false,
        endDate: '2023-11-23T10:06:08.361Z',
        startDate: '2023-11-23T10:06:08.361Z',
        updated: true
      },
      remindMeDate: null,
      sections: {
        tempClosure: { changes: false, date: '2023-11-23T10:06:08.361Z', updated: true },
        hours: { changes: false, date: '2023-11-23T10:06:08.361Z', updated: true },
        services: { changes: false, date: '2023-11-23T10:06:08.361Z', updated: true },
        tempMessage: { changes: false, date: '2023-11-23T10:06:08.361Z', updated: true }
      },
      source: 'CALL',
      status: 'FINISHED',
      toUpdate: true
    },
    MAJ_ETE_2024: {
      autonomy: 'NOT_AUTONOMOUS',
      currentStep: 4,
      general: {
        changes: false,
        endDate: '2024-06-11T15:27:13.379Z',
        startDate: '2024-06-11T15:27:13.379Z',
        updated: true
      },
      remindMeDate: null,
      sections: {
        tempClosure: { changes: false, date: '2024-06-11T15:27:13.379Z', updated: true },
        hours: { changes: false, date: '2024-06-11T15:27:13.379Z', updated: true },
        services: { changes: false, date: '2024-06-11T15:27:13.379Z', updated: true },
        tempMessage: { changes: false, date: '2024-06-11T15:27:13.379Z', updated: true }
      },
      source: null,
      status: 'FINISHED',
      toUpdate: true
    }
  },
  visibility: PlaceVisibility.ALL,
  isOpenToday: true,
  atSync: {
    airtableId: 'XXX',
    excluded: false,
    lastSync: '2024-06-14T04:28:31.225Z'
  },
  status: PlaceStatus.ONLINE,
  updatedByUserAt: '2024-06-11T15:27:13.409Z',
  createdBy: null,
  auto: false,
  distance: 478.42644975047216,
  statusSort: 0,
  photos: [],
  parcours: [],
  organizations: [],
  stepsDone: {
    conditions: true,
    horaires: true,
    infos: true,
    photos: true,
    contacts: true,
    publics: true,
    services: true,
    emplacement: true
  }
});

const samplePlaceTransformed: PlaceDetails = {
  id: 154,
  address: '1 Rue Montmartre, 75001 Paris',
  description:
    "<p>Repas complets servis sur le parvis de l'église Saint-Eustache. Il est conseillé d'arriver en avance.</p><p><strong>Attention : il s'agit d'un dispositif hivernal qui commence le 1er décembre et qui finit le 31 mars.</strong></p>",
  email: 'lasoupe@saint-eustache.org',
  facebook: '',
  fax: '',
  hours: {
    monday: [
      {
        start: '1930',
        end: '2015'
      }
    ],
    tuesday: [
      {
        start: '1930',
        end: '2015'
      }
    ],
    wednesday: [
      {
        start: '1930',
        end: '2015'
      }
    ],
    thursday: [
      {
        start: '1930',
        end: '2015'
      }
    ],
    friday: [
      {
        start: '1930',
        end: '2015'
      }
    ],
    saturday: [
      {
        start: '1930',
        end: '2015'
      }
    ],
    sunday: [
      {
        start: '1930',
        end: '2015'
      }
    ]
  },
  info: [
    {
      type: PlaceDetailsInfoType.WELCOME_UNCONDITIONAL,
      tags: [],
      description: [],
      needTranslation: false,
      translatedText: '<b>Unconditional welcome</b>'
    },
    { type: PlaceDetailsInfoType.ACCESS_FREE, tags: [], description: [], needTranslation: true },
    {
      type: PlaceDetailsInfoType.LANGUAGES_SPOKEN,
      tags: [],
      description: [{ key: 'LANGUE_FR' }],
      needTranslation: true
    }
  ],
  instagram: '',
  lastUpdate: '2024-06-11T15:27:13.409Z',
  name: 'Soupe Saint-Eustache',
  onOrientation: false,
  phones: [
    {
      label: '',
      phoneNumber: '01 42 36 31 05',
      countryCode: CountryCodes.FR,
      isSpecialPhoneNumber: false
    }
  ],
  /* eslint-disable no-undefined */
  tempInfo: {
    closure: {
      _id: undefined,
      actif: false,
      dateDebut: null,
      dateFin: null,
      description: null,
      infoColor: '',
      name: null,
      status: null,
      hours: null,
      isCampaign: false,
      isService: false,
      serviceActif: false
    },
    hours: {
      _id: undefined,
      actif: false,
      dateDebut: null,
      dateFin: null,
      description: null,
      infoColor: '',
      name: null,
      status: null,
      hours: null,
      isCampaign: false,
      isService: false,
      serviceActif: false
    },
    message: {
      _id: undefined,
      actif: false,
      dateDebut: null,
      dateFin: null,
      description: null,
      infoColor: '',
      name: null,
      status: null,
      hours: null,
      isCampaign: false,
      isService: false,
      serviceActif: false
    }
  },
  services: [
    {
      category: Categories.FOOD_DISTRIBUTION,
      description: "Repas complets à emporter sur le parvis de l'église Saint-Eustache",
      info: []
    },
    {
      category: Categories.DAY_HOSTING,
      description: "Accueil autour d'un caf&#233;",
      info: []
    },
    {
      category: Categories.ADDICTION,
      description: '01 43 72 12 72&#10;R&#233;unions de groupe des Narcotiques Anonymes',
      info: []
    }
  ],
  sources: [],
  status: PlaceOpeningStatus.OPEN,
  todayInfo: {
    openingHours: [
      {
        start: '1930',
        end: '2015'
      }
    ]
  },
  website: 'http://www.soupesainteustache.fr'
};

export { samplePlace, samplePlaceTransformed };
