import { posthogService } from '$lib/services/posthogService';
import type { PosthogCaptureFunction } from '$lib/services/types';
import type { HomePageController } from './types';

/**
 * Returns an instance of the service
 */
export const getHomePageController = (): HomePageController => {
  /**
   * Capture an event with a prefix for route context
   */
  const captureEvent: PosthogCaptureFunction = (eventName, properties) => {
    posthogService.capture(`homepage-${eventName}`, properties);
  };

  return {
    captureEvent
  };
};
