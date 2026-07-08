import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { firstValueFrom } from "rxjs";

import { CAMPAIGN_LIST, Campaign, CampaignName } from "@soliguide/common";

import { environment } from "../../../environments/environment";

/**
 * Catalogue de campagnes (nouveau modèle DB) chargé au démarrage via
 * `GET /campaign/all`. Sert de source de vérité pour résoudre un
 * `placeChanges.campaignName` : nom de campagne moderne (slug) qui n'existe
 * pas dans le legacy `CAMPAIGN_LIST` hardcodé.
 *
 * `getLabel(name)` retourne :
 * - le `Campaign.name` DB si le slug matche,
 * - sinon le libellé legacy `CAMPAIGN_LIST[name].name` (clé i18n),
 * - sinon le nom brut (fallback ultime).
 */
@Injectable({ providedIn: "root" })
export class CampaignsCatalogService {
  private readonly campaignsBySlug = new Map<string, Campaign>();

  constructor(private readonly http: HttpClient) {}

  public async load(): Promise<void> {
    try {
      const campaigns = await firstValueFrom(
        this.http.get<Campaign[]>(`${environment.apiUrl}/campaign/all`)
      );
      this.campaignsBySlug.clear();
      for (const campaign of campaigns ?? []) {
        this.campaignsBySlug.set(campaign.slug, campaign);
      }
    } catch {
      // Réseau HS ou 500 : on garde le fallback legacy. Ne pas bloquer le boot.
    }
  }

  /**
   * Résout un `campaignName` = soit un slug DB (`canicule-france-2026`) soit
   * une valeur de l'enum legacy (`MID_YEAR_2026`).
   */
  public getLabel(name: string | null | undefined): string {
    if (!name) {
      return "";
    }
    const dbCampaign = this.campaignsBySlug.get(name);
    if (dbCampaign) {
      return dbCampaign.name;
    }
    const legacy = CAMPAIGN_LIST[name as CampaignName];
    return legacy?.name ?? name;
  }

  public getYear(name: string | null | undefined): number | null {
    if (!name) {
      return null;
    }
    const dbCampaign = this.campaignsBySlug.get(name);
    if (dbCampaign?.startDate) {
      return new Date(dbCampaign.startDate).getFullYear();
    }
    const legacy = CAMPAIGN_LIST[name as CampaignName];
    return legacy?.year ?? null;
  }
}
