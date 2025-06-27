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
import { BrowserModule } from "@angular/platform-browser";
import { RouterTestingModule } from "@angular/router/testing";

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { TranslateModule } from "@ngx-translate/core";
import { SortingOrder } from "@soliguide/common";
import { ToastrModule } from "ngx-toastr";

import { of } from "rxjs";
import { ManagePlacesComponent } from "./manage-places.component";
import { ManagePlacesService } from "../../services/manage-places.service";
import { SharedModule } from "../../../shared/shared.module";
import { AuthService } from "../../../users/services/auth.service";
import {
  CommonPosthogMockService,
  ONLINE_PLACE_MOCK,
} from "../../../../../../mocks";
import { MockAuthService } from "../../../../../../mocks/MockAuthService";
import { registerLocales } from "../../../../shared";
import { PosthogService } from "../../../analytics/services/posthog.service";

const MOCK_SEARCH_RESULTS = {
  nbResults: 1,
  places: [ONLINE_PLACE_MOCK],
};

describe("ManagePlacesComponent", () => {
  let component: ManagePlacesComponent;
  let fixture: ComponentFixture<ManagePlacesComponent>;
  let managePlacesService: ManagePlacesService;

  beforeAll(() => {
    registerLocales();
  });

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ManagePlacesComponent],
      imports: [
        BrowserModule,
        FormsModule,
        HttpClientTestingModule,
        NgbModule,
        RouterTestingModule,
        SharedModule,
        ToastrModule.forRoot({}),
        TranslateModule.forRoot(),
      ],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: APP_BASE_HREF, useValue: "/" },
        { provide: PosthogService, useClass: CommonPosthogMockService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagePlacesComponent);
    managePlacesService = TestBed.inject(ManagePlacesService);
    jest
      .spyOn(window, "scroll")
      .mockImplementation((x, y) => window.scrollTo({ left: x, top: y }));
    jest
      .spyOn(managePlacesService, "launchSearch")
      .mockReturnValue(of(MOCK_SEARCH_RESULTS));
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should sort the search result", () => {
    component.sortBy("lieu_id");
    expect(component.search.options.sortValue).toBe(SortingOrder.DESCENDING);
  });

  it("should clear the research", () => {
    component.clearWordOrCategory();
    expect(component.search.category).toBeNull();
    expect(component.search.word).toBeNull();

    component.clearLocation();
    expect(component.search.location.label).toEqual("");

    component.clearSorting();
    expect(component.search.options.page).toBe(1);
    expect(component.search.options.limit).toBe(100);
  });
});
