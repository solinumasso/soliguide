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

import { APP_BASE_HREF } from "@angular/common";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { RouterModule } from "@angular/router";
import { ToastrModule } from "ngx-toastr";

import { InviteUserService } from "./invite-user.service";
import { ORGANIZATION_MOCK } from "../../../../../mocks/ORGANIZATION.mock";
import { environment } from "../../../../environments/environment";
import { first } from "rxjs/operators";
import { TranslateModule } from "@ngx-translate/core";

describe("InviteUserService", () => {
  let service: InviteUserService;
  let httpControllerMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([]),
        ToastrModule.forRoot({}),
        TranslateModule.forRoot({}),
        HttpClientTestingModule,
      ],
      providers: [InviteUserService, { provide: APP_BASE_HREF, useValue: "/" }],
    });

    service = TestBed.inject(InviteUserService);
    httpControllerMock = TestBed.inject(HttpTestingController);
  });

  describe("checkEmailAlreadyUsedInOrga", () => {
    it("doit retourner true quand l'utilisateur est déjà dans l'orga", () => {
      const dummyOrga = ORGANIZATION_MOCK;
      const dummyEmail = "test@email.com";
      service
        .checkEmailAlreadyUsedInOrga(dummyEmail, dummyOrga._id)
        .pipe(first())
        .subscribe((alreadyInOrga: boolean) => {
          expect(alreadyInOrga).toBe(true);
        });

      const req = httpControllerMock.expectOne(
        `${environment.apiUrl}invite-user/test-email-exist-orga/${dummyOrga._id}`
      );
      expect(req.request.method).toBe("POST");
      req.flush(true);
    });

    afterEach(() => {
      httpControllerMock.verify();
    });
  });
});
