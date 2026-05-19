import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { ApiSearchResults, SearchResults } from "@soliguide/common";

import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Search } from "../interfaces";
import { CurrentLanguageService } from "../../general/services/current-language.service";
import { Place } from "../../../models";

import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class SearchService {
  public endPoint = `${environment.apiUrl}/new-search`;

  constructor(
    private readonly http: HttpClient,
    private readonly currentLanguageService: CurrentLanguageService
  ) {}

  public launchSearch(search: Search): Observable<SearchResults<Place>> {
    const url = `${this.endPoint}/${this.currentLanguageService.currentLanguage}`;

    return this.http.post<ApiSearchResults>(`${url}`, search).pipe(
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
}
