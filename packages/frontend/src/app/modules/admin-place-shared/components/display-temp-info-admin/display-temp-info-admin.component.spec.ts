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
import { type ComponentFixture, TestBed } from "@angular/core/testing";

import { TempInfoType, TempInfoStatus } from "@soliguide/common";

import { DisplayTempInfoAdminComponent } from "./display-temp-info-admin.component";

import { SharedModule } from "../../../shared/shared.module";
import { ONLINE_PLACE_MOCK } from "../../../../../../mocks";
import { Place } from "../../../../models";

describe("DisplayTempInfoAdminComponent", () => {
  let component: DisplayTempInfoAdminComponent;
  let fixture: ComponentFixture<DisplayTempInfoAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DisplayTempInfoAdminComponent],
      imports: [SharedModule, TranslateModule.forRoot({})],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayTempInfoAdminComponent);
    component = fixture.componentInstance;

    component.tempInfo = {
      _id: "xxx",
      name: null,
      description: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      tempInfoType: TempInfoType.CLOSURE,
      status: TempInfoStatus.CURRENT,
      placeId: 1,
      dateDebut: new Date(2021, 5, 21),
      dateFin: new Date(2021, 4, 21),
      place: new Place(ONLINE_PLACE_MOCK),
      actif: true,
      isCampaign: false,
    };
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
