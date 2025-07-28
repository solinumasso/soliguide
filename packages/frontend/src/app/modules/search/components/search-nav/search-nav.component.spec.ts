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
import { RouterModule } from "@angular/router";

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { TranslateModule } from "@ngx-translate/core";

import {
  PublicsAdministrative,
  SupportedLanguagesCode,
} from "@soliguide/common";

import { ToastrModule } from "ngx-toastr";
import { SearchNavComponent } from "./search-nav.component";
import { Search } from "../../interfaces";
import { CommonPosthogMockService } from "../../../../../../mocks";
import { PosthogService } from "../../../analytics/services/posthog.service";
import { CategoryTranslateKeyPipe } from "../../../shared/pipes";

describe("SearchNavComponent", () => {
  let component: SearchNavComponent;
  let fixture: ComponentFixture<SearchNavComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SearchNavComponent, CategoryTranslateKeyPipe],
      imports: [
        HttpClientTestingModule,
        NgbModule,
        RouterModule.forRoot([]),
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
    fixture = TestBed.createComponent(SearchNavComponent);
    component = fixture.componentInstance;
    component.search = new Search({
      languages: SupportedLanguagesCode.UK,
      modalities: { inconditionnel: true },
      publics: { administrative: [PublicsAdministrative.refugee] },
    });
    fixture.detectChanges();
  });

  it("should be created", () => {
    expect(component).toBeTruthy();
  });
});
