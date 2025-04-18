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
import { RouterTestingModule } from "@angular/router/testing";

import { AdminPlaceService } from "./admin-place.service";

describe("AdminPlaceService", () => {
  let service: AdminPlaceService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [{ provide: APP_BASE_HREF, useValue: "/" }],
    });
    service = TestBed.inject(AdminPlaceService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  describe("Requêtes de type GET", () => {
    it("Envoie une requête pour vérifier si une place est dans une organisation", () => {
      service.checkInOrga(0).subscribe((res) => {
        expect(res).toBeTruthy();
      });

      const req = httpMock.expectOne(`${service.endPoint}check-in-orga/0`);
      expect(req.request.method).toBe("GET");

      req.flush("");
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
