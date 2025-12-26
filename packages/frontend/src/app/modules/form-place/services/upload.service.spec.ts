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
import { TestBed, getTestBed } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";

import { UploadService } from "./upload.service";
import { CommonPlaceDocument } from "@soliguide/common";

const DUMMY_DATA = new CommonPlaceDocument({
  _id: "60950104049aa60ae8b897d6",
  createdAt: new Date(),
  encoding: "7bit",
  filename: "faux-doc.pdf",
  mimetype: "application/pdf",
  name: "Une fausse donnée",
  path: "faux/chemin/faux-doc.pdf",
  size: 157312,
});

describe("UploadService", () => {
  let injector: TestBed;
  let service: UploadService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UploadService],
    });
    injector = getTestBed();
    service = injector.inject(UploadService);
    httpMock = injector.inject(HttpTestingController);
  });

  describe("upload", () => {
    it("should call setProgress", () => {
      service.upload(DUMMY_DATA, 0, "documents").subscribe((res) => {
        expect(res).not.toBeNull();
      });

      const req = httpMock.expectOne(`${service.endPoint}/documents/0`);
      expect(req.request.method).toBe("POST");

      req.flush("");
    });
  });

  describe("delete", () => {
    it("should delete the mock document", () => {
      service.delete(DUMMY_DATA._id, 0, "documents").subscribe((res) => {
        expect(res).not.toBeNull();
      });

      const req = httpMock.expectOne(
        `${service.endPoint}/documents/0/${DUMMY_DATA._id}`
      );
      expect(req.request.method).toBe("DELETE");

      req.flush("");
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
