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
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { ActivatedRoute, Router } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { TranslateModule } from "@ngx-translate/core";
import { ToastrModule, ToastrService } from "ngx-toastr";
import { of } from "rxjs";

import { FormServicesComponent } from "./form-services.component";
import { MockAdminPlaceService } from "../../services/mocks/AdminPlaceService.mock";
import { AdminPlaceService } from "../../services/admin-place.service";
import { ApiError, Place, THEME_CONFIGURATION } from "../../../../models";
import { ONLINE_PLACE_MOCK } from "../../../../../../mocks";

describe("ServicesComponent", () => {
  let component: FormServicesComponent;
  let fixture: ComponentFixture<FormServicesComponent>;

  let router: Router;
  let toastr: ToastrService;
  let errorMessage: string;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [FormServicesComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([
          {
            path: `${THEME_CONFIGURATION.defaultLanguage}/manage-place/14270`,
            redirectTo: "",
          },
        ]),
        ToastrModule.forRoot({}),
        TranslateModule.forRoot({}),
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ lieu_id: "14270" }),
          },
        },
        {
          provide: APP_BASE_HREF,
          useValue: `/${THEME_CONFIGURATION.defaultLanguage}`,
        },
        { provide: AdminPlaceService, useClass: MockAdminPlaceService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormServicesComponent);

    toastr = TestBed.inject(ToastrService);
    jest.spyOn(toastr, "error").mockImplementation((value) => {
      errorMessage = value?.toString() ?? "";
      return "" as never;
    });

    router = TestBed.inject(Router);
    jest.spyOn(router, "navigate").mockReturnValue(Promise.resolve(true));

    component = fixture.componentInstance;
    component.place = new Place(ONLINE_PLACE_MOCK);

    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should set description as invalid", () => {
    component.descriptionHasError(true);
    expect(component.isDescriptionInvalid).toBe(true);
  });

  it("should submit", () => {
    component.submitServices();
    expect(component.submitted).toBeTruthy();
    expect(component.loading).toBeFalsy();
  });

  describe("displayServicesErrors", () => {
    it("should display a public error has happened", () => {
      const error = new ApiError("Error");

      component.place.services_all[0].differentPublics = true;
      component.place.services_all[0].publics.administrative = [];

      error.error.push({
        path: "service.0.publics",
        value: undefined,
        msg: "oh no",
        location: "publics",
      });
      component.displayServicesErrors(error);

      expect(component.typeErrorForm).toStrictEqual([
        { error: "oh no", serviceIndex: 1, location: "publics" },
      ]);
      expect(errorMessage).toBe("ERROR_OCCURRED_EDITING_PUBLICS IN_SERVICE 1");
    });
  });

  it("should display a description error has happened", () => {
    const error = new ApiError("Error");

    error.error.push({
      path: "service.0.description",
      value: undefined,
      msg: "Wrong description api message",
      location: "description",
    });
    component.displayServicesErrors(error);

    expect(component.typeErrorForm).toStrictEqual([
      {
        error: "Wrong description api message",
        serviceIndex: 1,
        location: "description",
      },
    ]);
    expect(errorMessage).toBe("CHECK_DESCRIPTION IN_SERVICE 1");
  });
});
