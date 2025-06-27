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
import { BrowserModule } from "@angular/platform-browser";
import { ActivatedRoute } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { TranslateModule } from "@ngx-translate/core";

import { ToastrModule } from "ngx-toastr";

import { of } from "rxjs";

import { AdminPlaceComponent } from "./admin-place.component";
import { AdminPlaceService } from "../../../form-place/services/admin-place.service";
import { NotFoundComponent } from "../../../general/components/not-found/not-found.component";

import { PlaceContactsService } from "../../../place/services/place-contacts.service";

import { User } from "../../../users/classes";
import { AuthService } from "../../../users/services/auth.service";

import { Place } from "../../../../models/place/classes";

import {
  CommonPosthogMockService,
  ONLINE_PLACE_MOCK,
  PLACE_CONTACT_FOR_ADMIN_MOCK,
  USER_PRO_MOCK,
} from "../../../../../../mocks";
import { MockAuthService } from "../../../../../../mocks/MockAuthService";
import { THEME_CONFIGURATION } from "../../../../models";
import { PosthogService } from "../../../analytics/services/posthog.service";

describe("AdminPlaceComponent", () => {
  let component: AdminPlaceComponent;
  let fixture: ComponentFixture<AdminPlaceComponent>;
  let adminPlaceService: AdminPlaceService;

  let placeContactsService: PlaceContactsService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AdminPlaceComponent],
      imports: [
        HttpClientTestingModule,
        BrowserModule,
        NgbModule,
        RouterTestingModule.withRoutes([
          {
            path: `${THEME_CONFIGURATION.defaultLanguage}/404`,
            component: NotFoundComponent,
          },
        ]),
        ToastrModule.forRoot({}),
        TranslateModule.forRoot({}),
      ],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        {
          provide: APP_BASE_HREF,
          useValue: `/${THEME_CONFIGURATION.defaultLanguage}`,
        },
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({
              lieu_id: "0",
            }),
          },
        },
        { provide: PosthogService, useClass: CommonPosthogMockService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminPlaceComponent);

    adminPlaceService = TestBed.inject(AdminPlaceService);
    placeContactsService = TestBed.inject(PlaceContactsService);

    component = fixture.componentInstance;
    component.place = new Place(ONLINE_PLACE_MOCK);
    component.me = new User(USER_PRO_MOCK);

    component.place.photos = [];
    component.place.services_all = [];
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("doit s'initialiser correctement", () => {
    jest
      .spyOn(adminPlaceService, "getPlace")
      .mockReturnValue(of(new Place(ONLINE_PLACE_MOCK)));
    jest.spyOn(adminPlaceService, "checkInOrga").mockReturnValue(of(true));
    jest
      .spyOn(placeContactsService, "getPlaceContacts")
      .mockReturnValue(of([PLACE_CONTACT_FOR_ADMIN_MOCK]));

    component.ngOnInit();
    expect(component.place).toMatchObject(new Place(ONLINE_PLACE_MOCK));
  });
});
