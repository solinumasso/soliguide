import { posthogService } from '$lib/services/posthogService';
import type { PosthogCaptureFunction } from '$lib/services/types';
import type { CategoryBrowserController } from './types';

/**
 * Returns an instance of the service
 */
export const getCategoryBrowserController = (): CategoryBrowserController => {
  /**
   * Capture an event with a prefix for route context
   */
  const captureEvent: PosthogCaptureFunction = (eventName, properties) => {
    posthogService.capture(`search-page-${eventName}`, properties);
  };

  return {
    captureEvent
  };
};
