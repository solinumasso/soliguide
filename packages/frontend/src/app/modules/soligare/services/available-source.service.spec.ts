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
import { TestBed } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { AvailableSourceService } from "./available-source.service";

import { AnyDepartmentCode } from "@soliguide/common";

import { environment } from "../../../../environments/environment";

describe("AvailableSourceService", () => {
  let service: AvailableSourceService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AvailableSourceService],
    });
    service = TestBed.inject(AvailableSourceService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should send a POST query to soligare available source route", () => {
    const dummyDepartmentCode: AnyDepartmentCode[] = ["22"];
    const dummyAvailableSources: string[] = ["test_source_name"];

    service
      .getAvailableSource(dummyDepartmentCode)
      .subscribe((availableSources) => {
        expect(availableSources.length).toBe(1);
        expect(availableSources).toEqual(dummyAvailableSources);
      });

    const req = httpMock.expectOne(
      `${environment.apiUrl}/v2/soligare/source/available`
    );
    expect(req.request.method).toBe("POST");
    expect(req.request.body).toEqual({ territories: dummyDepartmentCode });
  });
});
