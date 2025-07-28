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
import { RouterModule } from "@angular/router";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { TranslateModule } from "@ngx-translate/core";
import { of } from "rxjs";
import { CountUpModule } from "ngx-countup";

import { SupportedLanguagesCode } from "@soliguide/common";

import { HomeTerritoriesStatsComponent } from "./home-territories-stats.component";
import { CurrentLanguageService } from "../../services/current-language.service";
import { GeneralService } from "../../services/general.services";
import { PosthogService } from "../../../analytics/services/posthog.service";
import { CommonPosthogMockService } from "../../../../../../mocks";

describe("HomeTerritoriesStatsComponent", () => {
  let component: HomeTerritoriesStatsComponent;
  let fixture: ComponentFixture<HomeTerritoriesStatsComponent>;
  let currentLanguageService: CurrentLanguageService;
  let generalService: GeneralService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [HomeTerritoriesStatsComponent],
      imports: [
        CountUpModule,
        HttpClientTestingModule,
        NgbModule,
        RouterModule.forRoot([]),
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
    fixture = TestBed.createComponent(HomeTerritoriesStatsComponent);
    currentLanguageService = TestBed.inject(CurrentLanguageService);
    jest
      .spyOn(currentLanguageService, "currentLanguage", "get")
      .mockReturnValue(SupportedLanguagesCode.FR);
    generalService = TestBed.inject(GeneralService);
    jest.spyOn(generalService, "statsAll").mockReturnValue(of(23000));
    jest.spyOn(generalService, "statsServices").mockReturnValue(of(63000));
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
    expect(component.routePrefix).toBe(`/${SupportedLanguagesCode.FR}`);
    expect(component.statsTotal).toBe(23000);
    expect(component.statsServices).toBe(63000);
  });
});
