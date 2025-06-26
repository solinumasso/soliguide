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
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";

import { ToastrModule } from "ngx-toastr";
import { TranslateModule } from "@ngx-translate/core";

import { of } from "rxjs";

import { FormMenuPlaceComponent } from "./menu.component";

import { AdminPlaceService } from "../../services/admin-place.service";

import { AuthService } from "../../../users/services/auth.service";

import {
  ONLINE_PLACE_MOCK,
  USER_SOLIGUIDE_MOCK,
} from "../../../../../../mocks";

describe("FormMenuPlaceComponent", () => {
  let component: FormMenuPlaceComponent;
  let fixture: ComponentFixture<FormMenuPlaceComponent>;
  let adminPlaceService: AdminPlaceService;
  let authService: AuthService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [FormMenuPlaceComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        ToastrModule.forRoot({}),
        TranslateModule.forRoot({}),
      ],
      providers: [{ provide: APP_BASE_HREF, useValue: "/" }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormMenuPlaceComponent);
    adminPlaceService = TestBed.inject(AdminPlaceService);
    authService = TestBed.inject(AuthService);
    jest.spyOn(adminPlaceService, "checkInOrga").mockReturnValue(of(false));
    jest
      .spyOn(authService, "currentUserValue", "get")
      .mockReturnValue(USER_SOLIGUIDE_MOCK);
    component = fixture.componentInstance;
    component.place = ONLINE_PLACE_MOCK;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
