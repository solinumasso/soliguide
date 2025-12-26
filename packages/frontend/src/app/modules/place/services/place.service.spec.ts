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
import { APP_BASE_HREF } from "@angular/common";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { RouterModule } from "@angular/router";

import { SupportedLanguagesCode } from "@soliguide/common";

import { PlaceService } from "./place.service";

import { CurrentLanguageService } from "../../general/services/current-language.service";

import { Place } from "../../../models/place/classes";

import { environment } from "../../../../environments/environment";

import { ONLINE_PLACE_MOCK } from "../../../../../mocks";

describe("PlaceService", () => {
  let placeservice: PlaceService;
  let httpMock: HttpTestingController;
  let currentLanguageService: CurrentLanguageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterModule.forRoot([])],
      providers: [PlaceService, { provide: APP_BASE_HREF, useValue: "/" }],
    });

    placeservice = TestBed.inject(PlaceService);
    httpMock = TestBed.inject(HttpTestingController);
    currentLanguageService = TestBed.inject(CurrentLanguageService);
  });

  it("should return an Observable<Place>", () => {
    currentLanguageService.setCurrentLanguage(SupportedLanguagesCode.EN);
    placeservice
      .getPlace(ONLINE_PLACE_MOCK.seo_url)
      .subscribe((place: Place) => {
        expect(place.seo_url).toBe(ONLINE_PLACE_MOCK.seo_url);
      });

    const req = httpMock.expectOne(
      `${environment.apiUrl}/place/${ONLINE_PLACE_MOCK.seo_url}/${currentLanguageService.currentLanguage}`
    );
    expect(req.request.method).toBe("GET");
    req.flush(ONLINE_PLACE_MOCK);
  });

  it("should return an Observable<boolean>", () => {
    placeservice
      .canEditPlace(ONLINE_PLACE_MOCK.seo_url)
      .subscribe((canEdit: boolean) => {
        expect(canEdit).toBe(true);
      });

    const req = httpMock.expectOne(
      `${environment.apiUrl}/admin/user-rights/can-edit/${ONLINE_PLACE_MOCK.seo_url}`
    );
    expect(req.request.method).toBe("GET");
    req.flush(true);
  });

  afterEach(() => {
    httpMock.verify();
  });
});
