import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { Observable } from "rxjs";
import { ApiMessage } from "../../models/api";

import { environment } from "../../../environments/environment";
import { Search } from "../../modules/search/interfaces";
import { SearchUsersObject } from "../../modules/admin-users/classes";

@Injectable({
  providedIn: "root",
})
export class SyncService {
  constructor(private readonly http: HttpClient) {}

  public syncByIds(
    idsToSync: number[],
    entityToSync: "users" | "places"
  ): Observable<ApiMessage> {
    return this.http.post<ApiMessage>(
      `${environment.apiUrl}/ops/reset-at-sync/${entityToSync}`,
      {
        idsToSync,
      }
    );
  }

  public syncWithSearchParams(
    searchParams: Search | SearchUsersObject,
    entityToSync: "users" | "places"
  ): Observable<ApiMessage> {
    return this.http.post<ApiMessage>(
      `${environment.apiUrl}/ops/reset-at-sync/${entityToSync}/search`,
      searchParams
    );
  }
}
