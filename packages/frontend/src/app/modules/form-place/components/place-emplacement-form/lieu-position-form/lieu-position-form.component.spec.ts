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
import { ReactiveFormsModule } from "@angular/forms";
import { RouterTestingModule } from "@angular/router/testing";
import { TranslateModule } from "@ngx-translate/core";

import { ToastrModule } from "ngx-toastr";

import { of } from "rxjs";

import { LieuPositionFormComponent } from "./lieu-position-form.component";

import { AdminPlaceService } from "../../../services/admin-place.service";

import { PLACE_EN_LIGNE_MOCK } from "../../../../../../../mocks";

describe("LieuPositionFormComponent", () => {
  let component: LieuPositionFormComponent;
  let fixture: ComponentFixture<LieuPositionFormComponent>;
  let adminPlaceService: AdminPlaceService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LieuPositionFormComponent],
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
        RouterTestingModule,
        ToastrModule.forRoot({}),
        TranslateModule.forRoot({}),
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LieuPositionFormComponent);
    adminPlaceService = TestBed.inject(AdminPlaceService);
    jest.spyOn(adminPlaceService, "checkInOrga").mockReturnValue(of(false));
    component = fixture.componentInstance;
    component.place = PLACE_EN_LIGNE_MOCK;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
