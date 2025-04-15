/*
 * Soliguide: Useful information for those who need it
 *
 * SPDX-FileCopyrightText: © 2025 Solinum
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
import { translator } from "./i18n.config";

import {
  PLACE_PUBLICS_MOCK,
  PlacePublicsMock,
} from "./mocks/PLACE_PUBLICS.mock";

import { translatePublics } from "../functions";
import { SUPPORTED_LANGUAGES } from "../constants";
import { SupportedLanguagesCode } from "../enums";
import { Publics, WelcomedPublics } from "../../publics";

PLACE_PUBLICS_MOCK.forEach((publicForTest: PlacePublicsMock) => {
  describe(`Generate publics in string ${publicForTest.name} for ${publicForTest.publics.accueil}`, () => {
    it.each(SUPPORTED_LANGUAGES)("Translate public in %s", (lang) => {
      expect(translatePublics(translator, lang, publicForTest.publics)).toEqual(
        publicForTest.expectedResults[lang]
      );
    });
  });
});

describe("Generate publics in HTML", () => {
  const mockPublics = Object.values(PLACE_PUBLICS_MOCK);
  const EXCLUSIVE = mockPublics.find(
    (test) => test.publics.accueil === WelcomedPublics.EXCLUSIVE
  );

  it("Translate with HTML EXCLUSIVE", () => {
    expect(
      translatePublics(
        translator,
        SupportedLanguagesCode.EN,
        EXCLUSIVE?.publics as unknown as Publics,
        true,
        true
      )
    ).toEqual("<b>Exclusive welcome: </b>adults, isolated people, couples.");
  });

  const UNCONDITIONAL = mockPublics.find(
    (test) => test.publics.accueil === WelcomedPublics.UNCONDITIONAL
  );

  it("Translate with HTML UNCONDITIONAL", () => {
    expect(
      translatePublics(
        translator,
        SupportedLanguagesCode.EN,
        UNCONDITIONAL?.publics as unknown as Publics,
        true,
        true
      )
    ).toEqual("<b>Unconditional welcome</b>");
  });

  it("Translate with HTML PREFERENTIAL", () => {
    const PREFERENTIAL = mockPublics.find(
      (test) => test.publics.accueil === WelcomedPublics.PREFERENTIAL
    );

    expect(
      translatePublics(
        translator,
        SupportedLanguagesCode.EN,
        PREFERENTIAL?.publics as unknown as Publics,
        true,
        true
      )
    ).toEqual(
      "<b>Unconditional welcome adapted to </b>women, refugees, asylum seekers, isolated people, pregnant women, students, people in prostitution situations."
    );
  });
});

describe("Generate publics with description", () => {
  const mockPublics = Object.values(PLACE_PUBLICS_MOCK);
  const EXCLUSIVE = mockPublics.find(
    (test) => test.publics.accueil === WelcomedPublics.EXCLUSIVE
  );

  it("Translate with HTML & description", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (EXCLUSIVE as any).publics.description = "Lorem ipsum";

    expect(
      translatePublics(
        translator,
        SupportedLanguagesCode.EN,
        EXCLUSIVE?.publics as unknown as Publics,
        true,
        true
      )
    ).toEqual(
      "<b>Exclusive welcome: </b>adults, isolated people, couples.<br><b>Other useful informations:</b> Lorem ipsum<br>"
    );
  });
  it("Translate in plane texte & description", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (EXCLUSIVE as any).publics.description = "Lorem ipsum";

    expect(
      translatePublics(
        translator,
        SupportedLanguagesCode.EN,
        EXCLUSIVE?.publics as unknown as Publics,
        false,
        true
      )
    ).toEqual(
      "Exclusive welcome: adults, isolated people, couples.\nOther useful informations: Lorem ipsum"
    );
  });
});
