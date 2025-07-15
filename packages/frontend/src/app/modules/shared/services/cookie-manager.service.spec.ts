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
import { TestBed } from "@angular/core/testing";
import { MockAuthService } from "../../../../../mocks";
import { AuthService } from "../../users/services/auth.service";
import { CookieManagerService } from "./cookie-manager.service";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

describe("CookieManagerService", () => {
  let service: CookieManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, HttpClientTestingModule, NgbModule],
      providers: [
        CookieManagerService,
        { provide: AuthService, useClass: MockAuthService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    });

    let store = {};
    global.localStorage = {
      getItem: (key: string): string => {
        return key in store ? store[key] : null;
      },
      setItem: (key: string, value: string) => {
        // We have to handle this case because silktide stores boolean in localStorage
        if (value === "true") {
          store[key] = true;
        } else if (value === "false") {
          store[key] = false;
        } else {
          store[key] = `${value}`;
        }
      },
      removeItem: (key: string) => {
        delete store[key];
      },
      clear: () => {
        store = {};
      },
    } as unknown as Storage;
  });

  it("should be created", () => {
    service = TestBed.inject(CookieManagerService);
    expect(service).toBeTruthy();

    expect(service.analyticsConsentSubject.value).toBe(false);
    expect(service.chatConsentSubject.value).toBe(false);
  });

  describe("Init consent when value is stored in the local storage", () => {
    it("should set consent to true if it is present in local storage", () => {
      localStorage.setItem("silktideCookieChoice_analytics", "true");
      localStorage.setItem("silktideCookieChoice_chat", "true");

      service = TestBed.inject(CookieManagerService);

      expect(service.analyticsConsentSubject.value).toBe(true);
      expect(service.chatConsentSubject.value).toBe(true);
    });
  });
});
