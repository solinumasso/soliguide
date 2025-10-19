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
  CountryCodes,
  FAMILY_DEFAULT_VALUES,
  FR_DEPARTMENT_CODES,
  FR_REGION_CODES,
  FR_TIMEZONES,
  GENDER_DEFAULT_VALUES,
  GeoTypes,
  OTHER_DEFAULT_VALUES,
  PlaceClosedHolidays,
  PlaceOpeningStatus,
  PlaceStatus,
  PlaceType,
  PlaceVisibility,
  ServiceSaturation,
  ServiceStyleType,
  SupportedLanguagesCode,
  type ApiPlace,
  type CommonPlaceParcours,
  TempInfoStatus,
  CommonPlacePosition
} from '@soliguide/common';
import type { SearchResultPlaceCard } from './types';

const samplePlace: ApiPlace = Object.freeze({
  _id: '5a58c0c7c1797fe45e377324',
  // eslint-disable-next-line camelcase
  lieu_id: 154,
  name: 'Soupe Saint-Eustache',
  description:
    "<p>Repas complets servis sur le parvis de l'église Saint-Eustache. Il est conseillé d'arriver en avance.</p><p><strong>Attention : il s'agit d'un dispositif hivernal qui commence le 1er décembre et qui finit le 31 mars.</strong></p>",
  sourceLanguage: SupportedLanguagesCode.FR,
  country: CountryCodes.FR,
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
        animal: { checked: true },
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
    }
  ],
  languages: ['fr'],
  modalities: {
    animal: { checked: true },
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
    closure: {
      actif: true,
      dateDebut: '2024-04-01T00:00:00.000Z',
      dateFin: '2024-11-30T23:59:59.000Z',
      description: '<p>Dispositif hivernal</p>'
    },
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
    },
    MID_YEAR_2025: {
      autonomy: 'UNKNOWN',
      currentStep: 0,
      general: {
        changes: false,
        endDate: null,
        startDate: null,
        updated: false
      },
      remindMeDate: null,
      sections: {
        hours: {
          changes: false,
          date: null,
          updated: false
        },
        services: {
          changes: false,
          date: null,
          updated: false
        },
        tempClosure: {
          changes: false,
          date: null,
          updated: false
        },
        tempMessage: {
          changes: false,
          date: null,
          updated: false
        }
      },
      source: null,
      status: 'TO_DO',
      toUpdate: false
    },
    END_YEAR_2025: {
      autonomy: 'UNKNOWN',
      currentStep: 0,
      general: {
        changes: false,
        endDate: null,
        startDate: null,
        updated: false
      },
      remindMeDate: null,
      sections: {
        hours: {
          changes: false,
          date: null,
          updated: false
        },
        services: {
          changes: false,
          date: null,
          updated: false
        },
        tempClosure: {
          changes: false,
          date: null,
          updated: false
        },
        tempMessage: {
          changes: false,
          date: null,
          updated: false
        }
      },
      source: null,
      status: 'TO_DO',
      toUpdate: false
    }
  },
  visibility: PlaceVisibility.ALL,
  isOpenToday: false,
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

const samplePlaceTransformed: SearchResultPlaceCard = Object.freeze({
  address: '1 Rue Montmartre, 75001 Paris',
  banners: { orientation: false, holidays: PlaceClosedHolidays.UNKNOWN, campaign: null },
  dataForLogs: {
    id: '5a58c0c7c1797fe45e377324',
    lieuId: 154,
    distance: 478.42644975047216,
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
    }
  },
  distance: 478.42644975047216,
  id: 154,
  name: 'Soupe Saint-Eustache',
  phones: [
    {
      countryCode: CountryCodes.FR,
      isSpecialPhoneNumber: false,
      label: '',
      phoneNumber: '01 42 36 31 05'
    }
  ],
  searchGeoType: GeoTypes.POSITION,
  seoUrl: 'soupe-saint-eustache-paris-154',
  services: [Categories.FOOD_DISTRIBUTION],
  sources: [],
  status: PlaceOpeningStatus.TEMPORARILY_CLOSED,
  tempInfo: { hours: null, message: null, closure: TempInfoStatus.CURRENT },
  todayInfo: {
    closingDays: { end: '2024-11-30T23:59:59.000Z', start: '2024-04-01T00:00:00.000Z' }
  }
});

const sampleItinerary: ApiPlace = Object.freeze({
  _id: '643e5053bb2e82804132cd19',
  sourceLanguage: SupportedLanguagesCode.FR,
  country: CountryCodes.FR,
  auto: false,
  campaigns: {
    UKRAINE_2022: {
      changes: false,
      date: null,
      updated: false
    },
    MAJ_ETE_2022: {
      autonomy: 'UNKNOWN',
      currentStep: 0,
      general: {
        changes: false,
        endDate: null,
        startDate: null,
        updated: false
      },
      remindMeDate: null,
      sections: {
        tempClosure: {
          changes: false,
          date: null,
          updated: false
        },
        hours: {
          changes: false,
          date: null,
          updated: false
        },
        services: {
          changes: false,
          date: null,
          updated: false
        },
        tempMessage: {
          changes: false,
          date: null,
          updated: false
        }
      },
      source: null,
      status: 'TO_DO',
      toUpdate: false
    },
    MAJ_HIVER_2022: {
      autonomy: 'UNKNOWN',
      currentStep: 0,
      general: {
        changes: false,
        endDate: null,
        startDate: null,
        updated: false
      },
      remindMeDate: null,
      sections: {
        tempClosure: {
          changes: false,
          date: null,
          updated: false
        },
        hours: {
          changes: false,
          date: null,
          updated: false
        },
        services: {
          changes: false,
          date: null,
          updated: false
        },
        tempMessage: {
          changes: false,
          date: null,
          updated: false
        }
      },
      source: null,
      status: 'TO_DO',
      toUpdate: false
    },
    MAJ_ETE_2023: {
      autonomy: 'NOT_AUTONOMOUS',
      currentStep: 4,
      general: {
        changes: false,
        endDate: '2023-06-13T15:43:37.816Z',
        startDate: '2023-06-13T15:43:37.816Z',
        updated: true
      },
      remindMeDate: null,
      sections: {
        tempClosure: {
          changes: false,
          date: '2023-06-13T15:43:37.816Z',
          updated: true
        },
        hours: {
          changes: false,
          date: '2023-06-13T15:43:37.816Z',
          updated: true
        },
        services: {
          changes: false,
          date: '2023-06-13T15:43:37.816Z',
          updated: true
        },
        tempMessage: {
          changes: false,
          date: '2023-06-13T15:43:37.816Z',
          updated: true
        }
      },
      source: null,
      status: 'FINISHED',
      toUpdate: true
    },
    MAJ_HIVER_2023: {
      autonomy: 'NOT_AUTONOMOUS',
      currentStep: 4,
      general: {
        changes: false,
        endDate: '2023-12-28T14:21:56.191Z',
        startDate: '2023-12-28T14:21:56.191Z',
        updated: true
      },
      remindMeDate: null,
      sections: {
        tempClosure: {
          changes: false,
          date: '2023-12-28T14:21:56.191Z',
          updated: true
        },
        hours: {
          changes: false,
          date: '2023-12-28T14:21:56.191Z',
          updated: true
        },
        services: {
          changes: false,
          date: '2023-12-28T14:21:56.191Z',
          updated: true
        },
        tempMessage: {
          changes: false,
          date: '2023-12-28T14:21:56.191Z',
          updated: true
        }
      },
      source: 'EMAIL',
      status: 'FINISHED',
      toUpdate: true
    },
    MAJ_ETE_2024: {
      autonomy: 'NOT_AUTONOMOUS',
      currentStep: 4,
      general: {
        changes: false,
        endDate: '2024-06-17T10:00:45.063Z',
        startDate: '2024-06-17T10:00:45.063Z',
        updated: true
      },
      remindMeDate: null,
      sections: {
        tempClosure: {
          changes: false,
          date: '2024-06-17T10:00:45.063Z',
          updated: true
        },
        hours: {
          changes: false,
          date: '2024-06-17T10:00:45.063Z',
          updated: true
        },
        services: {
          changes: false,
          date: '2024-06-17T10:00:45.063Z',
          updated: true
        },
        tempMessage: {
          changes: false,
          date: '2024-06-17T10:00:45.063Z',
          updated: true
        }
      },
      source: 'CALL',
      status: 'FINISHED',
      toUpdate: true
    },
    MID_YEAR_2025: {
      autonomy: 'UNKNOWN',
      currentStep: 0,
      general: {
        changes: false,
        endDate: null,
        startDate: null,
        updated: false
      },
      remindMeDate: null,
      sections: {
        hours: {
          changes: false,
          date: null,
          updated: false
        },
        services: {
          changes: false,
          date: null,
          updated: false
        },
        tempClosure: {
          changes: false,
          date: null,
          updated: false
        },
        tempMessage: {
          changes: false,
          date: null,
          updated: false
        }
      },
      source: null,
      status: 'TO_DO',
      toUpdate: false
    },
    END_YEAR_2025: {
      autonomy: 'UNKNOWN',
      currentStep: 0,
      general: {
        changes: false,
        endDate: null,
        startDate: null,
        updated: false
      },
      remindMeDate: null,
      sections: {
        hours: {
          changes: false,
          date: null,
          updated: false
        },
        services: {
          changes: false,
          date: null,
          updated: false
        },
        tempClosure: {
          changes: false,
          date: null,
          updated: false
        },
        tempMessage: {
          changes: false,
          date: null,
          updated: false
        }
      },
      source: null,
      status: 'TO_DO',
      toUpdate: false
    }
  },
  description:
    '<p>La Balade des Lucioles est une association qui organise des maraudes pédestres dans différents arrondissements de Paris.</p><p><strong>Les passages et horaires sont approximatifs.</strong></p><p>Au programme : tour des boulangeries partenaires pour récupérer leurs invendus, confection de sandwichs et distribution aux personnes sans domicile&nbsp;croisées pendant la maraude !</p><p>&nbsp;</p>',
  entity: {
    mail: 'labaladedeslucioles@gmail.com',
    facebook: 'https://www.facebook.com/baladedeslucioles/',
    website: 'http://labaladedeslucioles.org/',
    phones: [
      {
        label: null,
        phoneNumber: '07 69 06 74 44',
        countryCode: 'fr',
        isSpecialPhoneNumber: false
      }
    ]
  },
  isOpenToday: true,
  languages: ['fr'],
  // eslint-disable-next-line camelcase
  lieu_id: 30965,
  modalities: {
    inconditionnel: true,
    appointment: {
      checked: false,
      precisions: null
    },
    inscription: {
      checked: false,
      precisions: null
    },
    orientation: {
      checked: false,
      precisions: null
    },
    price: {
      checked: false,
      precisions: null
    },
    animal: {
      checked: false
    },
    pmr: {
      checked: false
    },
    other: null,
    docs: []
  },
  name: 'Maraude Balades des Lucioles 13e Paris',
  newhours: {
    closedHolidays: PlaceClosedHolidays.UNKNOWN,
    description: null,
    friday: {
      open: true,
      timeslot: [
        {
          end: 2215,
          start: 1950
        }
      ]
    },
    monday: {
      open: false,
      timeslot: []
    },
    saturday: {
      open: false,
      timeslot: []
    },
    sunday: {
      open: false,
      timeslot: []
    },
    thursday: {
      open: false,
      timeslot: []
    },
    tuesday: {
      open: true,
      timeslot: [
        {
          end: 2215,
          start: 1950
        }
      ]
    },
    wednesday: {
      open: true,
      timeslot: [
        {
          end: 2215,
          start: 1950
        }
      ]
    }
  },
  placeType: PlaceType.ITINERARY,
  publics: {
    accueil: 0,
    administrative: structuredClone(ADMINISTRATIVE_DEFAULT_VALUES),
    age: {
      max: 99,
      min: 0
    },
    description: null,
    familialle: structuredClone(FAMILY_DEFAULT_VALUES),
    gender: structuredClone(GENDER_DEFAULT_VALUES),
    other: structuredClone(OTHER_DEFAULT_VALUES)
  },
  // eslint-disable-next-line camelcase
  seo_url: 'maraude-balades-des-lucioles-13e-paris-30965',
  status: PlaceStatus.ONLINE,
  tempInfos: {
    closure: {
      actif: false,
      dateDebut: null,
      dateFin: null,
      description: null
    },
    hours: {
      actif: false,
      dateDebut: null,
      dateFin: null,
      description: null,
      hours: null
    },
    message: {
      actif: false,
      dateDebut: null,
      dateFin: null,
      description: null,
      name: null
    }
  },
  visibility: PlaceVisibility.ALL,
  parcours: [
    {
      description: '',
      hours: {
        closedHolidays: PlaceClosedHolidays.UNKNOWN,
        description: '',
        friday: {
          open: true,
          timeslot: [
            {
              end: 2000,
              start: 1950
            }
          ]
        },
        monday: {
          open: false,
          timeslot: []
        },
        saturday: {
          open: false,
          timeslot: []
        },
        sunday: {
          open: false,
          timeslot: []
        },
        thursday: {
          open: false,
          timeslot: []
        },
        tuesday: {
          open: true,
          timeslot: [
            {
              end: 2000,
              start: 1950
            }
          ]
        },
        wednesday: {
          open: true,
          timeslot: [
            {
              end: 2000,
              start: 1950
            }
          ]
        }
      },
      photos: [],
      position: {
        location: {
          coordinates: [2.362892, 48.833218],
          type: 'Point'
        },
        adresse: 'Nationale, 75013 Paris 13e Arrondissement',
        codePostal: '75013',
        complementAdresse: "Point d'arrivée de la maraude",
        departement: 'Paris',
        departementCode: '75',
        pays: 'fr',
        ville: 'Paris 13e Arrondissement',
        region: 'Île-de-France',
        additionalInformation: "Point d'arrivée de la maraude",
        address: 'Nationale, 75013 Paris 13e Arrondissement',
        city: 'Paris 13e Arrondissement',
        cityCode: '75013',
        postalCode: '75013',
        department: 'Paris',
        departmentCode: FR_DEPARTMENT_CODES['75'],
        country: CountryCodes.FR,
        regionCode: FR_REGION_CODES['11'],
        timeZone: FR_TIMEZONES[4],
        slugs: {
          departement: 'paris',
          country: 'fr',
          department: 'paris',
          city: 'paris-13e-arrondissement',
          region: 'ile-de-france'
        }
      }
    },
    {
      description: '',
      hours: {
        closedHolidays: PlaceClosedHolidays.UNKNOWN,
        description: '',
        friday: {
          open: true,
          timeslot: [
            {
              end: 2215,
              start: 2200
            }
          ]
        },
        monday: {
          open: false,
          timeslot: []
        },
        saturday: {
          open: false,
          timeslot: []
        },
        sunday: {
          open: false,
          timeslot: []
        },
        thursday: {
          open: false,
          timeslot: []
        },
        tuesday: {
          open: true,
          timeslot: [
            {
              end: 2215,
              start: 2200
            }
          ]
        },
        wednesday: {
          open: true,
          timeslot: [
            {
              end: 2215,
              start: 2200
            }
          ]
        }
      },
      photos: [],
      position: {
        adresse: 'Pl. Louis-Armand, 75012 Paris',
        codePostal: '75012',
        complementAdresse: "Point d'arrivée de la maraude",
        departement: 'Paris',
        departementCode: '75',
        location: {
          coordinates: [2.3743773, 48.84430380000001],
          type: 'Point'
        },
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
        address: 'Pl. Louis-Armand, 75012 Paris',
        additionalInformation: "Point d'arrivée de la maraude",
        city: 'Paris',
        postalCode: '75012',
        cityCode: '75012',
        department: 'Paris',
        departmentCode: FR_DEPARTMENT_CODES['75'],
        country: CountryCodes.FR,
        regionCode: FR_REGION_CODES['11'],
        timeZone: FR_TIMEZONES[4]
      }
    }
  ],
  // eslint-disable-next-line camelcase
  services_all: [
    {
      categorie: 601,
      close: {
        actif: false,
        dateDebut: null,
        dateFin: null
      },
      description: '<p>Distribution de denrées alimentaires et de boissons chaudes</p>',
      differentHours: false,
      differentModalities: false,
      differentPublics: false,
      hours: {
        closedHolidays: PlaceClosedHolidays.UNKNOWN,
        description: null,
        friday: {
          open: true,
          timeslot: [
            {
              end: 2215,
              start: 1950
            }
          ]
        },
        monday: {
          open: false,
          timeslot: []
        },
        saturday: {
          open: false,
          timeslot: []
        },
        sunday: {
          open: false,
          timeslot: []
        },
        thursday: {
          open: false,
          timeslot: []
        },
        tuesday: {
          open: true,
          timeslot: [
            {
              end: 2215,
              start: 1950
            }
          ]
        },
        wednesday: {
          open: true,
          timeslot: [
            {
              end: 2215,
              start: 1950
            }
          ]
        }
      },
      isOpenToday: true,
      modalities: {
        inconditionnel: true,
        appointment: { checked: false, precisions: null },
        inscription: { checked: false, precisions: null },
        orientation: { checked: false, precisions: null },
        price: { checked: false, precisions: null },
        animal: {
          checked: false
        },
        pmr: {
          checked: false
        },
        other: null,
        docs: []
      },
      publics: {
        accueil: 0,
        administrative: structuredClone(ADMINISTRATIVE_DEFAULT_VALUES),

        age: {
          max: 99,
          min: 0
        },
        description: null,
        familialle: structuredClone(FAMILY_DEFAULT_VALUES),

        gender: structuredClone(GENDER_DEFAULT_VALUES),
        other: structuredClone(OTHER_DEFAULT_VALUES)
      },
      saturated: {
        precision: null,
        status: ServiceSaturation.LOW
      },
      serviceObjectId: '643e5603bb2e82804132e381',
      createdAt: new Date('2023-04-18T08:34:11.000Z'),
      category: Categories.FOOD_DISTRIBUTION,
      categorySpecificFields: {
        serviceStyleType: [ServiceStyleType.TAKE_AWAY]
      }
    },
    {
      categorie: 305,
      close: {
        actif: false,
        dateDebut: null,
        dateFin: null
      },
      description: '',
      differentHours: false,
      differentModalities: false,
      differentPublics: false,
      hours: {
        closedHolidays: PlaceClosedHolidays.UNKNOWN,
        description: null,
        friday: {
          open: true,
          timeslot: [
            {
              end: 2215,
              start: 1950
            }
          ]
        },
        monday: {
          open: false,
          timeslot: []
        },
        saturday: {
          open: false,
          timeslot: []
        },
        sunday: {
          open: false,
          timeslot: []
        },
        thursday: {
          open: false,
          timeslot: []
        },
        tuesday: {
          open: true,
          timeslot: [
            {
              end: 2215,
              start: 1950
            }
          ]
        },
        wednesday: {
          open: true,
          timeslot: [
            {
              end: 2215,
              start: 1950
            }
          ]
        }
      },
      isOpenToday: true,
      modalities: {
        inconditionnel: true,
        appointment: {
          checked: false,
          precisions: null
        },
        inscription: {
          checked: false,
          precisions: null
        },
        orientation: {
          checked: false,
          precisions: null
        },
        price: {
          checked: false,
          precisions: null
        },
        animal: {
          checked: false
        },
        pmr: {
          checked: false
        },
        other: null,
        docs: []
      },
      publics: {
        accueil: 0,
        administrative: structuredClone(ADMINISTRATIVE_DEFAULT_VALUES),

        age: {
          max: 99,
          min: 0
        },
        description: null,
        familialle: structuredClone(FAMILY_DEFAULT_VALUES),
        gender: structuredClone(GENDER_DEFAULT_VALUES),
        other: structuredClone(OTHER_DEFAULT_VALUES)
      },
      saturated: {
        precision: null,
        status: ServiceSaturation.LOW
      },
      serviceObjectId: '643e5603bb2e82804132e382',
      createdAt: new Date('2023-04-18T08:34:11.000Z'),
      category: Categories.HYGIENE_PRODUCTS
    },
    {
      categorie: 903,
      close: {
        actif: false,
        dateDebut: null,
        dateFin: null
      },
      description: '',
      differentHours: false,
      differentModalities: false,
      differentPublics: false,
      hours: {
        closedHolidays: PlaceClosedHolidays.UNKNOWN,
        description: null,
        friday: {
          open: true,
          timeslot: [
            {
              end: 2215,
              start: 1950
            }
          ]
        },
        monday: {
          open: false,
          timeslot: []
        },
        saturday: {
          open: false,
          timeslot: []
        },
        sunday: {
          open: false,
          timeslot: []
        },
        thursday: {
          open: false,
          timeslot: []
        },
        tuesday: {
          open: true,
          timeslot: [
            {
              end: 2215,
              start: 1950
            }
          ]
        },
        wednesday: {
          open: true,
          timeslot: [
            {
              end: 2215,
              start: 1950
            }
          ]
        }
      },
      isOpenToday: true,
      modalities: {
        inconditionnel: true,
        appointment: {
          checked: false,
          precisions: null
        },
        inscription: {
          checked: false,
          precisions: null
        },
        orientation: {
          checked: false,
          precisions: null
        },
        price: {
          checked: false,
          precisions: null
        },
        animal: {
          checked: false
        },
        pmr: {
          checked: false
        },
        other: null,
        docs: []
      },
      publics: {
        accueil: 0,
        administrative: structuredClone(ADMINISTRATIVE_DEFAULT_VALUES),

        age: {
          max: 99,
          min: 0
        },
        description: null,
        familialle: structuredClone(FAMILY_DEFAULT_VALUES),

        gender: structuredClone(GENDER_DEFAULT_VALUES),
        other: structuredClone(OTHER_DEFAULT_VALUES)
      },
      saturated: {
        precision: null,
        status: ServiceSaturation.LOW
      },
      serviceObjectId: '643e5603bb2e82804132e383',
      createdAt: new Date('2023-04-18T08:34:11.000Z'),
      category: Categories.CLOTHING
    }
  ],
  createdAt: '2023-04-18T08:09:55.275Z',
  updatedAt: '2024-06-17T10:00:45.084Z',
  __v: 0,
  updatedByUserAt: '2024-06-17T10:00:45.084Z',
  createdBy: 'Isaure Chambourdon',
  distance: 403.7915416747283,
  statusSort: 0,
  photos: [],
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
  },
  position: {
    adresse: '58 Bd Saint-Marcel, 75005 Paris',
    codePostal: '75005',
    complementAdresse: 'Point de départ de la maraude',
    departement: 'Paris',
    departementCode: '75',
    location: {
      coordinates: [2.3554445, 48.8381335],
      type: 'Point'
    },
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
    address: '58 Bd Saint-Marcel, 75005 Paris',
    additionalInformation: 'Point de départ de la maraude',
    city: 'Paris',
    postalCode: '75005',
    cityCode: '75005',
    department: 'Paris',
    departmentCode: FR_DEPARTMENT_CODES['75'],
    country: CountryCodes.FR,
    regionCode: FR_REGION_CODES['11'],
    timeZone: FR_TIMEZONES[4]
  }
});

const sampleItineraryCrossingPoint: CommonPlaceParcours = {
  description: 'Gare routière de Versailles',
  hours: {
    closedHolidays: 'UNKNOWN',
    description: '',
    friday: {
      open: false,
      timeslot: []
    },
    monday: {
      open: false,
      timeslot: []
    },
    saturday: {
      open: true,
      timeslot: [
        {
          end: 2230,
          start: 2000
        }
      ]
    },
    sunday: {
      open: false,
      timeslot: []
    },
    thursday: {
      open: false,
      timeslot: []
    },
    tuesday: {
      open: true,
      timeslot: [
        {
          end: 2230,
          start: 2000
        }
      ]
    },
    wednesday: {
      open: true,
      timeslot: [
        {
          end: 2230,
          start: 2000
        }
      ]
    }
  },
  photos: [],
  position: {
    adresse: '2 Rue Alexis de Tocqueville, 78000 Versailles',
    codePostal: '78000',
    complementAdresse: null,
    departement: 'Yvelines',
    departementCode: '78',
    location: {
      coordinates: [2.1322597, 48.7952117],
      type: 'Point'
    },
    pays: 'fr',
    region: 'Île-de-France',
    slugs: {
      ville: 'versailles',
      departement: 'yvelines',
      pays: 'fr',
      department: 'yvelines',
      country: 'fr',
      region: 'ile-de-france',
      city: 'versailles'
    },
    ville: 'Versailles',
    address: '2 Rue Alexis de Tocqueville, 78000 Versailles',
    additionalInformation: '',
    city: 'Versailles',
    postalCode: '78000',
    cityCode: '78000',
    department: 'Yvelines',
    departmentCode: FR_DEPARTMENT_CODES['78'],
    country: CountryCodes.FR,
    regionCode: FR_REGION_CODES['11'],
    timeZone: FR_TIMEZONES[4]
  }
};

const sampleItineraryTransformed: SearchResultPlaceCard[] = [
  {
    address: "Nationale, 75013 Paris 13e Arrondissement - Point d'arrivée de la maraude",
    banners: { orientation: false, holidays: PlaceClosedHolidays.UNKNOWN, campaign: null },
    dataForLogs: {
      id: '30965',
      lieuId: 30965,
      distance: 403.7915416747283,
      position: new CommonPlacePosition()
    },
    distance: 403.7915416747283,
    id: 30965,
    name: 'Maraude Balades des Lucioles 13e Paris',
    phones: [
      {
        countryCode: CountryCodes.FR,
        isSpecialPhoneNumber: false,
        label: null,
        phoneNumber: '07 69 06 74 44'
      }
    ],
    searchGeoType: GeoTypes.POSITION,
    seoUrl: 'maraude-balades-des-lucioles-13e-paris-30965',
    services: [Categories.FOOD_DISTRIBUTION, Categories.HYGIENE_PRODUCTS, Categories.CLOTHING],
    sources: [],
    status: PlaceOpeningStatus.OPEN,
    tempInfo: { hours: null, message: null, closure: null },
    todayInfo: { openingHours: [{ end: '2000', start: '1950' }] }
  },
  {
    address: "Pl. Louis-Armand, 75012 Paris - Point d'arrivée de la maraude",
    banners: { orientation: false, holidays: PlaceClosedHolidays.UNKNOWN, campaign: null },
    dataForLogs: {
      id: '30965',
      lieuId: 30965,
      distance: 403.7915416747283,
      position: new CommonPlacePosition()
    },
    distance: 403.7915416747283,
    id: 30965,
    name: 'Maraude Balades des Lucioles 13e Paris',
    phones: [
      {
        countryCode: CountryCodes.FR,
        isSpecialPhoneNumber: false,
        label: null,
        phoneNumber: '07 69 06 74 44'
      }
    ],
    searchGeoType: GeoTypes.POSITION,
    seoUrl: 'maraude-balades-des-lucioles-13e-paris-30965',
    services: [Categories.FOOD_DISTRIBUTION, Categories.HYGIENE_PRODUCTS, Categories.CLOTHING],
    sources: [],
    status: PlaceOpeningStatus.OPEN,
    tempInfo: { hours: null, message: null, closure: null },
    todayInfo: { openingHours: [{ end: '2215', start: '2200' }] }
  }
];

export {
  sampleItinerary,
  sampleItineraryCrossingPoint,
  sampleItineraryTransformed,
  samplePlace,
  samplePlaceTransformed
};
