import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { ApiPlace } from "@soliguide/common";

import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import { Place } from "../../../models/place/classes";

import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class PlaceService {
  constructor(private readonly http: HttpClient) {}

  public getPlace(placeId: string): Observable<Place> {
    return this.http
      .get<ApiPlace>(
        `${environment.publicApiUrl}/places/${encodeURIComponent(placeId)}`,
        { headers: new HttpHeaders({ "x-api-version": "2026-01-01" }) }
      )
      .pipe(map((place: ApiPlace) => new Place(place, false)));
  }

  // Structures modification button
  public canEditPlace = (seoUrl: string): Observable<boolean> => {
    return this.http.get<boolean>(
      `${environment.apiUrl}/admin/user-rights/can-edit/${seoUrl}`
    );
  };

  public canReadChangePlace = (changeObjectId: string): Observable<boolean> => {
    return this.http.get<boolean>(
      `${environment.apiUrl}/place-changes/can-read-change/${changeObjectId}`
    );
  };
}
