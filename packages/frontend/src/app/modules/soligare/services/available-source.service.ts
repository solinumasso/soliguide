import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

import { AnyDepartmentCode } from "@soliguide/common";

import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class AvailableSourceService {
  constructor(private readonly http: HttpClient) {}

  public getAvailableSource(
    territories: AnyDepartmentCode[]
  ): Observable<string[]> {
    const url = `${environment.apiUrl}/v2/soligare/source/available`;

    return this.http.post<string[]>(url, { territories: territories });
  }
}
