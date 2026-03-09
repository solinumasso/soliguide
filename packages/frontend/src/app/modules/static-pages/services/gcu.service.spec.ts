import { TestBed } from "@angular/core/testing";

import { GcuService } from "./gcu.service";

describe("GcuService", () => {
  let service: GcuService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GcuService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
