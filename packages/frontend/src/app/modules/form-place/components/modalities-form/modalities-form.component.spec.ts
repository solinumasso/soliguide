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
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { TranslateModule } from "@ngx-translate/core";

import { Modalities } from "@soliguide/common";

import { ToastrModule } from "ngx-toastr";

import { ModalitiesFormComponent } from "./modalities-form.component";

describe("ModalitiesComponent", () => {
  let component: ModalitiesFormComponent;
  let fixture: ComponentFixture<ModalitiesFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ModalitiesFormComponent],
      imports: [
        FormsModule,
        HttpClientTestingModule,
        NgbModule,
        RouterModule.forRoot([]),
        ToastrModule.forRoot({}),
        TranslateModule.forRoot({}),
      ],
      providers: [{ provide: APP_BASE_HREF, useValue: "/" }],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
        // For CKEditor
        NO_ERRORS_SCHEMA,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalitiesFormComponent);
    component = fixture.componentInstance;
    component.modalities = new Modalities();
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should update modalities based on changeModalities", () => {
    expect(component.modalities.orientation.checked).toBeFalsy();
    expect(component.modalities.appointment.checked).toBeFalsy();
    expect(component.modalities.inscription.checked).toBeFalsy();

    component.changeModalities("inscription");

    expect(component.modalities.orientation.checked).toBeFalsy();
    expect(component.modalities.appointment.checked).toBeFalsy();
    expect(component.modalities.inscription.checked).toBeTruthy();

    component.changeModalities("orientation");

    expect(component.modalities.orientation.checked).toBeTruthy();
    expect(component.modalities.appointment.checked).toBeFalsy();
    expect(component.modalities.inscription.checked).toBeTruthy();
  });
  it("should set price checked", () => {
    // Initial state
    expect(component.modalities.price.checked).toBeFalsy();

    // Trigger setPriceChecked with true
    component.setPriceChecked(true);

    // Expect price.checked to be true
    expect(component.modalities.price.checked).toBeTruthy();
  });

  it("should set pmr checked", () => {
    expect(component.modalities.pmr.checked).toBeFalsy();
    component.setPmrChecked(true);
    expect(component.modalities.pmr.checked).toBeTruthy();
  });

  it("should set animal checked", () => {
    expect(component.modalities.animal.checked).toBeFalsy();
    component.setAnimalChecked(true);
    expect(component.modalities.animal.checked).toBeTruthy();
  });
});
