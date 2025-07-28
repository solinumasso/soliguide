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
import { FormsModule } from "@angular/forms";
import { ActivatedRoute, RouterModule } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";

import { ToastrModule } from "ngx-toastr";

import { of } from "rxjs";

import { FormHorairesComponent } from "./form-horaires.component";

import { AdminPlaceService } from "../../services/admin-place.service";

import { ONLINE_PLACE_MOCK } from "../../../../../../mocks/ONLINE_PLACE.mock";
import { THEME_CONFIGURATION } from "../../../../models";
import { FixNavigationTriggeredOutsideAngularZoneNgModule } from "../../../../shared/modules/FixNavigationTriggeredOutsideAngularZoneNgModule.module";

describe("FormHorairesComponent", () => {
  let component: FormHorairesComponent;
  let fixture: ComponentFixture<FormHorairesComponent>;
  let adminPlaceService: AdminPlaceService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [FormHorairesComponent],
      imports: [
        FixNavigationTriggeredOutsideAngularZoneNgModule,
        FormsModule,
        HttpClientTestingModule,
        TranslateModule.forRoot({}),
        RouterModule.forRoot([
          {
            path: `${THEME_CONFIGURATION.defaultLanguage}/manage-place/14270`,
            redirectTo: "",
          },
        ]),
        ToastrModule.forRoot({}),
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({
              lieu_id: "14270",
            }),
          },
        },
        {
          provide: APP_BASE_HREF,
          useValue: `/${THEME_CONFIGURATION.defaultLanguage}`,
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormHorairesComponent);
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

  it("should set 24h/24h", () => {
    component.place.newhours.h24 = true;
    component.setH24();
    expect(component.place.newhours.monday.timeslot).toEqual([
      { end: "23:59", start: "00:00" },
    ]);
  });

  it("should submit", () => {
    jest
      .spyOn(adminPlaceService, "patchHoraires")
      .mockReturnValue(of(ONLINE_PLACE_MOCK));

    component.submitHoraires();

    expect(ONLINE_PLACE_MOCK.newhours.monday.timeslot).toEqual([
      { end: "23:59", start: "00:00" },
    ]);
  });
});
