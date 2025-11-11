/*
 * Soliguide: Useful information for those who need it
 *
 * SPDX-FileCopyrightText: © 2025 Solinum
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
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { ActivatedRoute } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { TranslateModule } from "@ngx-translate/core";
import { ToastrModule } from "ngx-toastr";
import { of } from "rxjs";

import { SearchComponent } from "./search.component";
import { SearchService } from "../../services/search.service";
import { AuthService } from "../../../users/services/auth.service";
import { SharedModule } from "../../../shared/shared.module";
import {
  CommonPosthogMockService,
  ONLINE_PLACE_MOCK,
} from "../../../../../../mocks";
import { MockAuthService } from "../../../../../../mocks/MockAuthService";
import { PosthogService } from "../../../analytics/services/posthog.service";
import { LocationService } from "../../../shared/services";
import { CountryCodes, GeoTypes } from "@soliguide/common";

describe("SearchComponent - Tests Simples", () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;
  let searchService: SearchService;
  let locationService: LocationService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SearchComponent],
      imports: [
        FormsModule,
        HttpClientTestingModule,
        NgbModule,
        NoopAnimationsModule,
        ReactiveFormsModule,
        RouterTestingModule,
        SharedModule,
        ToastrModule.forRoot({}),
        TranslateModule.forRoot({}),
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({}),
            params: of({ category: "accueil", position: "bordeaux" }),
            snapshot: {
              params: { category: "accueil", position: "bordeaux" },
              queryParams: {},
            },
          },
        },
        { provide: APP_BASE_HREF, useValue: "/" },
        { provide: AuthService, useClass: MockAuthService },
        { provide: PosthogService, useClass: CommonPosthogMockService },
        LocationService,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    searchService = TestBed.inject(SearchService);
    locationService = TestBed.inject(LocationService);

    // Mock des services
    jest
      .spyOn(searchService, "launchSearch")
      .mockReturnValue(of({ results: [ONLINE_PLACE_MOCK], nbResults: 1 }));

    jest.spyOn(locationService, "locationAutoComplete").mockReturnValue(
      of([
        {
          label: "Bordeaux",
          coordinates: [-0.59254, 44.856614],
          postalCode: "33000",
          cityCode: "33063",
          city: "Bordeaux",
          country: CountryCodes.FR,
          timeZone: "Europe/Paris",
          name: "Bordeaux",
          department: "Gironde",
          region: "Nouvelle-Aquitaine",
          regionCode: "75",
          geoType: GeoTypes.CITY,
          geoValue: "bordeaux-33000",
          slugs: {
            ville: "bordeaux",
            departement: "gironde",
            pays: "fr",
            department: "gironde",
            country: "fr",
            region: "nouvelle-aquitaine",
            city: "bordeaux",
          },
          departmentCode: "33",
        },
      ])
    );

    jest.spyOn(component.searchSubject, "next");
    jest.spyOn(component.parcoursSearchSubject, "next");
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should initialize properties correctly", () => {
    expect(component.places).toEqual([]);
    expect(component.parcours).toEqual([]);
    expect(component.markers).toEqual([]);
    expect(component.nbResults).toBe(0);
    expect(component.nbParcoursResults).toBe(0);
    expect(component.loading).toBe(true);
    expect(component.parcoursLoading).toBe(true);
  });

  it("should have search and parcoursSearch defined after initialization", (done) => {
    fixture.detectChanges();

    setTimeout(() => {
      expect(component.search).toBeDefined();
      expect(component.parcoursSearch).toBeDefined();
      expect(component.search.location).toBeDefined();
      expect(component.parcoursSearch.location).toBeDefined();
      done();
    }, 100);
  });

  it("should toggle showFilters when toggleFilter is called", () => {
    component.showFilters = true;
    component.toggleFilter();
    expect(component.showFilters).toBe(false);

    component.toggleFilter();
    expect(component.showFilters).toBe(true);
  });
});
