import { TestBed } from "@angular/core/testing";

import { SearchBarService } from "./search-bar.service";
import { HttpClientTestingModule } from "@angular/common/http/testing";

describe("SearchBarService", () => {
  let service: SearchBarService;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    service = TestBed.inject(SearchBarService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
