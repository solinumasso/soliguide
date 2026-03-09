import { TestBed } from "@angular/core/testing";

import { MockAuthService } from "../../../../../mocks";
import { environment } from "../../../../environments/environment";
import { AuthService } from "../../users/services/auth.service";
import { SentryService } from "./sentry.service";

describe("SentryService", () => {
  let service: SentryService;

  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [{ provide: AuthService, useClass: MockAuthService }],
    })
  );

  it("should be created", () => {
    service = TestBed.inject(SentryService);
    expect(service).toBeTruthy();
  });

  describe("test conditional sentry init", () => {
    let sentryDsn: string | undefined;

    beforeEach(() => {
      sentryDsn = environment.sentryDsn;
    });
    afterEach(() => {
      environment.sentryDsn = sentryDsn;
    });

    it("should not init sentry", () => {
      delete environment.sentryDsn;
      service = TestBed.inject(SentryService);
      expect(service).toBeTruthy();
    });
  });
});
