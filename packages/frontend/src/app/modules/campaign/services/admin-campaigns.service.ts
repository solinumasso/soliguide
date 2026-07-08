import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { Observable } from "rxjs";

import { Campaign, SoliguideCountries } from "@soliguide/common";

import { environment } from "../../../../environments/environment";

@Injectable({ providedIn: "root" })
export class AdminCampaignsService {
  private readonly endPoint = `${environment.apiUrl}/admin/campaigns`;

  constructor(private readonly http: HttpClient) {}

  public getActiveCampaigns(
    country: SoliguideCountries
  ): Observable<Campaign[]> {
    return this.http.get<Campaign[]>(`${this.endPoint}/active`, {
      params: new HttpParams().set("country", country),
    });
  }
}
