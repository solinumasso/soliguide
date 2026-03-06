import { APP_BASE_HREF } from "@angular/common";
import { inject, TestBed } from "@angular/core/testing";

import { TranslateModule } from "@ngx-translate/core";

import { DateService } from "./date.service";

describe("DateService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [DateService, { provide: APP_BASE_HREF, useValue: "/" }],
    });
  });

  it("should be created", inject([DateService], (service: DateService) => {
    expect(service).toBeTruthy();
  }));
});
