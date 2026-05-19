import { TestBed } from "@angular/core/testing";

import { LegalNoticesService } from "./legal-notices.service";

describe("LegalNoticeService", () => {
  let service: LegalNoticesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LegalNoticesService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
