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
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { getTestBed, TestBed } from "@angular/core/testing";
import { ActivatedRouteSnapshot, RouterModule } from "@angular/router";

import { TranslateModule } from "@ngx-translate/core";

import { LanguageGuard } from "./language.guard";

import { CurrentLanguageService } from "../modules/general/services/current-language.service";
import { THEME_CONFIGURATION } from "../models";

describe("LanguageGuard", () => {
  let injector: TestBed;
  let languageGuard: LanguageGuard;
  let route: ActivatedRouteSnapshot;
  let currentLanguageService: CurrentLanguageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterModule.forRoot([
          {
            path: `${THEME_CONFIGURATION.defaultLanguage}/404`,
            redirectTo: "",
          },
        ]),
        TranslateModule.forRoot({}),
      ],
      providers: [LanguageGuard],
    });
  });

  beforeEach(() => {
    injector = getTestBed();
    languageGuard = injector.inject(LanguageGuard);
    route = new ActivatedRouteSnapshot();
    currentLanguageService = injector.inject(CurrentLanguageService);
  });

  it("should return 'true' if the language is supported", () => {
    let index = 0;
    const expectedLanguages = ["fr", "en"];
    currentLanguageService.subscribe((lang) => {
      expect(lang).toStrictEqual(expectedLanguages[index]);
      index++;
    });
    route.params = {
      lang: "en",
    };
    expect(languageGuard.canActivate(route)).toBeTruthy();
    expect(index).toStrictEqual(expectedLanguages.length);
  });

  it("should return 'false' if the language is not supported", () => {
    let languageUpdates = 0;
    route.params = {
      lang: "foo",
    };
    currentLanguageService.subscribe((lang) => {
      expect(lang).toStrictEqual("fr");
      languageUpdates++;
    });
    expect(languageGuard.canActivate(route)).toBeFalsy();
    expect(languageUpdates).toStrictEqual(1);
  });
});
