import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { Observable } from "rxjs";

import { Campaign, SoliguideCountries } from "@soliguide/common";

import { environment } from "../../../../environments/environment";
import type { CampaignTempFormsPayload } from "../../campaign-temp-forms/services/campaign-temp-forms.service";

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

  // Variante admin scopée orga du GET `campaign-temp-forms` : sert la page
  // `manage-orga → mise à jour climatique par orga`. Auth = session admin
  // (checkRights côté API), aucune uuid publique dans l'URL.
  public getClimateFormsForOrga(
    campaignSlug: string,
    orgaObjectId: string
  ): Observable<CampaignTempFormsPayload> {
    return this.http.get<CampaignTempFormsPayload>(
      `${this.endPoint}/${campaignSlug}/orga/${orgaObjectId}/climate`
    );
  }

  public setAirConditionedForOrga(
    campaignSlug: string,
    orgaObjectId: string,
    lieu_id: number,
    airConditioned: boolean | null
  ): Observable<{ lieu_id: number; airConditioned: boolean | null }> {
    return this.http.patch<{ lieu_id: number; airConditioned: boolean | null }>(
      `${this.endPoint}/${campaignSlug}/orga/${orgaObjectId}/climate/places/${lieu_id}`,
      { airConditioned }
    );
  }
}
