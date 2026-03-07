import { beforeEach, describe, it, expect, vitest } from 'vitest';
import { getHomePageController } from './pageController';
import { posthogService } from '$lib/services/posthogService';
import type { HomePageController } from './types';

describe('Home page controller', () => {
  // skipcq: JS-0119
  let pageState: HomePageController;

  beforeEach(() => {
    pageState = getHomePageController();
  });

  describe('Posthog capture events', () => {
    it('should call the posthogService with good prefix when capturing event', () => {
      vitest.spyOn(posthogService, 'capture');

      pageState.captureEvent('test', {});

      expect(posthogService.capture).toHaveBeenCalledWith('homepage-test', {});
    });
  });
});
