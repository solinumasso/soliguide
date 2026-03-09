import { TestBed } from "@angular/core/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";

import { SoligareSearchService } from "./soligare-search.service";

describe("SoligareSearchService", () => {
  let service: SoligareSearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [],
    });
    service = TestBed.inject(SoligareSearchService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
