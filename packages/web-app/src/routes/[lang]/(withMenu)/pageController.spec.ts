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
import { beforeEach, describe, it, expect, vitest, vi } from 'vitest';
import { getHomePageController } from './pageController';
import { posthogService } from '$lib/services/posthogService';
import type { HomePageController } from './types';

vi.mock('posthog-js');

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
