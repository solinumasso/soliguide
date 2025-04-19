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
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { SharedModule } from "../../../../shared/shared.module";
import { SingleContactComponent } from "./single-contact.component";
import { PosthogService } from "../../../../analytics/services/posthog.service";
import { CommonPosthogMockService } from "../../../../../../../mocks";
import { CountryCodes } from "@soliguide/common";
import { FormatInternationalPhoneNumberPipe } from "../../../../shared";

describe("SingleContactComponent", () => {
  let component: SingleContactComponent;
  let fixture: ComponentFixture<SingleContactComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SingleContactComponent],
      imports: [SharedModule, FormatInternationalPhoneNumberPipe],
      providers: [
        { provide: PosthogService, useClass: CommonPosthogMockService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleContactComponent);
    component = fixture.componentInstance;
    component.contact = {
      lastname: "Pro",
      mail: "contact-pro@structure-social.fr",
      name: "Contact",
      phone: {
        phoneNumber: "0606060606",
        countryCode: CountryCodes.FR,
        isSpecialPhoneNumber: false,
        label: null,
      },
      title: "Contact pro",
    };
    fixture.detectChanges();
  });

  it("should be created", () => {
    expect(component).toBeTruthy();
  });
});
