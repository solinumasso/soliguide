import type { Writable } from 'svelte/store';
import type { DisplayMode, PlaceDetails, PlaceDetailsOpeningHours } from '$lib/models/types';
import type { DayName, TempInfoType } from '@soliguide/common';

import Group from 'svelte-google-materialdesign-icons/Group.svelte';
import Event from 'svelte-google-materialdesign-icons/Date_range.svelte';
import Accessible from 'svelte-google-materialdesign-icons/Accessible.svelte';
import Pets from 'svelte-google-materialdesign-icons/Pets.svelte';
import Euro from 'svelte-google-materialdesign-icons/Euro.svelte';
import Star from 'svelte-google-materialdesign-icons/Star.svelte';
import type { PosthogCaptureFunction } from '$lib/services/types';

export interface PageState {
  placeDetails: PlaceDetails;
  hoursToDisplay: PlaceDetailsOpeningHours;
  hoursDisplayMode: DisplayMode;
  closureDisplayMode: DisplayMode;
  currentDay: DayName;
  error: string | null;
}

export interface PageController {
  subscribe: Writable<PageState>['subscribe'];
  init(s: PlaceDetails): void;
  captureEvent: PosthogCaptureFunction;
  showRegularHours(tempInfoType: TempInfoType): void;
  showTempInfoHours(): void;
  toggleHours(tempInfoType: TempInfoType): void;
}

export interface TitleAndIcon {
  icon: typeof Accessible | typeof Euro | typeof Group | typeof Pets | typeof Star | typeof Event;
  title: string;
}
