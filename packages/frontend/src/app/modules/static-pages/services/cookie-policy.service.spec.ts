import { TestBed } from "@angular/core/testing";

import { CookiePolicyService } from "./cookie-policy.service";

describe("CookiePolicyService", () => {
  let service: CookiePolicyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CookiePolicyService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
