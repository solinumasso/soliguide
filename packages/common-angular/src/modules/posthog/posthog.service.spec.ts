import { TestBed } from "@angular/core/testing";

import posthog, { PostHog } from "posthog-js";
import { PosthogConfig } from "./posthog-config";
import { PosthogModule } from "./posthog.module";

import { PosthogService } from "./posthog.service";

jest.mock("posthog-js");

const mockedPosthog = posthog as jest.Mocked<PostHog>;

const baseConfig: PosthogConfig = {
  posthogUrl: "https://foo.bar",
  posthogLibraryName: "baz",
  soliguideApiUrl: "https://bar.foo",
};

describe("PosthogService", () => {
  afterEach(() => {
    mockedPosthog.init.mockClear();
  });

  it("should init posthog only when switching persistence", () => {
    TestBed.configureTestingModule({
      imports: [
        PosthogModule.forRoot({ ...baseConfig, posthogApiKey: "hello" }),
      ],
    });
    const service = TestBed.inject(PosthogService);
    expect(service).toBeTruthy();
    expect(service.enabled).toBe(false);

    expect(posthog.init).toHaveBeenCalledTimes(0);

    service.switchPersistence("memory");
    expect(service.enabled).toBe(true);
    expect(posthog.init).toHaveBeenCalledTimes(1);

    expect(posthog.init).toHaveBeenCalledWith(
      "hello",
      {
        api_host: baseConfig.posthogUrl,
        autocapture: false,
        capture_pageview: "history_change",
        capture_pageleave: false,
        persistence: "memory",
        disable_session_recording: true,
        debug: undefined,
        ip: false,
        rageclick: false,
        loaded: expect.any(Function),
        rate_limiting: {
          events_per_second: 3,
        },
        person_profiles: "always",
        sanitize_properties: undefined,
        session_idle_timeout_seconds: 1800,
      },
      baseConfig.posthogLibraryName
    );
  });

  it("should not init posthog", () => {
    TestBed.configureTestingModule({
      imports: [PosthogModule.forRoot(baseConfig)],
    });
    const service = TestBed.inject(PosthogService);
    expect(service).toBeTruthy();
    expect(service.enabled).toBeFalsy();
    expect(posthog.init).toHaveBeenCalledTimes(0);
  });
});
