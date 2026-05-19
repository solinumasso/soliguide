import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import { environment } from "../../../../environments/environment";
import { ApiMessage } from "../../../models";

@Injectable({
  providedIn: "root",
})
export class GeneralService {
  public constructor(public http: HttpClient) {}

  public contact(contactInfo: unknown): Observable<ApiMessage> {
    return this.http.post<ApiMessage>(
      `${environment.apiUrl}/contact`,
      contactInfo
    );
  }

  // HOME PAGE STATS
  public statsAll(): Observable<number> {
    return this.http.get<string>(`${environment.apiUrl}/stats/all`).pipe(
      map((response: string) => {
        return parseInt(response, 10);
      })
    );
  }

  public statsServices(): Observable<number> {
    return this.http.get<string>(`${environment.apiUrl}/stats/services`).pipe(
      map((response: string) => {
        return parseInt(response, 10);
      })
    );
  }
}
