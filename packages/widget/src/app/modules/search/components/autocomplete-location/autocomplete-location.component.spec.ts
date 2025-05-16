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
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { TranslateModule } from "@ngx-translate/core";

import {
  Categories,
  CountryCodes,
  GeoPosition,
  GeoTypes,
  SupportedLanguagesCode,
  WidgetId,
} from "@soliguide/common";

import { ToastrModule } from "ngx-toastr";

import { AutocompleteLocationComponent } from "./autocomplete-location.component";

import { Search } from "../../../../models";

import { PosthogService } from "../../../analytics/services/posthog.service";
import { CommonPosthogMockService } from "../../../analytics/mocks/CommonPosthogMockService.mock";

describe("AutocompleteLocationComponent", () => {
  let component: AutocompleteLocationComponent;
  let fixture: ComponentFixture<AutocompleteLocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AutocompleteLocationComponent],
      imports: [
        HttpClientTestingModule,
        ToastrModule.forRoot(),
        TranslateModule.forRoot(),
      ],
      providers: [
        { provide: PosthogService, useClass: CommonPosthogMockService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AutocompleteLocationComponent);
    component = fixture.componentInstance;
    component.search = new Search({
      widgetId: WidgetId.CRF,
      category: Categories.FOOD,
      lang: SupportedLanguagesCode.FR,
      location: new GeoPosition({
        label: "Paris",
        coordinates: [2.3522219, 48.856614],
        geoType: GeoTypes.CITY,
        country: CountryCodes.FR,
        regionCode: "11",
        departmentCode: "75",
        postalCode: "75009",
        department: "Paris",
        region: "Île-de-France",
        city: "Paris",
        distance: 5,
        geoValue: "paris",
      }),
      options: {
        limit: 10,
      },
    });
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
