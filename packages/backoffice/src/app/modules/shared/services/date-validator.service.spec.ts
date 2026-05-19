import { TestBed } from "@angular/core/testing";
import { ToastrModule } from "ngx-toastr";
import { TranslateModule } from "@ngx-translate/core";

import { DateValidatorService } from "./date-validator.service";

describe("DateValidatorService", () => {
  let service: DateValidatorService;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [ToastrModule.forRoot({}), TranslateModule.forRoot({})],
      providers: [DateValidatorService],
    });
    service = TestBed.inject(DateValidatorService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should return false since d2 before d1", () => {
    const d1 = new Date();
    const d2 = new Date();
    d2.setDate(d1.getDate() - 1);
    expect(service.compareDate(d1, d2)).toBe(false);
    expect(service.validDate(d1, d2)).toBe(false);
  });

  it("should return true since d1 before d2", () => {
    const d1 = new Date();
    const d2 = new Date();
    d2.setDate(d1.getDate() + 1);
    expect(service.compareDate(d1, d2)).toBe(true);
    expect(service.validDate(d1, d2)).toBe(true);
  });

  it("should return true since we only need d1", () => {
    const d1 = new Date();
    expect(service.validDate(d1, null)).toBe(true);
  });

  it("should return false since we need d1 and d2, but we got only d1", () => {
    const d1 = new Date();
    expect(service.validDate(d1, null, true)).toBe(false);
  });
});
