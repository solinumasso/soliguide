import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";

import { ONLINE_PLACE_MOCK } from "../../../../../mocks";

import { SearchService } from "./search.service";
import { Search } from "../interfaces";
import { environment } from "../../../../environments/environment";

describe("SearchService", () => {
  let service: SearchService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(SearchService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("searches through the public API legacy-compatible version", () => {
    const search = new Search();

    service.launchSearch(search).subscribe((result) => {
      expect(result.nbResults).toBe(1);
      expect(result.results[0].seo_url).toBe(ONLINE_PLACE_MOCK.seo_url);
    });

    const request = httpMock.expectOne(`${environment.publicApiUrl}/search`);

    expect(request.request.method).toBe("POST");
    expect(request.request.body).toEqual({
      ...search,
      languages: undefined,
    });
    expect(request.request.headers.get("x-api-version")).toBe("2026-01-01");
    request.flush({ nbResults: 1, places: [ONLINE_PLACE_MOCK] });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
