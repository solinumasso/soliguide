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
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { RouterModule } from "@angular/router";

import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";

import { TranslateModule } from "@ngx-translate/core";

import { ToastrModule } from "ngx-toastr";

import { DisplayEntityInfosComponent } from "./display-entity-infos.component";

import { AuthService } from "../../../users/services/auth.service";

import {
  CommonPosthogMockService,
  ONLINE_PLACE_MOCK,
  USER_SOLIGUIDE_MOCK,
} from "../../../../../../mocks";
import { PosthogService } from "../../../analytics/services/posthog.service";

describe("DisplayEntityInfosComponent", () => {
  let component: DisplayEntityInfosComponent;
  let fixture: ComponentFixture<DisplayEntityInfosComponent>;
  let authService: AuthService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DisplayEntityInfosComponent],
      imports: [
        FontAwesomeModule,
        HttpClientTestingModule,
        RouterModule.forRoot([]),
        ToastrModule.forRoot({}),
        TranslateModule.forRoot({}),
      ],
      providers: [
        { provide: PosthogService, useClass: CommonPosthogMockService },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayEntityInfosComponent);
    authService = TestBed.inject(AuthService);
    jest
      .spyOn(authService, "currentUserValue", "get")
      .mockReturnValue(USER_SOLIGUIDE_MOCK);
    component = fixture.componentInstance;
    component.place = ONLINE_PLACE_MOCK;
    fixture.detectChanges();
  });

  it("should be created", () => {
    expect(component).toBeTruthy();
  });
});
