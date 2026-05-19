import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

import {
  CommonPlaceChanges,
  PlaceChangesStatus,
  SearchResults,
} from "@soliguide/common";

import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import { SearchPlaceChanges } from "../classes";
import { PlaceChanges } from "../../../models/place-changes";
import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class PlaceChangesService {
  public endPoint = `${environment.apiUrl}/place-changes`;

  constructor(private readonly http: HttpClient) {}

  public getVersion(mongo_id: string): Observable<PlaceChanges> {
    return this.http
      .get<CommonPlaceChanges>(`${this.endPoint}/${mongo_id}`)
      .pipe(
        map((changes) => {
          return new PlaceChanges(changes);
        })
      );
  }

  public updateStatus(
    mongo_id: string,
    status: PlaceChangesStatus
  ): Observable<PlaceChanges> {
    return this.http
      .patch<CommonPlaceChanges>(`${this.endPoint}/${mongo_id}`, { status })
      .pipe(
        map((changes) => {
          return new PlaceChanges(changes);
        })
      );
  }

  public searchPlaceChangesForPlace(
    placeId: number,
    search: SearchPlaceChanges,
    light: boolean
  ): Observable<SearchResults<PlaceChanges>> {
    return this.http
      .post<SearchResults<CommonPlaceChanges>>(
        `${this.endPoint}/search/place/${placeId}/${light}`,
        search
      )
      .pipe(
        map((response: SearchResults<CommonPlaceChanges>) => {
          const changes: SearchResults<PlaceChanges> = {
            nbResults: 0,
            results: [],
          };
          if (response.nbResults > 0) {
            changes.nbResults = response.nbResults;
            changes.results = response.results.map(
              (item) => new PlaceChanges(item)
            );
          }
          return changes;
        })
      );
  }

  public searchPlaceChanges(
    search: SearchPlaceChanges
  ): Observable<SearchResults<PlaceChanges>> {
    return this.http
      .post<SearchResults<CommonPlaceChanges>>(
        `${this.endPoint}/search`,
        search
      )
      .pipe(
        map((response: SearchResults<CommonPlaceChanges>) => {
          const changes: SearchResults<PlaceChanges> = {
            nbResults: 0,
            results: [],
          };
          if (response.nbResults > 0) {
            changes.nbResults = response.nbResults;
            changes.results = response.results.map(
              (item) => new PlaceChanges(item)
            );
          }
          return changes;
        })
      );
  }
}
