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
import { ActivatedRoute, RouterModule } from "@angular/router";

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { of } from "rxjs";

import { PlaceComponent } from "./place.component";

import { Place } from "../../../../models/place/classes";

import { PlaceService } from "../../../place/services/place.service";

import { SharedModule } from "../../../shared/shared.module";

import { AuthService } from "../../../users/services/auth.service";

import {
  CommonPosthogMockService,
  ONLINE_PLACE_MOCK,
} from "../../../../../../mocks";
import { MockAuthService } from "../../../../../../mocks/MockAuthService";
import { TranslateModule } from "@ngx-translate/core";
import { registerLocales } from "../../../../shared";
import { PosthogService } from "../../../analytics/services/posthog.service";

describe("PlaceComponent", () => {
  let component: PlaceComponent;
  let fixture: ComponentFixture<PlaceComponent>;
  let placeService: PlaceService;

  beforeAll(() => {
    registerLocales();
  });

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PlaceComponent],
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot({}),
        NgbModule,
        RouterModule.forRoot([]),
        SharedModule,
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ lieu_id: "1" }),
          },
        },
        { provide: APP_BASE_HREF, useValue: "/" },
        { provide: AuthService, useClass: MockAuthService },
        { provide: PosthogService, useClass: CommonPosthogMockService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(PlaceComponent);
    placeService = TestBed.inject(PlaceService);

    jest
      .spyOn(window, "scroll")
      .mockImplementation((x, y) => window.scrollTo({ left: x, top: y }));
    jest
      .spyOn(placeService, "getPlace")
      .mockReturnValue(of(new Place(ONLINE_PLACE_MOCK)));

    component = fixture.componentInstance;

    fixture.detectChanges();
  }));

  it("should be created", () => {
    expect(component).toBeTruthy();
    expect(component.place).toMatchObject(new Place(ONLINE_PLACE_MOCK));
  });
});
