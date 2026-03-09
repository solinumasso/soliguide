import { APP_BASE_HREF } from "@angular/common";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { RouterModule } from "@angular/router";

import { OrganisationService } from "./organisation.service";

describe("OrganisationService", () => {
  let service: OrganisationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterModule.forRoot([])],
      providers: [{ provide: APP_BASE_HREF, useValue: "/" }],
    });
    service = TestBed.inject(OrganisationService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
