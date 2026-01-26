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
import { TranslateModule } from "@ngx-translate/core";
import { BehaviorSubject } from "rxjs";

import { SelectAvailableSourceComponent } from "./select-available-source.component";
import { User } from "../../../users/classes/user.class";
import { AuthService } from "../../../users/services/auth.service";
import { USER_SOLIGUIDE_MOCK } from "../../../../../../mocks/USER_SOLIGUIDE.mock";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { FormsModule } from "@angular/forms";

class MockAuthService {
  public currentUserSubject: BehaviorSubject<User | null>;

  constructor() {
    this.currentUserSubject = new BehaviorSubject<User | null>(
      USER_SOLIGUIDE_MOCK
    );
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }
}

describe("SelectAvailableSourceComponent", () => {
  let component: SelectAvailableSourceComponent;
  let fixture: ComponentFixture<SelectAvailableSourceComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SelectAvailableSourceComponent],
      imports: [
        FormsModule,
        HttpClientTestingModule,
        NgbModule,
        TranslateModule.forRoot(),
      ],
      providers: [
        { provide: APP_BASE_HREF, useValue: "/" },
        { provide: AuthService, useClass: MockAuthService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectAvailableSourceComponent);
    component = fixture.componentInstance;
    component.territories = ["22", "75"];
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should display 'custom_source_name'", () => {
    expect(component.stringToDisplay).toEqual("NONE");
    component.toggleCheckboxButton("custom_source_name");
    expect(component.stringToDisplay).toEqual("custom_source_name");
  });
});
