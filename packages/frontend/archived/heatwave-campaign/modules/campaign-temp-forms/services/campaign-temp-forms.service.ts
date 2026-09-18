import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { Observable } from "rxjs";

import { environment } from "../../../../environments/environment";

export interface CampaignTempFormsPlaceSummary {
  lieu_id: number;
  seo_url: string;
  name: string;
  description: string | null;
  status: string;
  country: string;
  position: {
    address: string;
    postalCode: string;
    city: string;
    [key: string]: unknown;
  };
  modalities: {
    thermalComfort: {
      airConditioned: boolean | null;
      heated: boolean | null;
    };
    [key: string]: unknown;
  };
  newhours: unknown;
  tempInfos: {
    closure?: {
      actif?: boolean;
      dateDebut?: string | Date | null;
      dateFin?: string | Date | null;
      description?: string | null;
      name?: string | null;
      [key: string]: unknown;
    };
    hours?: unknown;
    message?: unknown;
    [key: string]: unknown;
  };
}

export interface CampaignTempFormsPayload {
  campaign: {
    slug: string;
    name: string;
    description: string | null;
    country: string;
    startDate: string;
    endDate: string;
    sectionsToUpdate: string[];
  };
  user: { name: string };
  places: CampaignTempFormsPlaceSummary[];
}

@Injectable({ providedIn: "root" })
export class CampaignTempFormsService {
  private readonly endPoint = `${environment.apiUrl}/campaign-temp-forms`;

  constructor(private readonly http: HttpClient) {}

  public getPayload(
    campaignSlug: string,
    campaignUserUuid: string
  ): Observable<CampaignTempFormsPayload> {
    return this.http.get<CampaignTempFormsPayload>(
      `${this.endPoint}/${campaignSlug}/${campaignUserUuid}`
    );
  }

  public setAirConditioned(
    campaignSlug: string,
    campaignUserUuid: string,
    lieu_id: number,
    airConditioned: boolean | null
  ): Observable<{ lieu_id: number; airConditioned: boolean | null }> {
    return this.http.patch<{ lieu_id: number; airConditioned: boolean | null }>(
      `${this.endPoint}/${campaignSlug}/${campaignUserUuid}/places/${lieu_id}/climate`,
      { airConditioned }
    );
  }
}
