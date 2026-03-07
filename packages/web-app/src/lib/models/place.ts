import {
  type ApiPlace,
  BasePlaceTempInfo,
  CommonPlacePosition,
  CommonPlaceSource,
  CommonTimeslot,
  type DayName,
  EXTERNAL_SOURCE_MAPPING,
  type ExternalSourceToDisplay,
  PlaceOpeningStatus,
  checkIfSourceMustBeDisplayed,
  computeTempIsActive,
  getSourceUrl,
  isFromExternalSource
} from '@soliguide/common';
import {
  PlaceCampaignBannerMessage,
  type HoursRange,
  type SearchResultTempInfo,
  type Source,
  type TodayInfo
} from './types';
import { displayCampaignInfo } from '$lib/utils';

/**
 * Calculates the complete address to display
 */
export const computeAddress = (position: CommonPlacePosition, onOrientation: boolean): string => {
  if (onOrientation) {
    return `${position.postalCode}, ${position.city}`;
  } else if (position.additionalInformation) {
    return `${position.address} - ${position.additionalInformation}`;
  }
  return position.address;
};

/**
 * Converts timeslots to formatted hours ranges
 */
export const formatTimeslots = (timeslots: CommonTimeslot[] = []): HoursRange[] =>
  timeslots.map(({ start, end }) => ({
    start: String(start).padStart(4, '0'),
    end: String(end).padStart(4, '0')
  }));

/**
 * Calculates opening hours and closing days: date interval, hour interval or nothing
 */
export const computeTodayInfo = (
  place: ApiPlace,
  status: PlaceOpeningStatus,
  dayToCheck = new Date().toLocaleString('en-us', { weekday: 'long' }).toLowerCase() as DayName
): TodayInfo => {
  if (status === PlaceOpeningStatus.CLOSED || status === PlaceOpeningStatus.UNKNOWN) {
    return {};
  }

  // [TODO] handle partiallyOpen case
  if (status === PlaceOpeningStatus.OPEN || status === PlaceOpeningStatus.PARTIALLY_OPEN) {
    const isTempHoursActive = computeTempIsActive(place.tempInfos.hours);

    if (isTempHoursActive) {
      return {
        openingHours: formatTimeslots(place.tempInfos.hours?.hours?.[dayToCheck]?.timeslot ?? [])
      };
    }

    return {
      openingHours: formatTimeslots(place.newhours?.[dayToCheck]?.timeslot ?? [])
    };
  }

  // closingDays can have just a start date without an end date
  if (place.tempInfos.closure.actif) {
    const start = new Date(place.tempInfos.closure.dateDebut).toISOString();

    return {
      closingDays: place.tempInfos.closure.dateFin
        ? {
            start,
            end: new Date(place.tempInfos.closure.dateFin).toISOString()
          }
        : {
            start
          }
    };
  }
  return {};
};

/**
 * Transform external sources to front ready sources
 */
export const buildSources = (sources?: CommonPlaceSource[]): Source[] =>
  sources
    ? sources.reduce((acc: Source[], source) => {
        const toDisplay = checkIfSourceMustBeDisplayed(source.name, source.isOrigin);

        if (toDisplay) {
          return [
            ...acc,
            {
              label: EXTERNAL_SOURCE_MAPPING[source.name as ExternalSourceToDisplay].label ?? '',
              licenseLabel:
                EXTERNAL_SOURCE_MAPPING[source.name as ExternalSourceToDisplay].licenseLabel ?? '',
              licenseLink:
                EXTERNAL_SOURCE_MAPPING[source.name as ExternalSourceToDisplay].licenseLink ?? '',
              url: getSourceUrl(source)
            }
          ];
        }
        return acc;
      }, [])
    : [];

//! TODO Type tempInfos here after rewriting the types
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const computeTempInfo = (tempInfo: any): SearchResultTempInfo => {
  return (['hours', 'closure', 'message'] as const).reduce((acc, key) => {
    return {
      ...acc,
      [key]: new BasePlaceTempInfo(tempInfo[key]).status
    };
  }, {} as SearchResultTempInfo);
};

/**
 * Computes the campaign banner message based on the place result and its source.
 * Returns a specific message if the place is from an external source, a general campaign banner message or null if banner should not be displayed.
 */
export const computeCampaignBanner = (placeResult: ApiPlace): PlaceCampaignBannerMessage | null => {
  const isExternal = isFromExternalSource(placeResult);
  const mustBeShown = displayCampaignInfo(placeResult, isExternal);

  if (!mustBeShown) {
    return null;
  }

  return isExternal
    ? PlaceCampaignBannerMessage.EXTERNAL_SOURCE_CAMPAIGN_BANNER
    : PlaceCampaignBannerMessage.WEBAPP_CAMPAIGN_BANNER_MESSAGE;
};
