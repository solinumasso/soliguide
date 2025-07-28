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
import {
  SupportedLanguagesCode,
  GeoPosition,
  Categories,
  getCategoryTranslationKey,
} from "@soliguide/common";
import { APP_BASE_HREF } from "@angular/common";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { Router, RouterModule } from "@angular/router";

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { ToastrModule } from "ngx-toastr";

import { HomeComponent } from "./home.component";

import { CurrentLanguageService } from "../../services/current-language.service";
import { SeoService } from "../../../shared/services/seo.service";
import { CategoryTranslateKeyPipe } from "../../../shared/pipes";
import { globalConstants } from "../../../../shared/functions";
import { PosthogService } from "../../../analytics/services/posthog.service";
import { CommonPosthogMockService } from "../../../../../../mocks";

describe("HomeComponent", () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let currentLanguageService: CurrentLanguageService;
  let router: Router;
  let seoService: SeoService;
  let translateService: TranslateService;

  const mockGlobalConstants = globalConstants;

  const spyOnScroll = jest
    .spyOn(window, "scroll")
    .mockImplementation((x, y) => window.scrollTo({ left: x, top: y }));

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [HomeComponent, CategoryTranslateKeyPipe],
      imports: [
        BrowserAnimationsModule,
        HttpClientTestingModule,
        NgbModule,
        RouterModule.forRoot([
          {
            path: `${SupportedLanguagesCode.FR}/search/paris/${Categories.FOOD}`,
            redirectTo: "",
          },
        ]),
        ToastrModule.forRoot({}),
        TranslateModule.forRoot({}),
      ],
      providers: [
        { provide: APP_BASE_HREF, useValue: "/" },
        { provide: PosthogService, useClass: CommonPosthogMockService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    currentLanguageService = TestBed.inject(CurrentLanguageService);
    jest
      .spyOn(currentLanguageService, "currentLanguage", "get")
      .mockReturnValue(SupportedLanguagesCode.FR);
    seoService = TestBed.inject(SeoService);
    jest.spyOn(seoService, "updateTitleAndTags").mockImplementation(() => {}); // skipcq: JS-0321
    jest
      .spyOn(mockGlobalConstants, "getItem")
      .mockImplementation((key: string) => {
        if (key === "POSITION") {
          return new GeoPosition({ geoValue: "paris" });
        }
        return "";
      });
    router = TestBed.inject(Router);
    translateService = TestBed.inject(TranslateService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
    expect(component.search.location.geoValue).toBe("");
  });

  it("should scroll to all categories", () => {
    component.clearCategories();
    expect(component.hideCategories).toBe(true);
    expect(component.search.category).toBeNull();
    expect(component.search.label).toBeNull();
    expect(spyOnScroll).toHaveBeenCalled();
  });

  it("should toggle 'hideCategories'", () => {
    component.showCats();
    expect(component.hideCategories).toBe(true);
  });

  it("sould scroll to the top and set a category", () => {
    component.putTextCat(Categories.WELCOME.toString());
    expect(component.search.category).toBe(Categories.WELCOME);
    expect(component.search.label).toBe(
      translateService.instant(getCategoryTranslationKey(Categories.WELCOME))
    );
    expect(spyOnScroll).toHaveBeenCalled();
  });

  it("should launch a search on food category", () => {
    const spyOnNavigate = jest
      .spyOn(router, "navigate")
      .mockImplementation(() => Promise.resolve(true));

    component.search.location.geoValue = "paris";
    component.putTextCat(Categories.FOOD);
    component.launchSearch();

    expect(spyOnNavigate).toHaveBeenCalledWith([
      `/${SupportedLanguagesCode.FR}`,
      "search",
      component.search.location.geoValue,
      Categories.FOOD,
    ]);
  });
});
