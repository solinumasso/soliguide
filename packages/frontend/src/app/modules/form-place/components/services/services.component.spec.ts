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
import { DragDropModule } from "@angular/cdk/drag-drop";
import { APP_BASE_HREF } from "@angular/common";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { ToastrModule } from "ngx-toastr";
import { FormServicesFicheComponent } from "./services.component";
import { SERVICE_MOCK } from "../../../../../../mocks";

describe("FormServicesFicheComponent", () => {
  let component: FormServicesFicheComponent;
  let fixture: ComponentFixture<FormServicesFicheComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [FormServicesFicheComponent],
      imports: [
        DragDropModule,
        FormsModule,
        HttpClientTestingModule,
        NgbModule,
        TranslateModule.forRoot({}),
        ToastrModule.forRoot({}),
      ],
      providers: [{ provide: APP_BASE_HREF, useValue: "/" }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormServicesFicheComponent);
    component = fixture.componentInstance;
    component.services = [SERVICE_MOCK];
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("add a new service", () => {
    it("should create a new service", () => {
      component.newService();
      expect(component.services.length).toBe(2);
    });
  });

  describe("remove a service", () => {
    it("shouldn't delete the first service because it's the only one", () => {
      component.deleteService(0);
      expect(component.services.includes(SERVICE_MOCK)).toBe(true);
    });

    it("should remove the first service if we add a new before deleting the first one", () => {
      component.newService();
      component.deleteService(0);
      expect(component.services.includes(SERVICE_MOCK)).toBe(false);
    });
  });

  describe("show a service", () => {
    it("should set show to true for the first service", () => {
      component.showService(0);
      expect(component.services[0].show).toBe(true);
    });
  });

  it("should emit hasError", () => {
    jest.spyOn(component.isDescriptionInvalid, "emit");
    component.handleDescriptionError(true);
    expect(component.isDescriptionInvalid.emit).toBeCalledWith(true);
  });
});
