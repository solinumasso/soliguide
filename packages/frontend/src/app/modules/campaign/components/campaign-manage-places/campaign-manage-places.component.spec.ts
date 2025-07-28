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
import { APP_BASE_HREF, ViewportScroller } from "@angular/common";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ActivatedRoute, RouterModule } from "@angular/router";

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { ToastrModule } from "ngx-toastr";

import { of } from "rxjs";

import { CampaignManagePlacesComponent } from "./campaign-manage-places.component";

import { CampaignService } from "../../services/campaign.service";

import { PosthogService } from "../../../analytics/services/posthog.service";

import { AuthService } from "../../../users/services/auth.service";

import { Place } from "../../../../models/place/classes";

import { globalConstants } from "../../../../shared/functions/global-constants.class";

import { ONLINE_PLACE_MOCK } from "../../../../../../mocks/ONLINE_PLACE.mock";
import { USER_PRO_MOCK } from "../../../../../../mocks/USER_PRO.mock";
import { CommonPosthogMockService } from "../../../../../../mocks/CommonPosthogMockService.mock";
import { MockAuthService } from "../../../../../../mocks/MockAuthService";
import { TranslateModule } from "@ngx-translate/core";
import { User } from "../../../users/classes";
import { SharedModule } from "../../../shared";
import { registerLocales } from "../../../../shared/functions/registerLocales";

const PLACES: Place[] = [];

PLACES.push(ONLINE_PLACE_MOCK);
PLACES.push(ONLINE_PLACE_MOCK);

PLACES[1]._id = "614bb2f678fc0312c43e585a";
PLACES[1].lieu_id += 10;
PLACES[1].seo_url = "place-en-ligne-de-test-14280";

describe("CampaignManagePlacesComponent", () => {
  let component: CampaignManagePlacesComponent;
  let fixture: ComponentFixture<CampaignManagePlacesComponent>;
  let viewPortScroller: ViewportScroller;
  let campaignService: CampaignService;

  beforeAll(() => {
    registerLocales();
  });

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CampaignManagePlacesComponent],
      imports: [
        BrowserAnimationsModule,
        FormsModule,
        HttpClientTestingModule,
        NgbModule,
        ReactiveFormsModule,
        RouterModule.forRoot([]),
        SharedModule,
        ToastrModule.forRoot({}),
        TranslateModule.forRoot(),
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              params: {
                lieu_id: "54",
              },
            },
          },
        },
        { provide: AuthService, useClass: MockAuthService },
        { provide: APP_BASE_HREF, useValue: "/" },
        { provide: PosthogService, useClass: CommonPosthogMockService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaignManagePlacesComponent);
    viewPortScroller = TestBed.inject(ViewportScroller);
    campaignService = TestBed.inject(CampaignService);
    jest
      .spyOn(campaignService, "getPlacesForCampaign")
      .mockReturnValue(of(PLACES));

    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it("should create", () => {
    component.me = new User(USER_PRO_MOCK);
    expect(component).toBeTruthy();
  });

  it("scroll to the place #1", () => {
    component.me = new User(USER_PRO_MOCK);
    PLACES[0].updatedByUserAt = new Date();
    PLACES[0].campaigns.runningCampaign.general.updated = true;
    PLACES[0].campaigns.runningCampaign.general.startDate =
      PLACES[0].updatedByUserAt;
    PLACES[0].campaigns.runningCampaign.general.endDate =
      PLACES[0].updatedByUserAt;

    PLACES[1].updatedByUserAt = new Date(2021, 5, 3);
    PLACES[1].campaigns.runningCampaign.remindMeDate = new Date(2021, 5, 5);

    globalConstants.setItem("lastCampaignPosition", "100");

    const spy = jest.spyOn(viewPortScroller, "scrollToAnchor");

    fixture.detectChanges();

    expect(spy).toHaveBeenCalled();
  });

  it("should set a remind me for place #3", () => {
    PLACES.push(ONLINE_PLACE_MOCK);

    PLACES[2]._id = "614bb2f678fc0312c43e5860";
    PLACES[2].lieu_id += 20;
    PLACES[2].seo_url = "place-en-ligne-de-test-14290";
    PLACES[2].campaigns.runningCampaign.remindMeDate = new Date(1, 9, 2021);

    component.selectedPlace = PLACES[2];
    component.remindMeDate = "2021-10-01";

    jest
      .spyOn(campaignService, "setRemindMeLater")
      .mockReturnValue(of(PLACES[2]));

    component.setRemindMeLater();

    expect(component.selectedPlace).toBeNull();
  });
});
