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
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterModule } from "@angular/router";

import { ToastrModule } from "ngx-toastr";

import { CheckPlaceChangesComponent } from "./check-place-changes.component";

import { PLACE_CHANGES_MOCK } from "../../../../../../mocks";
import { TranslateModule } from "@ngx-translate/core";

describe("CheckPlaceChangesComponent", () => {
  let component: CheckPlaceChangesComponent;
  let fixture: ComponentFixture<CheckPlaceChangesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CheckPlaceChangesComponent],
      imports: [
        HttpClientTestingModule,
        RouterModule.forRoot([]),
        ToastrModule.forRoot(),
        TranslateModule.forRoot({}),
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckPlaceChangesComponent);
    component = fixture.componentInstance;
    component.placeChanges = PLACE_CHANGES_MOCK;
    component.changeIndex = 1;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
