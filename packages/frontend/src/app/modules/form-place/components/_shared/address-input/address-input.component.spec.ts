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
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TranslateModule } from "@ngx-translate/core";
import { ToastrModule } from "ngx-toastr";
import { AddressInputComponent } from "./address-input.component";
import { PlacePosition } from "../../../../../models";
import { AuthService } from "../../../../users/services/auth.service";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "../../../../shared/shared.module";
import { APP_BASE_HREF, CommonModule } from "@angular/common";
import { LocationService } from "../../../../shared/services";
import {
  CommonPosthogMockService,
  MockAuthService,
} from "../../../../../../../mocks";
import { PosthogService } from "../../../../analytics/services/posthog.service";
import { LocationAutocompleteComponent } from "../../../../shared/components/location-autocomplete/location-autocomplete.component";

describe("AddressInputComponent", () => {
  let component: AddressInputComponent;
  let fixture: ComponentFixture<AddressInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddressInputComponent],
      imports: [
        CommonModule,
        FormsModule,
        HttpClientTestingModule,
        LocationAutocompleteComponent,
        ReactiveFormsModule,
        SharedModule,
        ToastrModule.forRoot(),
        TranslateModule.forRoot(),
      ],
      providers: [
        LocationService,
        { provide: APP_BASE_HREF, useValue: "/" },
        { provide: PosthogService, useClass: CommonPosthogMockService },
        { provide: AuthService, useClass: MockAuthService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddressInputComponent);
    component = fixture.componentInstance;

    component.position = new PlacePosition();
    component.title = "";
    component.titleError = "";

    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
