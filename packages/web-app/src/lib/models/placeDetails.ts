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
import { categoryService } from '$lib/services/categoryService';
import { sortServicesByRelevance } from '$lib/utils';
import {
  BasePlaceTempInfo,
  Categories,
  CommonNewPlaceService,
  CommonOpeningHours,
  CountryCodes,
  Modalities,
  PlaceOpeningStatus,
  PlaceTempInfo,
  PlaceType,
  Publics,
  ServiceSaturation,
  SupportedLanguagesCode,
  TempInfoStatus,
  WEEK_DAYS,
  WelcomedPublics,
  computePlaceOpeningStatus,
  translatePublics,
  type ApiPlace,
  type CheckAndPrecisions,
  type Checked,
  type Phone as CommonPhone,
  type DayName,
  type IPlaceTempInfo
} from '@soliguide/common';
import { getCurrentLangInStorage } from '../client';
import { i18nInstance } from '../client/i18n';
import {
  buildSources,
  computeAddress,
  computeCampaignBanner,
  computeTodayInfo,
  formatTimeslots
} from './place';
import {
  PlaceDetailsInfoType,
  type LightPlace,
  type PlaceDetails,
  type PlaceDetailsInfo,
  type PlaceDetailsOpeningHours,
  type PlaceDetailsTempInfo,
  type Saturation,
  type Service
} from './types';

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
 * Transform publics to front ready info
 */
const buildPublics = (publics: Publics): PlaceDetailsInfo[] => {
  const WELCOME_TO_TITLE_MAPPING: Record<WelcomedPublics, PlaceDetailsInfoType> = {
    [WelcomedPublics.UNCONDITIONAL]: PlaceDetailsInfoType.WELCOME_UNCONDITIONAL,
    [WelcomedPublics.PREFERENTIAL]: PlaceDetailsInfoType.WELCOME_UNCONDITIONAL_CUSTOM,
    [WelcomedPublics.EXCLUSIVE]: PlaceDetailsInfoType.WELCOME_EXCLUSIVE
  };
  const currentLang = getCurrentLangInStorage();

  const description = translatePublics(
    i18nInstance,
    currentLang as unknown as SupportedLanguagesCode,
    publics,
    true,
    false
  );

  return [
    {
      type: WELCOME_TO_TITLE_MAPPING[publics.accueil],
      tags: [],
      description: [],
      translatedText: description,
      needTranslation: false
    },
    ...(publics.description
      ? [
          {
            type: PlaceDetailsInfoType.PUBLICS_MORE_INFO,
            tags: [],
            description: [{ key: publics.description }],
            needTranslation: false
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
        description: [],
        needTranslation: true
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
        description: modalityType.precisions ? [{ key: modalityType.precisions }] : [],
        needTranslation: true
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
    ? [{ type: PlaceDetailsInfoType.ACCESS_FREE, tags: [], description: [], needTranslation: true }]
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
          description: [{ key: modalities.other }],
          needTranslation: true
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
          }),
          needTranslation: true
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
 * Transform services close to front ready info
 */
const buildServiceTempClosure = (
  service: CommonNewPlaceService
): Pick<Service, 'tempClosure'> | null => {
  if (!service.close.actif || !service.close.dateDebut) return null;

  const serviceClosure = new BasePlaceTempInfo({
    dateDebut: new Date(service.close.dateDebut),
    dateFin: service.close?.dateFin ? new Date(service.close.dateFin) : null
  });

  if (
    serviceClosure.status !== TempInfoStatus.CURRENT &&
    serviceClosure.status !== TempInfoStatus.INCOMING
  )
    return null;

  return {
    tempClosure: { ...serviceClosure, hours: null }
  };
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
    ...buildServiceSaturation(service),
    ...buildServiceTempClosure(service)
  }));
};

/**
 * Compute each passage point of a parcour for being displayed in cards
 */
const buildLightPlaces = (
  apiPlace: ApiPlace,
  onOrientation: boolean,
  categorySearched: Categories,
  status: PlaceOpeningStatus
): LightPlace[] => {
  return apiPlace.parcours?.map((crossingPoint, index) => ({
    address: computeAddress(crossingPoint.position, onOrientation),
    url: `${apiPlace.seo_url}?categorySearched=${categorySearched}&crossingPointIndex=${index}`,
    name: apiPlace.name,
    status,
    todayInfo: computeTodayInfo({ ...apiPlace, newhours: crossingPoint.hours }, status)
  }));
};

const buildPlaceDetailsTempInfo = (tempInfo: IPlaceTempInfo): PlaceDetailsTempInfo => {
  const newPlaceTempInfo = new PlaceTempInfo(tempInfo);

  const closureActive =
    newPlaceTempInfo.closure.status === TempInfoStatus.CURRENT ||
    newPlaceTempInfo.closure.status === TempInfoStatus.INCOMING;
  const messageActive = newPlaceTempInfo.message.status === TempInfoStatus.CURRENT;
  const hoursActive =
    newPlaceTempInfo.hours.status === TempInfoStatus.CURRENT ||
    newPlaceTempInfo.hours.status === TempInfoStatus.INCOMING;

  return {
    closure: closureActive ? { ...newPlaceTempInfo.closure, hours: null } : null,
    message: messageActive ? { ...newPlaceTempInfo.message, hours: null } : null,
    hours: hoursActive
      ? {
          ...newPlaceTempInfo.hours,
          hours: tempInfo.hours.hours ? buildHours(tempInfo.hours.hours, true) : null
        }
      : null
  };
};

/**
 * Transform a place sent by the API to a front ready place
 */
const buildPlaceDetails = (
  placeResult: ApiPlace,
  categorySearched: Categories,
  parcourIndex?: number
): PlaceDetails => {
  const status = computePlaceOpeningStatus(placeResult);

  const onOrientation = Boolean(placeResult.modalities.orientation.checked);

  const isItinerary = placeResult.placeType === PlaceType.ITINERARY;

  const validItineraryIndex =
    isItinerary && typeof parcourIndex === 'number' && placeResult.parcours?.[parcourIndex]
      ? parcourIndex
      : 0;

  // Use place or passage point position based on the context
  const positionToCompute = isItinerary
    ? placeResult.parcours[validItineraryIndex].position
    : placeResult.position;

  // Use place or passage point hours based on the context
  const hoursToBuild = isItinerary
    ? placeResult.parcours[validItineraryIndex]?.hours
    : placeResult.newhours;

  return {
    id: placeResult.lieu_id,
    address: computeAddress(positionToCompute, onOrientation),
    campaignBanner: computeCampaignBanner({ ...placeResult }),
    ...(isItinerary && { crossingPointIndex: validItineraryIndex }),
    description: placeResult.description ?? '',
    email: placeResult.entity.mail ?? '',
    facebook: placeResult.entity.facebook ?? '',
    fax: placeResult.entity.fax ?? '',
    hours: buildHours(hoursToBuild, true),
    info: buildPlaceDetailsInfo({ ...placeResult }),
    instagram: placeResult.entity.instagram ?? '',
    lastUpdate: new Date(placeResult.updatedByUserAt).toISOString(),
    linkedPlaces: isItinerary
      ? buildLightPlaces(placeResult, onOrientation, categorySearched, status).toSpliced(
          validItineraryIndex,
          1
        )
      : [],
    name: placeResult.name,
    onOrientation,
    phones: placeResult.entity.phones.map((phone: CommonPhone) => ({
      ...phone,
      countryCode: phone.countryCode as CountryCodes
    })),
    placeType: placeResult.placeType,
    services: buildServices(placeResult.services_all, categorySearched),
    sources: buildSources(placeResult.sources),
    status,
    todayInfo: computeTodayInfo({ ...placeResult, newhours: hoursToBuild }, status),
    tempInfo: buildPlaceDetailsTempInfo(placeResult.tempInfos),
    website: placeResult.entity.website ?? ''
  };
};

export { buildPlaceDetails };
