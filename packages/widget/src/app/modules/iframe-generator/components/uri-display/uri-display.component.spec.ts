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
import { FormsModule } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";

import {
  Categories,
  GeoTypes,
  PublicsGender,
  WidgetId,
} from "@soliguide/common";

import { UriDisplayComponent } from "./uri-display.component";

import { CommonPosthogMockService } from "../../../analytics/mocks/CommonPosthogMockService.mock";
import { PosthogService } from "../../../analytics/services/posthog.service";

import { WIDGETS } from "../../../../models";
import { SharedModule } from "../../../shared/shared.module";

describe("UriDisplayComponent", () => {
  let component: UriDisplayComponent;
  let fixture: ComponentFixture<UriDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UriDisplayComponent],
      imports: [FormsModule, SharedModule, TranslateModule.forRoot({})],
      providers: [
        { provide: PosthogService, useClass: CommonPosthogMockService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UriDisplayComponent);
    component = fixture.componentInstance;
    component.formValue = {
      email: "",
      organizationName: "",
      widgetId: WidgetId.SOLINUM,
      cities: [
        {
          geoValue: "paris",
          geoType: GeoTypes.CITY,
          label: "Paris",
          slugs: {},
          coordinates: [],
        },
        {
          geoValue: "lyon",
          geoType: GeoTypes.CITY,
          label: "Lyon",
          slugs: {},
          coordinates: [],
        },
      ],
      departments: [
        {
          geoValue: "seine-saint-denis",
          geoType: GeoTypes.DEPARTMENT,
          label: "Seine-Saint-Denis",
          slugs: {},
          coordinates: [],
        },
        {
          geoValue: "morbihan",
          geoType: GeoTypes.DEPARTMENT,
          label: "Paris",
          slugs: {},
          coordinates: [],
        },
      ],
      regions: [
        {
          geoValue: "occitanie",
          geoType: GeoTypes.REGION,
          label: "Occitanie",
          slugs: {},
          coordinates: [],
        },
      ],
      national: true,
      categories: [
        Categories.FOOD,
        Categories.SOLIDARITY_STORE,
        Categories.CLOTHING,
      ],
      publics: { gender: [PublicsGender.women] },
      modalities: { orientation: true, pmr: true },
      theme: WIDGETS[WidgetId.SOLINUM].theme,
      gcu: false,
    };
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
