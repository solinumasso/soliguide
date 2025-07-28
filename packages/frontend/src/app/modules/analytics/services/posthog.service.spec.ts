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
import { PosthogService as CommonPosthogService } from "@soliguide/common-angular";

import { CommonPosthogMockService } from "../../../../../mocks/CommonPosthogMockService.mock";
import { PosthogService } from "./posthog.service";
import { TranslateModule } from "@ngx-translate/core";

describe("PosthogService", () => {
  let posthogMock: CommonPosthogMockService;

  beforeEach(() => {
    posthogMock = new CommonPosthogMockService();
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [{ provide: CommonPosthogService, useValue: posthogMock }],
    });
  });

  afterEach(() => jest.clearAllMocks());

  it("should be created", () => {
    const posthogService = TestBed.inject(PosthogService);
    expect(posthogService).toBeTruthy();
  });

  describe("capture", () => {
    it("should not propagate the event to the common posthog service when not enabled", () => {
      posthogMock.enabled = false;
      const posthogService = TestBed.inject(PosthogService);
      posthogService.capture("plop", { hello: "world" });
      expect(posthogMock.mockInstance).not.toHaveBeenCalled();
    });

    it("should capture an event", () => {
      posthogMock.enabled = true;
      const posthogService = TestBed.inject(PosthogService);
      posthogService.capture("plop", { hello: "world" });
      expect(posthogMock.mockInstance).toHaveBeenCalledTimes(1);
      expect(posthogMock.mockInstance).toHaveBeenCalledWith("frontend-plop", {
        hello: "world",
      });
    });
  });
});
