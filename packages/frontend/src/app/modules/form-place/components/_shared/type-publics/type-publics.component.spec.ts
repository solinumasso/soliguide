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
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";

import { TranslateModule } from "@ngx-translate/core";

import {
  ADMINISTRATIVE_DEFAULT_VALUES,
  FAMILY_DEFAULT_VALUES,
  Publics,
  PublicsGender,
  PublicsElement,
  WelcomedPublics,
} from "@soliguide/common";

import { ToastrModule } from "ngx-toastr";

import { FormTypePublicsFicheComponent } from "./type-publics.component";

import { SharedModule } from "../../../../shared/shared.module";

const mockPublics = new Publics();

mockPublics.description = "Un fausse entrée pour le public accueilli";

describe("FormTypePublicsFicheComponent", () => {
  let component: FormTypePublicsFicheComponent;
  let fixture: ComponentFixture<FormTypePublicsFicheComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [FormTypePublicsFicheComponent],
      imports: [
        FormsModule,
        HttpClientTestingModule,
        SharedModule,
        RouterModule.forRoot([]),
        ToastrModule.forRoot({}),
        TranslateModule.forRoot({}),
      ],
      providers: [{ provide: APP_BASE_HREF, useValue: "/" }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormTypePublicsFicheComponent);
    component = fixture.componentInstance;
    component.publics = mockPublics;
    component.typeError = [];
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should set default publics", () => {
    component.setDefaultPublics();
    expect(component.publics.accueil).toBe(WelcomedPublics.UNCONDITIONAL);
    expect(component.publics.administrative).toStrictEqual(
      ADMINISTRATIVE_DEFAULT_VALUES
    );
    expect(component.publics.age).toStrictEqual({ max: 99, min: 0 });
  });

  it("should set preferential", () => {
    component.setPreferential(WelcomedPublics.PREFERENTIAL);
    expect(component.publics.accueil).toBe(WelcomedPublics.PREFERENTIAL);
    expect(component.publics.administrative).toStrictEqual(
      ADMINISTRATIVE_DEFAULT_VALUES
    );
    expect(component.publics.familialle).toStrictEqual(FAMILY_DEFAULT_VALUES);
  });

  it("should unselect all elements in gender", () => {
    component.setDefaultPublics();
    component.selectAll(PublicsElement.GENDER);
    expect(component.publics.gender).toStrictEqual([]);
    expect(component.getStringToDisplay(PublicsElement.GENDER)).toStrictEqual(
      "Aucun"
    );
  });

  it("should toggle 'men'", () => {
    component.toggleCheckboxButton(PublicsElement.GENDER, PublicsGender.men);
    expect(component.publics.gender).toStrictEqual([PublicsGender.men]);
    component.toggleCheckboxButton(PublicsElement.GENDER, PublicsGender.men);
    expect(component.publics.gender).toStrictEqual([]);
  });
});
