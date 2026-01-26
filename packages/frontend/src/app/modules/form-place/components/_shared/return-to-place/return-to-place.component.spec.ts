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
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterModule } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";

import { THEME_CONFIGURATION } from "../../../../../models";
import { ReturnToPlaceComponent } from "./return-to-place.component";

describe("ReturnToPlaceComponent", () => {
  let component: ReturnToPlaceComponent;
  let fixture: ComponentFixture<ReturnToPlaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReturnToPlaceComponent],
      imports: [TranslateModule.forRoot(), RouterModule.forRoot([])],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReturnToPlaceComponent);
    component = fixture.componentInstance;
    component.returnUrl = {
      url: [`/${THEME_CONFIGURATION.defaultLanguage}/manage-place`, 23],
      queryParams: {},
    };
    component.buttonText = "Test Button";
    component.buttonTitle = "Test title";

    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
