import { APP_BASE_HREF } from "@angular/common";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { RouterModule } from "@angular/router";

import { AdminPlaceService } from "./admin-place.service";

describe("AdminPlaceService", () => {
  let service: AdminPlaceService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterModule.forRoot([])],
      providers: [{ provide: APP_BASE_HREF, useValue: "/" }],
    });
    service = TestBed.inject(AdminPlaceService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  describe("Requêtes de type GET", () => {
    it("Envoie une requête pour vérifier si une place est dans une organisation", () => {
      service.checkInOrga(0).subscribe((res) => {
        expect(res).toBeTruthy();
      });

      const req = httpMock.expectOne(`${service.endPoint}check-in-orga/0`);
      expect(req.request.method).toBe("GET");

      req.flush("");
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
