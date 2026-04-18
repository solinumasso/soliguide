import { writable, get } from 'svelte/store';

import {
  PlaceOpeningStatus,
  PlaceType,
  TempInfoStatus,
  TempInfoType,
  WEEK_DAYS,
  type DayName
} from '@soliguide/common';
import {
  DisplayMode,
  type PlaceDetails,
  type PlaceDetailsOpeningHours,
  type PlaceDetailsTempInfo
} from '$lib/models/types';
import { posthogService } from '$lib/services/posthogService';
import type { PageController, PageState } from './types';
import type { PosthogCaptureFunction } from '$lib/services/types';

const getCurrentDay = (): DayName => {
  return new Date().toLocaleString('en-us', { weekday: 'long' }).toLowerCase() as DayName;
};

const getCurrentDayIndex = (): number => {
  return (new Date().getDay() + 6) % 7;
};

const reorderedDays = (hours: PlaceDetailsOpeningHours): PlaceDetailsOpeningHours => {
  const currentDayIndex = getCurrentDayIndex();
  const orderedDays = [...WEEK_DAYS.slice(currentDayIndex), ...WEEK_DAYS.slice(0, currentDayIndex)];

  return orderedDays.reduce(
    (acc, day) => ({
      ...acc,
      [day]: hours[day] || []
    }),
    {}
  );
};

const initialValue: PageState = {
  placeDetails: {
    // lieu_id 7 does not exist in the database
    address: '',
    campaignBanner: null,
    coordinates: [0, 0] as [number, number],
    description: '',
    email: '',
    facebook: '',
    fax: '',
    hours: {},
    id: 7,
    info: [],
    instagram: '',
    lastUpdate: '',
    linkedPlaces: [],
    name: '',
    onOrientation: false,
    phones: [],
    placeType: PlaceType.PLACE,
    services: [],
    sources: [],
    status: PlaceOpeningStatus.OPEN,
    todayInfo: {},
    website: '',
    tempInfo: {} as PlaceDetailsTempInfo
  },
  hoursToDisplay: {},
  hoursDisplayMode: DisplayMode.REGULAR,
  closureDisplayMode: DisplayMode.REGULAR,
  error: null,
  currentDay: getCurrentDay()
};

const captureEvent: PosthogCaptureFunction = (eventName, properties) => {
  posthogService.capture(`place-page-${eventName}`, properties);
};

export const getPlaceDetailsPageController = (): PageController => {
  const pageStore = writable(initialValue);

  const init = (placeData: PlaceDetails): void => {
    const { hours, tempInfo } = placeData;

    const hoursDisplayMode =
      tempInfo.hours?.status === TempInfoStatus.CURRENT
        ? DisplayMode.TEMPORARY
        : DisplayMode.REGULAR;

    const closureDisplayMode =
      tempInfo.closure?.status === TempInfoStatus.CURRENT
        ? DisplayMode.TEMPORARY
        : DisplayMode.REGULAR;

    const hoursToDisplay =
      hoursDisplayMode === DisplayMode.TEMPORARY && tempInfo.hours?.hours
        ? reorderedDays(tempInfo.hours.hours)
        : reorderedDays(hours);

    pageStore.set({
      ...initialValue,
      placeDetails: { ...placeData, hours: reorderedDays(hours) },
      hoursToDisplay,
      hoursDisplayMode,
      closureDisplayMode,
      currentDay: getCurrentDay()
    });
  };

  const showRegularHours = (displayType: string) => {
    pageStore.update((oldState) => ({
      ...oldState,
      hoursToDisplay: reorderedDays(oldState.placeDetails.hours),
      [`${displayType}DisplayMode`]: DisplayMode.REGULAR
    }));
  };

  const showTempInfoHours = () => {
    pageStore.update((oldState) => ({
      ...oldState,
      hoursToDisplay: reorderedDays(
        oldState.placeDetails.tempInfo.hours?.hours ?? oldState.placeDetails.hours
      ),
      hoursDisplayMode: DisplayMode.TEMPORARY
    }));
  };

  const showTempInfoClosures = () => {
    pageStore.update((oldState) => ({
      ...oldState,
      closureDisplayMode: DisplayMode.TEMPORARY
    }));
  };

  const toggleHours = (tempInfoType: TempInfoType) => {
    const currentState = get(pageStore);

    if (
      (tempInfoType === TempInfoType.HOURS &&
        currentState.hoursDisplayMode === DisplayMode.TEMPORARY) ||
      (tempInfoType === TempInfoType.CLOSURE &&
        currentState.closureDisplayMode === DisplayMode.TEMPORARY)
    ) {
      showRegularHours(tempInfoType);
    } else if (tempInfoType === TempInfoType.HOURS) {
      showTempInfoHours();
    } else {
      showTempInfoClosures();
    }
  };

  return {
    subscribe: pageStore.subscribe,
    init,
    captureEvent,
    toggleHours,
    showRegularHours,
    showTempInfoHours
  };
};
