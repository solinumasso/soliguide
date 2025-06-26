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
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TranslateModule } from "@ngx-translate/core";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

import { DisplayServiceAdminComponent } from "./display-service-admin.component";
import { ONLINE_PLACE_MOCK } from "../../../../../../mocks/ONLINE_PLACE.mock";

describe("DisplayServiceAdminComponent", () => {
  let component: DisplayServiceAdminComponent;
  let fixture: ComponentFixture<DisplayServiceAdminComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DisplayServiceAdminComponent],
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot({}),
        NgbModule,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayServiceAdminComponent);
    component = fixture.componentInstance;
    component.service = ONLINE_PLACE_MOCK.services_all[0];
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
