import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { catchError, map, Observable, of, shareReplay } from "rxjs";

import { Campaign, CountryCodes, SoliguideCountries } from "@soliguide/common";

import { environment } from "../../../../environments/environment";
import type { CampaignTempFormsPayload } from "../../campaign-temp-forms/services/campaign-temp-forms.service";
import { THEME_CONFIGURATION } from "../../../models";

@Injectable({ providedIn: "root" })
export class AdminCampaignsService {
  private readonly endPoint = `${environment.apiUrl}/admin/campaigns`;

  // Cache mémoire (life = life du service = singleton root) du slug de la
  // campagne canicule ACTIVE du pays courant. `shareReplay(1)` → 1 seul GET
  // HTTP même si N boutons s'y abonnent en même temps (typiquement une table
  // de N users/orgas). `null` couvre "pas en pays canicule" ET "aucune
  // campagne active" — même comportement côté template.
  private heatwaveCampaignSlug$?: Observable<string | null>;

  constructor(private readonly http: HttpClient) {}

  public getActiveCampaigns(
    country: SoliguideCountries
  ): Observable<Campaign[]> {
    return this.http.get<Campaign[]>(`${this.endPoint}/active`, {
      params: new HttpParams().set("country", country),
    });
  }

  public getCurrentHeatwaveCampaignSlug$(): Observable<string | null> {
    if (THEME_CONFIGURATION.country !== CountryCodes.FR) {
      return of(null);
    }
    if (!this.heatwaveCampaignSlug$) {
      this.heatwaveCampaignSlug$ = this.getActiveCampaigns(
        THEME_CONFIGURATION.country
      ).pipe(
        map((campaigns) => campaigns[0]?.slug ?? null),
        catchError(() => of(null)),
        shareReplay(1)
      );
    }
    return this.heatwaveCampaignSlug$;
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
