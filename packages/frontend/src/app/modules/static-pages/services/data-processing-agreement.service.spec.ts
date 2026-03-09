import { TestBed } from "@angular/core/testing";

import { DataProcessingAgreementService } from "./data-processing-agreement.service";

describe("DataProcessingAgreementService", () => {
  let service: DataProcessingAgreementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataProcessingAgreementService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
