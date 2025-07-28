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
import { TranslateModule } from "@ngx-translate/core";
import { APP_BASE_HREF } from "@angular/common";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ActivatedRoute, RouterModule } from "@angular/router";
import { ToastrModule } from "ngx-toastr";
import { of } from "rxjs";

import { TempInfoType } from "@soliguide/common";

import { CommonPosthogMockService } from "../../../../../../../mocks";
import { ParentTempInfosFormComponent } from "./parent-temp-infos-form.component";
import { PosthogService } from "../../../../analytics/services/posthog.service";
import { THEME_CONFIGURATION } from "../../../../../models";

describe("ParentTempInfosFormComponent", () => {
  let component: ParentTempInfosFormComponent;
  let fixture: ComponentFixture<ParentTempInfosFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ParentTempInfosFormComponent],
      imports: [
        BrowserAnimationsModule,
        FormsModule,
        HttpClientTestingModule,
        ReactiveFormsModule,
        RouterModule.forRoot([]),
        ToastrModule.forRoot({}),
        TranslateModule.forRoot({}),
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({
              lieu_id: "10",
              tempInfoType: TempInfoType.CLOSURE,
            }),
          },
        },
        {
          provide: APP_BASE_HREF,
          useValue: `/${THEME_CONFIGURATION.defaultLanguage}`,
        },
        { provide: PosthogService, useClass: CommonPosthogMockService },
      ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
        // For CKEditor
        NO_ERRORS_SCHEMA,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParentTempInfosFormComponent);
    component = fixture.componentInstance;
    component.tempInfoType = TempInfoType.CLOSURE;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
