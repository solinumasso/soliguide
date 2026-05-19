import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

import {
  ApiPlace,
  ApiSearchResults,
  ExportParams,
  SearchResults,
} from "@soliguide/common";

import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import { AdminSearchPlaces } from "../classes";

import { ApiMessage } from "../../../models/api";
import { Place } from "../../../models/place/classes";

import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class ManagePlacesService {
  constructor(private readonly http: HttpClient) {}

  public autoExport(
    search: AdminSearchPlaces,
    exportParams: ExportParams
  ): Observable<Blob> {
    return this.http.post(
      `${environment.apiUrl}/autoexport`,
      { ...search, exportParams },
      {
        responseType: "blob",
      }
    );
  }

  public getPlaceForAdmin(lieu_id: string): Observable<Place> {
    return this.http
      .get<ApiPlace>(`${environment.apiUrl}/admin/places/${lieu_id}`)
      .pipe(
        map((place: ApiPlace) => {
          return new Place(place, false);
        })
      );
  }

  public launchSearch(
    search: AdminSearchPlaces,
    context: "admin-search" | "admin-search-to-add-place-in-orga"
  ): Observable<SearchResults<Place>> {
    return this.http
      .post<ApiSearchResults>(
        `${environment.apiUrl}/new-search/${context}`,
        search
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

  public deletePlace(lieu_id: number): Observable<ApiMessage> {
    return this.http.delete<ApiMessage>(
      `${environment.apiUrl}/admin/places/${lieu_id}`
    );
  }

  public deletePair(lieu_id: number): Observable<ApiMessage> {
    return this.http.delete<ApiMessage>(
      `${environment.apiUrl}/v2/soligare/pairing/pair/${lieu_id}`
    );
  }
}
