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
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterModule } from "@angular/router";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { ToastrModule } from "ngx-toastr";
import { Place } from "../../../../models/place/classes";

import { DuplicatePlaceComponent } from "./duplicate-place.component";

import { USER_PRO_MOCK } from "../../../../../../mocks";
import { User } from "../../../users/classes/user.class";
import { MockAuthService } from "../../../../../../mocks/MockAuthService";
import { AuthService } from "../../../users/services/auth.service";
import { TranslateModule } from "@ngx-translate/core";

describe("DuplicatePlaceComponent", () => {
  let component: DuplicatePlaceComponent;
  let fixture: ComponentFixture<DuplicatePlaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DuplicatePlaceComponent],
      imports: [
        HttpClientTestingModule,
        BrowserModule,
        NgbModule,
        FormsModule,
        BrowserAnimationsModule,
        RouterModule.forRoot([]),
        ToastrModule.forRoot({}),
        TranslateModule.forRoot({}),
      ],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: APP_BASE_HREF, useValue: "/" },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DuplicatePlaceComponent);
    component = fixture.componentInstance;
    component.place = new Place();
    component.user = new User(USER_PRO_MOCK);
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
