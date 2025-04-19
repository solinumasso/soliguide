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

import { SearchMapComponent } from "./search-map.component";

describe("SearchMapComponent", () => {
  let component: SearchMapComponent;
  let fixture: ComponentFixture<SearchMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SearchMapComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchMapComponent);
    component = fixture.componentInstance;
    component.scrollOnClick = false;
    component.markers = [
      {
        lat: 48.8838122,
        lng: 2.3342526000000134,
        options: {
          icon: {
            url: "../../../../../assets/images/maps/18.png",
            scaledSize: {
              height: 32,
              width: 23,
            },
          },
          id: 44,
          title:
            "Centre d'accueil et de distribution alimentaire Restos du Coeur 18ème Coustou",
        },
      },
    ];
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
