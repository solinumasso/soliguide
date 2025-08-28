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
import { RouterTestingModule } from "@angular/router/testing";

import posthog, { PostHog } from "posthog-js";
import { PosthogConfig } from "./posthog-config";
import { PosthogModule } from "./posthog.module";

import { PosthogService } from "./posthog.service";

jest.mock("posthog-js");

const mockedPosthog = posthog as jest.Mocked<PostHog>;

const baseConfig: PosthogConfig = {
  posthogUrl: "https://foo.bar",
  posthogLibraryName: "baz",
  soliguideApiUrl: "https://bar.foo/",
};

describe("PosthogService", () => {
  afterEach(() => {
    mockedPosthog.init.mockClear();
  });

  it("should init posthog", () => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        PosthogModule.forRoot({ ...baseConfig, posthogApiKey: "hello" }),
      ],
    });
    const service = TestBed.inject(PosthogService);
    expect(service).toBeTruthy();
    expect(service.enabled).toBeTruthy();
    expect(posthog.init).toHaveBeenCalledTimes(1);
    expect(posthog.init).toHaveBeenCalledWith(
      "hello",
      {
        api_host: baseConfig.posthogUrl,
        autocapture: false,
        persistence: "memory",
        disable_session_recording: false,
        debug: undefined,
        ip: false,
        loaded: expect.any(Function),
        sanitize_properties: undefined,
        session_idle_timeout_seconds: 1800,
        session_recording: {
          maskAllInputs: true,
          maskTextSelector: "*",
          maskTextFn: expect.any(Function),
        },
      },
      baseConfig.posthogLibraryName
    );
  });

  it("should not init posthog", () => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, PosthogModule.forRoot(baseConfig)],
    });
    const service = TestBed.inject(PosthogService);
    expect(service).toBeTruthy();
    expect(service.enabled).toBeFalsy();
    expect(posthog.init).toHaveBeenCalledTimes(0);
  });
});
