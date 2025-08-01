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
import { ActivatedRouteSnapshot, Router, RouterModule } from "@angular/router";

import { TranslateModule } from "@ngx-translate/core";

import { ToastrModule, ToastrService } from "ngx-toastr";

import { of } from "rxjs";

import { NotAuthGuard } from "./not-logged.guard";

import { AuthService } from "../modules/users/services/auth.service";
import { THEME_CONFIGURATION } from "../models";

describe("NotAuthGuard", () => {
  let injector: TestBed;
  let notAuthGuard: NotAuthGuard;
  let authService: AuthService;
  let route: ActivatedRouteSnapshot;
  let router: Router;
  let toastr: ToastrService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterModule.forRoot([
          {
            path: THEME_CONFIGURATION.defaultLanguage,
            redirectTo: "",
          },
        ]),
        ToastrModule.forRoot({}),
        TranslateModule.forRoot({}),
      ],
      providers: [NotAuthGuard],
    });
  });

  beforeEach(() => {
    injector = getTestBed();
    authService = injector.inject(AuthService);
    notAuthGuard = injector.inject(NotAuthGuard);
    router = injector.inject(Router);
    toastr = injector.inject(ToastrService);
    route = new ActivatedRouteSnapshot();
  });

  it("should return 'true' if the user is not logged", () => {
    jest.spyOn(authService, "isAuth").mockReturnValueOnce(of(false));
    notAuthGuard.canActivate(route).subscribe((res) => expect(res).toBe(true));
  });

  it("should return 'false' if the user is logged", () => {
    route.params = { idInvitation: "invitation" };
    jest.spyOn(authService, "isAuth").mockReturnValueOnce(of(true));
    jest.spyOn(router, "navigate");
    jest.spyOn(toastr, "warning");
    notAuthGuard.canActivate(route).subscribe((res) => expect(res).toBe(false));
    expect(router.navigate).toHaveBeenCalled();
    expect(toastr.warning).toHaveBeenCalled();
  });
});
