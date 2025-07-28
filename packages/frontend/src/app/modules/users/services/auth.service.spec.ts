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
import { HttpClient } from "@angular/common/http";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { inject, TestBed } from "@angular/core/testing";
import { RouterModule } from "@angular/router";

import { SupportedLanguagesCode } from "@soliguide/common";

import { ToastrModule } from "ngx-toastr";
import { TranslateModule } from "@ngx-translate/core";

import { Observable } from "rxjs";

import { AuthService } from "./auth.service";

import { User } from "../classes";

import { USER_PRO_MOCK } from "../../../../../mocks";

describe("AuthService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([]),
        ToastrModule.forRoot({}),
        HttpClientTestingModule,
        TranslateModule.forRoot({}),
      ],
      providers: [AuthService, { provide: APP_BASE_HREF, useValue: "/" }],
    });
  });

  it("should be created", inject([AuthService], (service: AuthService) => {
    expect(service).toBeTruthy();
  }));

  it("doit changer d'user quand on lui demande", inject(
    [AuthService],
    (service: AuthService) => {
      expect(service.currentUserValue).toBe(null);

      const user = new User();
      user.translator = false;
      service.updateCurrentUser(user);
      expect(service.currentUserValue).toStrictEqual(user);

      user.translator = true;
      service.updateCurrentUser(user);
      expect(service.currentUserValue).toStrictEqual(user);

      const token = "a";
      service.updateCurrentUser(user, token);
      expect(service?.currentUserValue?.token).toStrictEqual(token);

      user.token = "b";
      service.updateCurrentUser(user);
      expect(service?.currentUserValue?.token).toStrictEqual("b");
    }
  ));

  it("doit correctement assigner l'utilisateur quand on se login", inject(
    [AuthService, HttpClient],
    (service: AuthService, http: HttpClient) => {
      jest.spyOn(http, "post").mockImplementation(() => {
        return new Observable((observer) => {
          observer.next({ user: USER_PRO_MOCK, token: "abc" });
          observer.complete();
        });
      });

      const user = new User(USER_PRO_MOCK);
      user.token = "abc";

      service
        .login("unusedEmail", "unusedPassword")
        .subscribe((value: User) => {
          expect(value).toStrictEqual(user);
          expect(service.currentUserValue).toStrictEqual(value);
        });
    }
  ));

  it("doit correctement assigner l'utilisateur quand on vérifie l'auth", inject(
    [AuthService, HttpClient],
    (service: AuthService, http: HttpClient) => {
      const user = new User(USER_PRO_MOCK);
      user.languages = [SupportedLanguagesCode.EN, SupportedLanguagesCode.AR];

      jest.spyOn(http, "post").mockImplementation(() => {
        return new Observable((observer) => {
          observer.next(user);
          observer.complete();
        });
      });

      user.languages = user.languages.map(
        (language: SupportedLanguagesCode) =>
          (language as string).toLowerCase() as SupportedLanguagesCode
      );

      service.isAuth().subscribe((value: boolean) => {
        expect(value).toStrictEqual(true);
        expect(service.currentUserValue).toStrictEqual(user);
      });
    }
  ));
});
