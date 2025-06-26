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
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { RouterTestingModule } from "@angular/router/testing";
import { ToastrModule } from "ngx-toastr";
import { TranslateModule } from "@ngx-translate/core";
import { of } from "rxjs";

import { DeletePlaceComponent } from "./delete-place.component";
import { ManagePlacesService } from "../../services/manage-places.service";
import { AuthService } from "../../../users/services/auth.service";
import { MockAuthService } from "../../../../../../mocks/MockAuthService";
import { Place } from "../../../../models/place/classes/place.class";
import {
  ONLINE_PLACE_MOCK,
  PAIRED_ONLINE_PLACE_MOCK,
} from "../../../../../../mocks";

class MockManagePlacesService {
  deletePlace() {
    return of(null);
  }
  deletePair() {
    return of(null);
  }
}

describe("DeletePlaceComponent", () => {
  let component: DeletePlaceComponent;
  let fixture: ComponentFixture<DeletePlaceComponent>;
  let managePlacesService: ManagePlacesService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DeletePlaceComponent],
      imports: [
        RouterTestingModule,
        ToastrModule.forRoot(),
        TranslateModule.forRoot(),
      ],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: ManagePlacesService, useClass: MockManagePlacesService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeletePlaceComponent);
    component = fixture.componentInstance;
    managePlacesService = TestBed.inject(ManagePlacesService);

    component.user = TestBed.inject(AuthService).currentUserValue;
  });

  it("should create", () => {
    component.place = new Place(ONLINE_PLACE_MOCK);
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it("should delete with ONLINE_PLACE", () => {
    component.place = new Place(ONLINE_PLACE_MOCK);
    fixture.detectChanges();

    const deletePlaceSpy = jest.spyOn(managePlacesService, "deletePlace");
    const deletePairSpy = jest.spyOn(managePlacesService, "deletePair");

    component.deletePlace();

    expect(deletePairSpy).toHaveBeenCalledWith(component.place.lieu_id);
    expect(deletePlaceSpy).toHaveBeenCalledWith(component.place.lieu_id);
  });

  it("should delete with ONLINE_PAIRED_PLACE", () => {
    component.place = new Place(PAIRED_ONLINE_PLACE_MOCK);
    fixture.detectChanges();

    const deletePlaceSpy = jest.spyOn(managePlacesService, "deletePlace");
    const deletePairSpy = jest.spyOn(managePlacesService, "deletePair");

    component.deletePlace();

    expect(deletePairSpy).toHaveBeenCalledWith(component.place.lieu_id);
    expect(deletePlaceSpy).toHaveBeenCalledWith(component.place.lieu_id);
  });
});
