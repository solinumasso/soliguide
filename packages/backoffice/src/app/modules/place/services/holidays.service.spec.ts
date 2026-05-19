import { TestBed } from "@angular/core/testing";
import { TranslateModule } from "@ngx-translate/core";
import { HttpClientTestingModule } from "@angular/common/http/testing";

import { HolidaysService } from "./holidays.service";

jest.useFakeTimers();

describe("HolidaysService", () => {
  let service: HolidaysService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, TranslateModule.forRoot({})],
    });
  });

  it("should be created", () => {
    service = TestBed.inject(HolidaysService);
    expect(service).toBeTruthy();
  });
});
