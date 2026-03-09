import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { ApiPlace, ApiSearchResults } from "@soliguide/common";

import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import { Search, SearchResults, WidgetPlace } from "../../../models";

import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class SearchService {
  public endpoint = `${environment.apiUrl}/new-search`;

  constructor(public http: HttpClient) {}

  public launchSearch(search: Search): Observable<SearchResults> {
    const headers = new HttpHeaders({
      // https://developer.mozilla.org/en-US/docs/Web/API/Document/referrer
      "X-Document-Referrer": document.referrer,
    });
    return this.http
      .post<ApiSearchResults>(`${this.endpoint}/${search.lang}`, search, {
        headers,
      })
      .pipe(
        map((response: ApiSearchResults) => {
          const result: SearchResults = {
            nbResults: 0,
            places: [],
          };
          if (response.nbResults > 0) {
            result.nbResults = response.nbResults;
            result.places = response.places.map(
              (item: ApiPlace) => new WidgetPlace(item)
            );
          }
          return result;
        })
      );
  }
}
