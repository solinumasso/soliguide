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
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";

import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { TranslateModule } from "@ngx-translate/core";

import { FormPointPassageComponent } from "./point-passage.component";

import { OpeningHours } from "@soliguide/common";
import {
  PlaceParcours,
  PlacePosition,
} from "../../../../../../models/place/classes";

const point: PlaceParcours = {
  description: "",
  hours: new OpeningHours(),
  position: new PlacePosition(),
  photos: [],
  show: false,
};

describe("FormPointPassageComponent", () => {
  let component: FormPointPassageComponent;
  let fixture: ComponentFixture<FormPointPassageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [FormPointPassageComponent],
      imports: [ReactiveFormsModule, TranslateModule.forRoot({})],
      providers: [{ provide: APP_BASE_HREF, useValue: "/" }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormPointPassageComponent);
    component = fixture.componentInstance;
    component.point = point;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should set a description", () => {
    component.setDescription("Un test");
    expect(component.point.description).toBe("Un test");
  });

  it("should toggle the show variable", () => {
    component.point.show = true;
    component.toggleShow();
    expect(component.point.show).toBe(false);
  });
});
