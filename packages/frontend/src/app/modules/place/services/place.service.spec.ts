import { APP_BASE_HREF } from "@angular/common";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { RouterModule } from "@angular/router";

import { PlaceService } from "./place.service";

import { Place } from "../../../models/place/classes";

import { environment } from "../../../../environments/environment";

import { ONLINE_PLACE_MOCK } from "../../../../../mocks";

describe("PlaceService", () => {
  let placeservice: PlaceService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterModule.forRoot([])],
      providers: [PlaceService, { provide: APP_BASE_HREF, useValue: "/" }],
    });

    placeservice = TestBed.inject(PlaceService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it("should return an Observable<Place>", () => {
    placeservice
      .getPlace(ONLINE_PLACE_MOCK.seo_url)
      .subscribe((place: Place) => {
        expect(place.seo_url).toBe(ONLINE_PLACE_MOCK.seo_url);
      });

    const req = httpMock.expectOne(
      `${environment.publicApiUrl}/places/${ONLINE_PLACE_MOCK.seo_url}`
    );
    expect(req.request.method).toBe("GET");
    expect(req.request.headers.get("x-api-version")).toBe("2026-01-01");
    req.flush(ONLINE_PLACE_MOCK);
  });

  it("should return an Observable<boolean>", () => {
    placeservice
      .canEditPlace(ONLINE_PLACE_MOCK.seo_url)
      .subscribe((canEdit: boolean) => {
        expect(canEdit).toBe(true);
      });

    const req = httpMock.expectOne(
      `${environment.apiUrl}/admin/user-rights/can-edit/${ONLINE_PLACE_MOCK.seo_url}`
    );
    expect(req.request.method).toBe("GET");
    req.flush(true);
  });

  afterEach(() => {
    httpMock.verify();
  });
});
