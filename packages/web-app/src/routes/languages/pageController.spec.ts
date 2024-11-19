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
import { describe, it, expect, beforeEach, vitest, vi } from 'vitest';
import { get } from 'svelte/store';
import { SUPPORTED_LANGUAGES, SupportedLanguagesCode } from '@soliguide/common';
import { posthogService } from '$lib/services/posthogService';
import { getController } from './pageController';

vi.mock('posthog-js');

describe('Choose language page', () => {
  let state = getController();

  beforeEach(() => {
    state = getController();
    state.init(SUPPORTED_LANGUAGES, SupportedLanguagesCode.FR);
  });

  it('if no lang is selected, I cannot submit', () => {
    expect(get(state).canSubmit).toBe(false);
  });

  it('if a lang is selected, the button is active and I can submit', () => {
    state.changeSelection(SupportedLanguagesCode.CA);
    expect(get(state).canSubmit).toBe(true);
  });

  it('if a lang is selected then selected again, I cannot submit', () => {
    state.changeSelection(SupportedLanguagesCode.CA);
    state.changeSelection(SupportedLanguagesCode.CA);
    expect(get(state).canSubmit).toBe(false);
  });

  it('if a lang is selected and another is selected, I can submit', () => {
    state.changeSelection(SupportedLanguagesCode.CA);
    state.changeSelection(SupportedLanguagesCode.ES);
    expect(get(state).canSubmit).toBe(true);
  });

  it("the first option is the theme's default language", () => {
    state.init(SUPPORTED_LANGUAGES, SupportedLanguagesCode.CA);
    expect(get(state).availableLanguages[0].code).toEqual(SupportedLanguagesCode.CA);

    // Another lang
    state.init(SUPPORTED_LANGUAGES, SupportedLanguagesCode.AR);
    expect(get(state).availableLanguages[0].code).toEqual(SupportedLanguagesCode.AR);
  });

  it("the order of options is the same as theme's supported languages, with the theme's default language in first position", () => {
    const supportedLangs1 = [
      SupportedLanguagesCode.EN,
      SupportedLanguagesCode.RU,
      SupportedLanguagesCode.CA,
      SupportedLanguagesCode.PS
    ];
    state.init(supportedLangs1, SupportedLanguagesCode.CA);
    expect(get(state).availableLanguages.map((obj) => obj.code)).toEqual([
      SupportedLanguagesCode.CA,
      SupportedLanguagesCode.EN,
      SupportedLanguagesCode.RU,
      SupportedLanguagesCode.PS
    ]);

    // Another
    const supportedLanguages2 = [
      SupportedLanguagesCode.ES,
      SupportedLanguagesCode.EN,
      SupportedLanguagesCode.AR,
      SupportedLanguagesCode.UK
    ];
    state.init(supportedLanguages2, SupportedLanguagesCode.UK);
    expect(get(state).availableLanguages.map((obj) => obj.code)).toEqual([
      SupportedLanguagesCode.UK,
      SupportedLanguagesCode.ES,
      SupportedLanguagesCode.EN,
      SupportedLanguagesCode.AR
    ]);
  });

  it('should call the posthogService with good prefix when capturing event', () => {
    vitest.spyOn(posthogService, 'capture');

    state.captureEvent('test', { newLanguage: SupportedLanguagesCode.EN });

    expect(posthogService.capture).toHaveBeenCalledWith('languages-test', {
      newLanguage: SupportedLanguagesCode.EN
    });
  });
});
