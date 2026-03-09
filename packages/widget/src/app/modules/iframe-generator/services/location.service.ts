import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import type { Observable } from "rxjs";

import type { LocationAutoCompleteAddress, GeoTypes } from "@soliguide/common";

import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class LocationService {
  private readonly locationAutocompleteEndpoint = `${environment.locationApiUrl}/autocomplete/fr`;
  private readonly locationReverseEndpoint = `${environment.locationApiUrl}/reverse/fr`;

  constructor(public http: HttpClient) {}

  public reverse(
    latitude: number,
    longitude: number
  ): Observable<LocationAutoCompleteAddress[]> {
    return this.http.get<LocationAutoCompleteAddress[]>(
      `${this.locationReverseEndpoint}/${latitude}/${longitude}/false`
    );
  }

  public locationAutoComplete(
    term: string,
    geoType?: GeoTypes
  ): Observable<LocationAutoCompleteAddress[]> {
    const params = geoType ? { geoType } : undefined;
    const url = `${this.locationAutocompleteEndpoint}/all/${encodeURI(
      term.trim()
    )}`;
    return this.http.get<LocationAutoCompleteAddress[]>(url, { params });
  }
}
