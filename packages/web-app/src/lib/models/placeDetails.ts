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
  CommonNewPlaceService,
  CommonOpeningHours,
  CountryCodes,
  FAMILY_DEFAULT_VALUES,
  GENDER_DEFAULT_VALUES,
  Modalities,
  OTHER_DEFAULT_VALUES,
  PUBLICS_LABELS,
  Publics,
  PublicsAdministrative,
  PublicsFamily,
  PublicsGender,
  PublicsOther,
  ServiceSaturation,
  WEEK_DAYS,
  WelcomedPublics,
  computePlaceOpeningStatus,
  computeTempIsActive,
  type ApiPlace,
  type CheckAndPrecisions,
  type Checked,
  type DayName,
  type Phone as CommonPhone,
  type PlaceTempInfo,
  Categories
} from '@soliguide/common';
import { computeTodayInfo, computeAddress, formatTimeslots, buildSources } from './place';
import {
  type PlaceDetails,
  type PlaceDetailsInfo,
  PlaceDetailsInfoType,
  type PlaceDetailsOpeningHours,
  type Saturation,
  type Service,
  type TranslatableElement
} from './types';
import { categoryService } from '$lib/services/categoryService';
import { sortServicesByRelevance } from '$lib/utils';

/**
 * Transform all opening hours to a front ready opening hours
 */
const buildHours = (hours: CommonOpeningHours, allDays: boolean): PlaceDetailsOpeningHours => {
  return WEEK_DAYS.reduce((acc: PlaceDetailsOpeningHours, day: DayName) => {
    const hoursToFormat = hours?.[day]?.timeslot ?? [];
    const openingHours = formatTimeslots(hoursToFormat);

    if (!openingHours?.length) {
      return allDays ? { ...acc, [day]: [] } : acc;
    }

    return { ...acc, [day]: openingHours };
  }, {});
};

/**
 * Transform all opening hours to a front ready opening hours
 */
const buildPlaceDetailsHours = (
  hours: CommonOpeningHours,
  tempInfo: PlaceTempInfo
): PlaceDetailsOpeningHours => {
  const tempHours = tempInfo.hours;

  const isTempHoursActive = computeTempIsActive(tempHours);

  if (isTempHoursActive) {
    return buildHours(tempHours.hours, true);
  }

  return buildHours(hours, true);
};

/**
 * Transform age data to front ready info
 */
const buildPublicsAge = (min: number, max: number): TranslatableElement[] => {
  if (min === 0 && max === 99) {
    return [];
  } else if (min === 0 && max === 18) {
    return [{ key: 'PUBLICS_AGE_MINORS' }];
  } else if (min === 18 && max === 99) {
    return [{ key: 'PUBLICS_AGE_MAJORS' }];
  } else if (min === 0) {
    return [{ key: 'PUBLICS_AGE_TO_XX_MAX', params: { max: max.toString() } }];
  } else if (max === 99) {
    return [{ key: 'PUBLICS_AGE_FROM_XX', params: { min: min.toString() } }];
  }

  return [{ key: 'PUBLICS_AGE_RANGE', params: { min: min.toString(), max: max.toString() } }];
};

/**
 * Transform specific publics to front ready info
 */
const buildSpecificPublics = <
  T extends PublicsGender | PublicsAdministrative | PublicsFamily | PublicsOther
>(
  publics: T[],
  publicsFull: T[],
  publicToDisplay: Record<T, string>
): TranslatableElement[] => {
  if (publics.length === publicsFull.length) {
    return [];
  }

  return publics.map((singlePublic) => {
    return { key: publicToDisplay[singlePublic].toUpperCase() };
  });
};

/**
 * Transform publics to front ready info
 */
const buildPublics = (publics: Publics): PlaceDetailsInfo[] => {
  const WELCOME_TO_TITLE_MAPPING: Record<WelcomedPublics, PlaceDetailsInfoType> = {
    [WelcomedPublics.UNCONDITIONAL]: PlaceDetailsInfoType.WELCOME_UNCONDITIONAL,
    [WelcomedPublics.PREFERENTIAL]: PlaceDetailsInfoType.WELCOME_UNCONDITIONAL_CUSTOM,
    [WelcomedPublics.EXCLUSIVE]: PlaceDetailsInfoType.WELCOME_EXCLUSIVE
  };

  const description =
    publics.accueil === WelcomedPublics.UNCONDITIONAL
      ? []
      : [
          ...buildSpecificPublics(publics.gender, GENDER_DEFAULT_VALUES, PUBLICS_LABELS.gender),
          ...buildPublicsAge(publics.age.min, publics.age.max),
          ...buildSpecificPublics(
            publics.administrative,
            ADMINISTRATIVE_DEFAULT_VALUES,
            PUBLICS_LABELS.administrative
          ),
          ...buildSpecificPublics(
            publics.familialle,
            FAMILY_DEFAULT_VALUES,
            PUBLICS_LABELS.familialle
          ),
          ...buildSpecificPublics(publics.other, OTHER_DEFAULT_VALUES, PUBLICS_LABELS.other)
        ];

  return [
    { type: WELCOME_TO_TITLE_MAPPING[publics.accueil], tags: [], description },
    ...(publics.description
      ? [
          {
            type: PlaceDetailsInfoType.PUBLICS_MORE_INFO,
            tags: [],
            description: [{ key: publics.description }]
          }
        ]
      : [])
  ];
};

/**
 * Transform modalities types without precisions to front ready info
 */
const buildSpecificModalitiesType = (
  modalityType: Checked,
  type: PlaceDetailsInfoType
): PlaceDetailsInfo[] => {
  if (modalityType?.checked) {
    return [
      {
        type,
        tags: [],
        description: []
      }
    ];
  }

  return [];
};

/**
 * Transform modalities types with precisions to front ready info
 */
const buildSpecificModalitiesTypeWithPrecisions = (
  modalityType: CheckAndPrecisions,
  type: PlaceDetailsInfoType
): PlaceDetailsInfo[] => {
  if (modalityType.checked) {
    return [
      {
        type,
        tags: [],
        description: modalityType.precisions ? [{ key: modalityType.precisions }] : []
      }
    ];
  }

  return [];
};

/**
 * Transform modalities to front ready info
 */
const buildModalities = (modalities: Modalities): PlaceDetailsInfo[] => {
  const modalitiesType: PlaceDetailsInfo[] = modalities.inconditionnel
    ? [{ type: PlaceDetailsInfoType.ACCESS_FREE, tags: [], description: [] }]
    : [
        ...buildSpecificModalitiesTypeWithPrecisions(
          modalities.orientation,
          PlaceDetailsInfoType.ACCESS_ORIENTATION
        ),
        ...buildSpecificModalitiesTypeWithPrecisions(
          modalities.appointment,
          PlaceDetailsInfoType.APPOINTMENT
        ),
        ...buildSpecificModalitiesTypeWithPrecisions(
          modalities.inscription,
          PlaceDetailsInfoType.REGISTRATION
        )
      ];

  const modalitiesMoreInfo = modalities.other
    ? [
        {
          type: PlaceDetailsInfoType.MODALITIES_MORE_INFO,
          tags: [],
          description: [{ key: modalities.other }]
        }
      ]
    : [];

  return [
    ...modalitiesType,
    ...modalitiesMoreInfo,
    ...buildSpecificModalitiesTypeWithPrecisions(modalities.price, PlaceDetailsInfoType.PRICE),
    ...buildSpecificModalitiesType(modalities.pmr, PlaceDetailsInfoType.PMR),
    ...buildSpecificModalitiesType(modalities.animal, PlaceDetailsInfoType.ANIMALS)
  ];
};

/**
 * Transform languages spoken to front ready info
 */
const buildSpokenLanguages = (language: string[]): PlaceDetailsInfo[] => {
  return language?.length
    ? [
        {
          type: PlaceDetailsInfoType.LANGUAGES_SPOKEN,
          tags: [],
          description: language.map((lang) => {
            return { key: `LANGUE_${lang.toUpperCase()}` };
          })
        }
      ]
    : [];
};

/**
 * Transform publics, modalities, spoken languages and specific services to front ready info
 */
const buildPlaceDetailsInfo = (place: ApiPlace): PlaceDetailsInfo[] => {
  return [
    ...buildPublics(place.publics),
    ...buildModalities(place.modalities),
    ...buildSpokenLanguages(place.languages)
  ];
};

/**
 * Transform services hours to front ready info
 */
const buildServiceHours = (
  service: CommonNewPlaceService
): { hours?: PlaceDetailsOpeningHours } => {
  if (service.differentHours) {
    return { hours: buildHours(service.hours, false) };
  }

  return {};
};

/**
 * Transform services info to front ready info
 */
const buildServiceInfo = (service: CommonNewPlaceService): PlaceDetailsInfo[] => {
  return [
    ...(service.differentPublics ? buildPublics(service.publics) : []),
    ...(service.differentModalities ? buildModalities(service.modalities) : [])
  ];
};

/**
 * Transform services saturation to front ready info
 */
const buildServiceSaturation = (service: CommonNewPlaceService): { saturation?: Saturation } => {
  if (service.saturated.status === ServiceSaturation.HIGH) {
    return {
      saturation: { tag: { value: `SATURATION_${ServiceSaturation.HIGH}`, variant: 'error' } }
    };
  } else if (service.saturated.status === ServiceSaturation.MODERATE) {
    return {
      saturation: { tag: { value: `SATURATION_${ServiceSaturation.MODERATE}`, variant: 'warning' } }
    };
  }

  return {};
};

/**
 * Transform services to front ready info
 */
const buildServices = (
  services: CommonNewPlaceService[],
  categorySearched: Categories
): Service[] => {
  const servicesToProcess = categorySearched
    ? sortServicesByRelevance(services, categorySearched, categoryService.getAllCategories())
    : services;

  return servicesToProcess.map((service) => ({
    category: service.category as Categories,
    description: service.description ?? '',
    ...buildServiceHours(service),
    info: buildServiceInfo(service),
    ...buildServiceSaturation(service)
  }));
};

/**
 * Transform a place sent by the API to a front ready place
 */
const buildPlaceDetails = (placeResult: ApiPlace, categorySearched: Categories): PlaceDetails => {
  const status = computePlaceOpeningStatus(placeResult);

  const onOrientation = Boolean(placeResult.modalities.orientation.checked);

  return {
    id: placeResult.lieu_id,
    address: computeAddress(placeResult.position, onOrientation),
    description: placeResult.description ?? '',
    email: placeResult.entity.mail ?? '',
    facebook: placeResult.entity.facebook ?? '',
    fax: placeResult.entity.fax ?? '',
    hours: buildPlaceDetailsHours(placeResult.newhours, placeResult.tempInfos),
    info: buildPlaceDetailsInfo(placeResult),
    instagram: placeResult.entity.instagram ?? '',
    lastUpdate: new Date(placeResult.updatedByUserAt).toISOString(),
    name: placeResult.name,
    onOrientation,
    phones: placeResult.entity.phones.map((phone: CommonPhone) => ({
      ...phone,
      countryCode: phone.countryCode as CountryCodes
    })),
    services: buildServices(placeResult.services_all, categorySearched),
    sources: buildSources(placeResult.sources),
    status: computePlaceOpeningStatus(placeResult),
    todayInfo: computeTodayInfo(placeResult, status),
    website: placeResult.entity.website ?? ''
  };
};

export { buildPlaceDetails };
