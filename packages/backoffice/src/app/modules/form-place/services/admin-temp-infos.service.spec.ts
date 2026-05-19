import { APP_BASE_HREF } from "@angular/common";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { RouterModule } from "@angular/router";

import { AdminTempInfosService } from "./admin-temp-infos.service";

describe("AdminTempInfosService", () => {
  let service: AdminTempInfosService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterModule.forRoot([])],
      providers: [{ provide: APP_BASE_HREF, useValue: "/" }],
    });
    service = TestBed.inject(AdminTempInfosService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
