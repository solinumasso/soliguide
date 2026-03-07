import type { PosthogCaptureFunction } from '$lib/services/types';

export interface HomePageController {
  captureEvent: PosthogCaptureFunction;
}
