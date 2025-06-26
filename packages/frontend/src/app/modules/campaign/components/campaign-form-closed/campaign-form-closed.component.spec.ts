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
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterTestingModule } from "@angular/router/testing";

import { PlaceUpdateCampaign } from "@soliguide/common";

import { ToastrModule } from "ngx-toastr";

import { CampaignFormClosedComponent } from "./campaign-form-closed.component";

import { TranslateModule } from "@ngx-translate/core";

import {
  CommonPosthogMockService,
  ONLINE_PLACE_MOCK,
} from "../../../../../../mocks";
import { PosthogService } from "../../../analytics/services/posthog.service";

describe("CampaignFormClosedComponent", () => {
  let component: CampaignFormClosedComponent;
  let fixture: ComponentFixture<CampaignFormClosedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CampaignFormClosedComponent],
      imports: [
        BrowserAnimationsModule,
        FormsModule,
        HttpClientTestingModule,
        ReactiveFormsModule,
        RouterTestingModule,
        ToastrModule.forRoot({}),
        TranslateModule.forRoot({}),
      ],
      providers: [
        { provide: APP_BASE_HREF, useValue: "/" },
        { provide: PosthogService, useClass: CommonPosthogMockService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaignFormClosedComponent);
    component = fixture.componentInstance;
    component.place = ONLINE_PLACE_MOCK;
    component.place.campaigns.runningCampaign = new PlaceUpdateCampaign({
      toUpdate: true,
    });
    component.place.campaigns.runningCampaign.sections.tempClosure = {
      changes: false,
      date: null,
      updated: false,
    };
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
