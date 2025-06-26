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
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterTestingModule } from "@angular/router/testing";

import { TranslateModule } from "@ngx-translate/core";

import {
  Categories,
  PlaceUpdateCampaign,
  BasePlaceTempInfo,
} from "@soliguide/common";

import { ToastrModule } from "ngx-toastr";

import { CampaignFormServicesComponent } from "./campaign-form-services.component";

import {
  CommonPosthogMockService,
  ONLINE_PLACE_MOCK,
  SERVICE_MOCK,
} from "../../../../../../mocks";

import { Place, Service } from "../../../../models/place/classes";
import { PosthogService } from "../../../analytics/services/posthog.service";

describe("FormCampaignServicesComponent", () => {
  let component: CampaignFormServicesComponent;
  let fixture: ComponentFixture<CampaignFormServicesComponent>;

  const c1 = {
    actif: true,
    dateDebut: null,
    dateFin: null,
  };

  const c2 = {
    actif: true,
    dateDebut: new Date(2021, 5, 21),
    dateFin: new Date(2021, 4, 21),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CampaignFormServicesComponent],
      imports: [
        RouterTestingModule,
        ToastrModule.forRoot({}),
        HttpClientTestingModule,
        ReactiveFormsModule,
        FormsModule,
        TranslateModule.forRoot({}),
        BrowserAnimationsModule,
      ],
      providers: [
        { provide: APP_BASE_HREF, useValue: "/" },
        { provide: PosthogService, useClass: CommonPosthogMockService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaignFormServicesComponent);
    component = fixture.componentInstance;
    component.place = ONLINE_PLACE_MOCK;
    component.place.services_all = [SERVICE_MOCK];
    component.closeServiceForm = [
      {
        categorySpecificFields: "",
        category: Categories.PUBLIC_WRITER,
        close: new BasePlaceTempInfo(c1),
        serviceObjectId: SERVICE_MOCK.serviceObjectId,
      },
    ];
    component.place.campaigns.runningCampaign = new PlaceUpdateCampaign({
      toUpdate: true,
    });
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should submit", () => {
    component.submitTempService();
  });

  it("should be invalid", () => {
    expect(component.loading).toBeFalsy();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaignFormServicesComponent);
    component = fixture.componentInstance;
    component.place = new Place();
    component.place.services_all = [new Service()];
    component.closeServiceForm = [
      {
        categorySpecificFields: "",
        category: Categories.DISABILITY_ADVICE,
        close: new BasePlaceTempInfo(c2),
        serviceObjectId: component.place.services_all[0].serviceObjectId,
      },
    ];
    component.place.campaigns.runningCampaign = new PlaceUpdateCampaign({
      toUpdate: true,
    });
    fixture.detectChanges();
  });

  it("should submit", () => {
    component.submitTempService();
  });

  it("should be invalid", () => {
    expect(component.loading).toBeFalsy();
  });
});
