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
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";

import { OrganizationUpdateCampaignBannerComponent } from "./organization-update-campaign-banner.component";

import { User } from "../../../users/classes/user.class";

import {
  CommonPosthogMockService,
  ORGANIZATION_MOCK,
  ONLINE_PLACE_MOCK,
  USER_PRO_MOCK,
} from "../../../../../../mocks";
import { PosthogService } from "../../../analytics/services/posthog.service";

ORGANIZATION_MOCK.places.push(ONLINE_PLACE_MOCK);

describe("OrganizationUpdateCampaignBannerComponent", () => {
  let component: OrganizationUpdateCampaignBannerComponent;
  let fixture: ComponentFixture<OrganizationUpdateCampaignBannerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [OrganizationUpdateCampaignBannerComponent],
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [
        { provide: APP_BASE_HREF, useValue: "/" },
        { provide: PosthogService, useClass: CommonPosthogMockService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(
      OrganizationUpdateCampaignBannerComponent
    );
    component = fixture.componentInstance;
    component.me = new User(USER_PRO_MOCK);
    component.organisation = ORGANIZATION_MOCK;
    fixture.detectChanges();
  });

  it("should be created", () => {
    expect(component).toBeTruthy();
  });
});
