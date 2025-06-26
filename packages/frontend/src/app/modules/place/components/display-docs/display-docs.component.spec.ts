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
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { DisplayDocsComponent } from "./display-docs.component";
import { ToastrModule } from "ngx-toastr";
import { ONLINE_PLACE_MOCK } from "../../../../../../mocks/ONLINE_PLACE.mock";
import { TranslateModule } from "@ngx-translate/core";
import { PosthogService } from "../../../analytics/services/posthog.service";
import { CommonPosthogMockService } from "../../../../../../mocks";

describe("DisplayDocsComponent", () => {
  let component: DisplayDocsComponent;
  let fixture: ComponentFixture<DisplayDocsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ToastrModule.forRoot({}),
        HttpClientTestingModule,
        TranslateModule.forRoot({}),
      ],
      declarations: [DisplayDocsComponent],
      providers: [
        { provide: PosthogService, useClass: CommonPosthogMockService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayDocsComponent);
    component = fixture.componentInstance;
    component.docs = ONLINE_PLACE_MOCK.modalities.docs;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
