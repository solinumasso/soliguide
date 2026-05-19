import { TestBed } from "@angular/core/testing";
import { MockAuthService } from "../../../../../mocks";
import { AuthService } from "../../users/services/auth.service";
import { CookieManagerService } from "./cookie-manager.service";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";

describe("CookieManagerService", () => {
  let service: CookieManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        HttpClientTestingModule,
        NgbModule,
        TranslateModule.forRoot(),
      ],
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
