import { beforeEach, describe, it, expect, vitest } from 'vitest';
import { getCategoryBrowserController } from './CategoryBrowserController';
import { posthogService } from '$lib/services/posthogService';
import { Categories } from '@soliguide/common';
import type { CategoryBrowserController } from './types';

describe('Category browser widget', () => {
  // skipcq: JS-0119
  let pageState: CategoryBrowserController;

  beforeEach(() => {
    pageState = getCategoryBrowserController();
  });

  describe('Posthog capture events', () => {
    it('should call the posthogService with good prefix when capturing event', () => {
      vitest.spyOn(posthogService, 'capture');

      pageState.captureEvent('test', {
        category: Categories.ACCESS_TO_HOUSING
      });

      expect(posthogService.capture).toHaveBeenCalledWith('search-page-test', {
        category: Categories.ACCESS_TO_HOUSING
      });
    });
  });
});
