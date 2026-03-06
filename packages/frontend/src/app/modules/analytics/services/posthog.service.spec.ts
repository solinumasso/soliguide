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
