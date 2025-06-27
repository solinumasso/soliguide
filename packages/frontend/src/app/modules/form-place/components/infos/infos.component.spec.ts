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
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { TranslateModule } from "@ngx-translate/core";

import { ToastrModule } from "ngx-toastr";

import { of } from "rxjs";

import { InfosComponent } from "./infos.component";

import { AdminPlaceService } from "../../services/admin-place.service";

import { ONLINE_PLACE_MOCK } from "../../../../../../mocks/ONLINE_PLACE.mock";
import { THEME_CONFIGURATION } from "../../../../models";

describe("InfosComponent", () => {
  let component: InfosComponent;
  let fixture: ComponentFixture<InfosComponent>;
  let adminPlaceService: AdminPlaceService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [InfosComponent],
      imports: [
        FormsModule,
        HttpClientTestingModule,
        NgbModule,
        ReactiveFormsModule,
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
            snapshot: {
              params: { lieu_id: 14270 },
            },
            params: of({
              lieu_id: 14270,
            }),
          },
        },
        {
          provide: APP_BASE_HREF,
          useValue: `/${THEME_CONFIGURATION.defaultLanguage}`,
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfosComponent);
    adminPlaceService = TestBed.inject(AdminPlaceService);
    jest
      .spyOn(adminPlaceService, "getPlace")
      .mockReturnValue(of(ONLINE_PLACE_MOCK));
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should submit", () => {
    ONLINE_PLACE_MOCK.position.complementAdresse =
      "Un test de complément d'adresse";
    jest
      .spyOn(adminPlaceService, "create")
      .mockReturnValue(of(ONLINE_PLACE_MOCK));
    component.submitInfos();
    expect(ONLINE_PLACE_MOCK.position.complementAdresse).toBe(
      "Un test de complément d'adresse"
    );
  });
});
