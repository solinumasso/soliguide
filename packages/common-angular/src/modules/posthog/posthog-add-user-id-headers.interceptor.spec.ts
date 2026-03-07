import { TestBed } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { HTTP_INTERCEPTORS, HttpClient } from "@angular/common/http";
import { PosthogConfig } from "./posthog-config";
import { PosthogService } from "./posthog.service";
import { of } from "rxjs";
import { PosthogAddUserIdHeadersInterceptor } from "./posthog-add-user-id-headers.interceptor";

describe("PosthogAddUserIdHeadersInterceptor", () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: PosthogService,
          useValue: {
            enabled: true,
            getUserDistinctId: () => of("some-distinct-id"),
            getUserSessionId: () => of("some-session-id"),
          },
        },
        {
          provide: PosthogConfig,
          useValue: { soliguideApiUrl: "http://api.soliguide.fr" },
        },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: PosthogAddUserIdHeadersInterceptor,
          multi: true,
        },
      ],
    });

    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should add "X-Ph-User-Distinct-Id" and "X-Ph-User-Session-Id" headers when Posthog is enabled and URL matches', () => {
    httpClient.get("http://api.soliguide.fr/place/1").subscribe();
    const req = httpTestingController.expectOne(
      "http://api.soliguide.fr/place/1"
    );

    expect(req.request.headers.has("X-Ph-User-Distinct-Id")).toEqual(true);
    expect(req.request.headers.get("X-Ph-User-Distinct-Id")).toBe(
      "some-distinct-id"
    );

    expect(req.request.headers.has("X-Ph-User-Session-Id")).toEqual(true);
    expect(req.request.headers.get("X-Ph-User-Session-Id")).toBe(
      "some-session-id"
    );

    req.flush({});
  });

  it("should not add headers when Posthog is disabled", () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: PosthogService,
          useValue: {
            enabled: false,
            getUserDistinctId: () => of("some-distinct-id"),
            getUserSessionId: () => of("some-session-id"),
          },
        },
        {
          provide: PosthogConfig,
          useValue: { soliguideApiUrl: "http://api.soliguide.fr" },
        },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: PosthogAddUserIdHeadersInterceptor,
          multi: true,
        },
      ],
    });

    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);

    httpClient.get("http://api.soliguide.fr/place/1").subscribe();
    const req = httpTestingController.expectOne(
      "http://api.soliguide.fr/place/1"
    );

    expect(req.request.headers.has("X-Ph-User-Distinct-Id")).toEqual(false);
    expect(req.request.headers.has("X-Ph-User-Session-Id")).toEqual(false);

    req.flush({});
  });

  it("should not add headers when URL does not match", () => {
    httpClient.get("http://api.otherurl.com/place/1").subscribe();
    const req = httpTestingController.expectOne(
      "http://api.otherurl.com/place/1"
    );

    expect(req.request.headers.has("X-Ph-User-Distinct-Id")).toEqual(false);
    expect(req.request.headers.has("X-Ph-User-Session-Id")).toEqual(false);

    req.flush({});
  });
});
