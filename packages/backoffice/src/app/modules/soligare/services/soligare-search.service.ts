import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

import { ApiPlace, ExternalStructure, SearchResults } from "@soliguide/common";

import { environment } from "../../../../environments/environment";
import { Place } from "../../../models/place";
import { SearchPairing } from "../classes";

@Injectable({
  providedIn: "root",
})
export class SoligareSearchService {
  constructor(private readonly http: HttpClient) {}

  public launchSearch(
    search: SearchPairing
  ): Observable<SearchResults<ExternalStructure>> {
    const url = `${environment.apiUrl}/v2/soligare/pairing/to-pair`;
    return this.http.post<SearchResults<ExternalStructure>>(`${url}`, {
      sources: search.sources ?? [],
      territories: search.territories ?? [],
      options: search.options ?? { limit: 10, page: 1 },
    });
  }

  public getDuplicates(place: Partial<ApiPlace>): Observable<Place[]> {
    const url = `${environment.apiUrl}/integration/search-duplicates`;
    return this.http.post<Place[]>(url, place);
  }

  public getExternalStructure(id: string): Observable<Partial<ApiPlace>> {
    const url = `${environment.apiUrl}/v2/soligare/pairing/external-structure/${id}`;

    return this.http.get<Partial<ApiPlace>>(url);
  }
}
