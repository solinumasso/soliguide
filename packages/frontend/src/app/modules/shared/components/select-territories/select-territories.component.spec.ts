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
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { TranslateModule } from "@ngx-translate/core";
import { BehaviorSubject } from "rxjs";
import { SelectTerritoriesComponent } from "./select-territories.component";
import { User } from "../../../users/classes/user.class";
import { AuthService } from "../../../users/services/auth.service";
import { USER_SOLIGUIDE_MOCK } from "../../../../../../mocks/USER_SOLIGUIDE.mock";
import { THEME_CONFIGURATION } from "../../../../models";
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

describe("SelectTerritoriesComponent", () => {
  let component: SelectTerritoriesComponent;
  let fixture: ComponentFixture<SelectTerritoriesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SelectTerritoriesComponent],
      imports: [FormsModule, NgbModule, TranslateModule.forRoot({})],
      providers: [
        { provide: APP_BASE_HREF, useValue: "/" },
        { provide: AuthService, useClass: MockAuthService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectTerritoriesComponent);
    component = fixture.componentInstance;
    component.territories = ["67"];
    component.country = THEME_CONFIGURATION.country;

    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should display 'ALL_DEPARTMENTS'", () => {
    component.selectAll();
    expect(component.stringToDisplay).toEqual("ALL_DEPARTMENTS");
  });

  it("should display 'Bas-Rhin, Paris'", () => {
    component.toggleCheckboxButton("75");
    expect(component.stringToDisplay).toEqual("Bas-Rhin, Paris");
  });

  it("should toggle 'Bas-Rhin'", () => {
    component.toggleCheckboxButton("67");
    expect(component.localTerritories).toEqual([]);
    component.toggleCheckboxButton("67");
    expect(component.localTerritories).toEqual(["67"]);
  });

  it("should filter the departments list", () => {
    component.filter = "40";
    component.filterDepartements();
    fixture.detectChanges();
    expect(component.departments).toEqual([
      {
        departmentCode: "40",
        departmentName: "Landes",
        isoCode: "FR-40",
        regionCode: "75",
        slug: "nouvelle-aquitaine",
        coordinates: [-0.585044, 43.812626],
        regionName: "Nouvelle-Aquitaine",
        schoolZoneShortName: "ZA",
        timeZone: "Europe/Paris",
      },
    ]);
  });
});
