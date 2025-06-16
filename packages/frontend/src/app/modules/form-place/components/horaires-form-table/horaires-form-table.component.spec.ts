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
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { RouterTestingModule } from "@angular/router/testing";

import { TranslateModule } from "@ngx-translate/core";

import { ToastrModule } from "ngx-toastr";

import { HorairesFormTableComponent } from "./horaires-form-table.component";

import { OpeningHours } from "@soliguide/common";
import { SharedModule } from "../../../shared/shared.module";

describe("HorairesComponent", () => {
  let component: HorairesFormTableComponent;
  let fixture: ComponentFixture<HorairesFormTableComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [HorairesFormTableComponent],
      imports: [
        RouterTestingModule,
        ToastrModule.forRoot({}),
        FormsModule,
        SharedModule,
        TranslateModule.forRoot({}),
      ],
      providers: [{ provide: APP_BASE_HREF, useValue: "/" }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HorairesFormTableComponent);
    component = fixture.componentInstance;
    component.hours = new OpeningHours();
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should create a new slot", () => {
    component.newSlot("friday");
    expect(component.hours.friday.timeslot.length).toBe(1);
  });

  it("should delete a slot", () => {
    component.newSlot("friday");
    component.hours.friday.timeslot[0].end = 1200;
    component.newSlot("friday");
    component.hours.friday.timeslot[1].start = 1400;
    expect(component.hours.friday.timeslot.length).toBe(2);
    component.deleteSlot("friday", 1);
    expect(component.hours.friday.timeslot.length).toBe(1);
  });
});
