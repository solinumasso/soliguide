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

import { LocationAutocompleteComponent } from "./location-autocomplete.component";
import { TranslateModule } from "@ngx-translate/core";
import { ToastrModule } from "ngx-toastr";
import { SearchService } from "../../../search/services/search.service";
import { Search } from "../../../search/interfaces";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { PosthogService } from "../../../analytics/services/posthog.service";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { CommonPosthogMockService } from "../../../../../../mocks";
import { LocationService } from "../../services";

Object.defineProperty(window, "getComputedStyle", {
  value: () => ({
    getPropertyValue: () => {
      return "";
    },
  }),
});

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

describe("LocationAutocompleteComponent", () => {
  let component: LocationAutocompleteComponent;
  let fixture: ComponentFixture<LocationAutocompleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        ToastrModule.forRoot(),
      ],
      providers: [
        SearchService,
        LocationService,
        { provide: PosthogService, useClass: CommonPosthogMockService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(LocationAutocompleteComponent);
    component = fixture.componentInstance;

    component.search = new Search();
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
