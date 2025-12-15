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

import { SoligarePairService } from "./soligare-pair.service";
import { environment } from "../../../../environments/environment";

describe("PairService", () => {
  let service: SoligarePairService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SoligarePairService],
    });
    service = TestBed.inject(SoligarePairService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should send a POST request to pair places", () => {
    const dummySourceId = "086baa25-18e9-fab2-f6eb-3b54d6efb09f";
    const dummySoliguideId = 456;

    service.pair(dummySourceId, dummySoliguideId).subscribe((response) => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne(
      `${environment.apiUrl}/v2/soligare/pairing/pair`
    );

    expect(req.request.method).toBe("POST");
    expect(req.request.body).toEqual({
      source_id: dummySourceId,
      soliguide_id: dummySoliguideId,
    });
  });
});
