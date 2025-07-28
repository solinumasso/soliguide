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
import { ComponentFixture, TestBed } from "@angular/core/testing";
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
} from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";

import { PlaceFormPhonesComponent } from "./place-form-phones.component";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { SharedModule } from "../../../../shared";

describe("PhonesComponent", () => {
  let component: PlaceFormPhonesComponent;
  let fixture: ComponentFixture<PlaceFormPhonesComponent>;

  const formBuilder = new FormBuilder();
  const form = formBuilder.group({
    entity: formBuilder.group({ phones: formBuilder.array([]) }),
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PlaceFormPhonesComponent],
      imports: [ReactiveFormsModule, SharedModule, TranslateModule.forRoot({})],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaceFormPhonesComponent);
    component = fixture.componentInstance;
    component.parentForm = form.controls.entity as FormGroup;
    component.phonesData = [];
    component.phonesForm = form.controls.entity.get("phones") as FormArray;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
