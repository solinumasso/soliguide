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
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { TranslateModule } from "@ngx-translate/core";

import { TempInfoType } from "@soliguide/common";

import { addDays, subDays } from "date-fns";

import { DisplayTempBannerComponent } from "./display-temp-banner.component";

import { DateService } from "../../services/date.service";

import { BasePlaceTempInfos } from "../../../../models/place/classes/temp-infos";
import { PosthogService } from "../../../analytics/services/posthog.service";
import { CommonPosthogMockService } from "../../../../../../mocks";

const today = new Date();
const oneWeekLater = new Date(today);
const yesterday = new Date(today);

oneWeekLater.setDate(today.getDate() + 7);
yesterday.setDate(today.getDate() - 1);

describe("DisplayTempBannerComponent", () => {
  let component: DisplayTempBannerComponent;
  let fixture: ComponentFixture<DisplayTempBannerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DisplayTempBannerComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        DateService,
        { provide: PosthogService, useClass: CommonPosthogMockService },
      ],
      imports: [TranslateModule.forRoot()],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayTempBannerComponent);
    component = fixture.componentInstance;
    component.tempInfos = new BasePlaceTempInfos({
      dateDebut: subDays(new Date(), 1),
      dateFin: addDays(new Date(), 8),
      hours: null,
    });

    component.tempInfoType = TempInfoType.hours;
    fixture.detectChanges();
  });

  it("should be created", () => {
    expect(component).toBeTruthy();
  });

  it("should toggle temporary hours", () => {
    expect(component.tempInfos.actif).toBe(true);
    expect(component.tempInfos.infoColor).toBe("danger");

    component.toogleDisplayTempHours(true);
    expect(component.displayTempHours).toBe(true);
  });
});
