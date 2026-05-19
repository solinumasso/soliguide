import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

import { CommonPlaceSource } from "@soliguide/common";

import { environment } from "../../../../environments/environment";
import { ApiMessage } from "../../../models";

@Injectable({
  providedIn: "root",
})
export class SoligarePairService {
  constructor(private http: HttpClient) {}

  public sourceDetails(sourceId: string): Observable<CommonPlaceSource> {
    const url = `${environment.apiUrl}/v2/soligare/source/details/${sourceId}`;
    return this.http.get<CommonPlaceSource>(`${url}`);
  }

  public putSource(
    soliguideId: number,
    body: CommonPlaceSource
  ): Observable<ApiMessage> {
    const url = `${environment.apiUrl}/admin/places/sources/${soliguideId}`;

    const details = {
      source: {
        id: body.ids[0].id,
        url: body.ids[0].url,
        name: body.name,
        license: body.license,
        isOrigin: body.isOrigin,
      },
    };

    return this.http.put<ApiMessage>(`${url}`, details);
  }

  public pair(sourceId: string, soliguideId: number): Observable<ApiMessage> {
    const url = `${environment.apiUrl}/v2/soligare/pairing/pair`;
    const body = {
      source_id: sourceId,
      soliguide_id: soliguideId,
    };
    return this.http.post<ApiMessage>(`${url}`, body);
  }
}
