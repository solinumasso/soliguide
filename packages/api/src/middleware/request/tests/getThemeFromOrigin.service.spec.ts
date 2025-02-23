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
import { CONFIG } from "../../../_models/config/constants/CONFIG.const";
import { Themes } from "@soliguide/common";
import { getThemeFromOrigin } from "../services/getThemeFromOrigin.service";

describe("getThemeFromOrigin", () => {
  it.each([
    [CONFIG.SOLIGUIA_AD_URL, Themes.SOLIGUIA_AD],
    [CONFIG.SOLIGUIA_ES_URL, Themes.SOLIGUIA_ES],
    [CONFIG.SOLIGUIDE_FR_URL, Themes.SOLIGUIDE_FR],
  ])("should set correct theme for frontend url %s", (url, expectedTheme) => {
    expect(getThemeFromOrigin(url)).toEqual(expectedTheme);
  });

  it.each([
    [CONFIG.WEBAPP_AD_URL, Themes.SOLIGUIA_AD],
    [CONFIG.WEBAPP_ES_URL, Themes.SOLIGUIA_ES],
    [CONFIG.WEBAPP_FR_URL, Themes.SOLIGUIDE_FR],
  ])("should set correct theme for webapp url %s", (url, expectedTheme) => {
    expect(getThemeFromOrigin(url)).toEqual(expectedTheme);
  });

  it("should set theme to SOLIGUIDE_FR when origin is app.soliguide.fr", () => {
    expect(
      getThemeFromOrigin(
        "https://app.soliguide.fr/ro/places?lang=fr&location=63bis-rue-victor-hugo-94140-alfortville&latitude=2.42236&longitude=48.804131&type=position&label=63bis+Rue+Victor+Hugo%2C+94140+Alfortville&category=food"
      )
    ).toEqual(Themes.SOLIGUIDE_FR);
  });

  it("should set theme to SOLIGUIDE_FR when origin is SOLIGUIDE_FR domain (double https)", () => {
    expect(getThemeFromOrigin(`https://${CONFIG.SOLIGUIDE_FR_URL}`)).toEqual(
      Themes.SOLIGUIDE_FR
    );
  });

  it("should set theme to null when origin is not a known domain", () => {
    expect(getThemeFromOrigin("https://unknown.com")).toEqual(null);
  });
});
