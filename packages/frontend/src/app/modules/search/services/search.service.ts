import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { ApiSearchResults, SearchResults } from "@soliguide/common";

import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Search } from "../interfaces";
import { Place } from "../../../models";

import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class SearchService {
  public endPoint = `${environment.publicApiUrl}/search`;

  constructor(private readonly http: HttpClient) {}

  public launchSearch(search: Search): Observable<SearchResults<Place>> {
    return this.http
      .post<ApiSearchResults>(
        this.endPoint,
        this.toPublicApiSearchRequest(search),
        {
          headers: new HttpHeaders({ "x-api-version": "2026-01-01" }),
        }
      )
      .pipe(
        map((response: ApiSearchResults) => {
          const result: SearchResults<Place> = {
            nbResults: 0,
            results: [],
          };

          if (!response.nbResults) {
            return result;
          }

          if (response.nbResults > 0) {
            result.nbResults = response.nbResults;
            result.results = response.places.map(
              (item) => new Place(item, false)
            );
          }
          return result;
        })
      );
  }

  private toPublicApiSearchRequest(search: Search): Record<string, unknown> {
    const { languages, ...request } = search;

    return {
      ...request,
      ...(languages ? { languages: [languages] } : {}),
    };
  }
}
