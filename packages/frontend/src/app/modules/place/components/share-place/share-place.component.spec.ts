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
import { ToastrModule } from "ngx-toastr";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { SharePlaceComponent } from "./share-place.component";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { TranslateModule } from "@ngx-translate/core";
import { SharedModule } from "../../../shared/shared.module";
import { PLACE_EN_LIGNE_MOCK } from "../../../../../../mocks/PLACE_EN_LIGNE.mock";
import { PosthogService } from "../../../analytics/services/posthog.service";
import { CommonPosthogMockService } from "../../../../../../mocks";
import { ShareButtons } from "ngx-sharebuttons/buttons";

describe("SharePlaceComponent", () => {
  let component: SharePlaceComponent;
  let fixture: ComponentFixture<SharePlaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SharePlaceComponent],
      imports: [
        TranslateModule.forRoot(),
        SharedModule,
        ToastrModule.forRoot({}),
        NgbModule,
        ShareButtons,
        HttpClientTestingModule,
      ],
      providers: [
        { provide: PosthogService, useClass: CommonPosthogMockService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SharePlaceComponent);
    component = fixture.componentInstance;
    component.place = PLACE_EN_LIGNE_MOCK;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
