import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import { ApiPlace } from "@soliguide/common";
import type { PosthogProperties } from "@soliguide/common-angular";

import type { CampaignTempFormsPayload } from "../../../campaign-temp-forms/services/campaign-temp-forms.service";
import { Place } from "../../../../models/place";
import { PosthogService } from "../../../analytics/services/posthog.service";
import { AdminCampaignsService } from "../../services/admin-campaigns.service";

interface PartitionedPlaces {
  upToDate: Place[];
  toUpdate: Place[];
}

/**
 * Variante admin, scopée organisation, du parcours `campaign-climate-summer` :
 * même UX, mais l'auth passe par la session admin (`checkRights` côté API)
 * au lieu de l'uuid public. Consommée depuis `manage-orga` pour afficher la
 * mise à jour climatique par orga.
 */
@Component({
  selector: "app-campaign-climate-orga",
  templateUrl: "./campaign-climate-orga.component.html",
  styleUrls: ["./campaign-climate-orga.component.css"],
})
export class CampaignClimateOrgaComponent implements OnInit {
  public loading = true;
  public payload:
    | (Omit<CampaignTempFormsPayload, "places"> & { places: Place[] })
    | null = null;
  public partitioned: PartitionedPlaces = { upToDate: [], toUpdate: [] };

  public pendingByLieuId = new Set<number>();

  public lang = "fr";

  private campaignSlug!: string;
  private orgaObjectId!: string;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly adminCampaignsService: AdminCampaignsService,
    private readonly posthogService: PosthogService
  ) {}

  public captureEvent(eventName: string, properties?: PosthogProperties): void {
    this.posthogService.capture(`campaign-temp-forms-orga-${eventName}`, {
      campaignSlug: this.campaignSlug,
      orgaObjectId: this.orgaObjectId,
      ...properties,
    });
  }

  public ngOnInit(): void {
    this.lang =
      this.route.root.firstChild?.snapshot.paramMap.get("lang") ?? "fr";
    this.campaignSlug = this.route.snapshot.paramMap.get("campaignSlug") ?? "";
    this.orgaObjectId = this.route.snapshot.paramMap.get("orgaObjectId") ?? "";

    if (!this.campaignSlug || !this.orgaObjectId) {
      this.redirectHome("invalid-link");
      return;
    }

    this.adminCampaignsService
      .getClimateFormsForOrga(this.campaignSlug, this.orgaObjectId)
      .subscribe({
        next: (payload) => {
          const rawPlaces = payload?.places ?? [];
          const places = rawPlaces.map(
            (place) => new Place(place as unknown as ApiPlace)
          );
          // Payload vide (aucun lieu dans cette orga) = état légitime : on rend
          // la page avec un message dédié plutôt que de rediriger l'admin sur
          // la home sans explication.
          this.payload = { ...payload, places };
          this.partitioned = this.partition(places);
          this.loading = false;
          this.captureEvent("page-view", {
            placesCount: places.length,
            toUpdateCount: this.partitioned.toUpdate.length,
            upToDateCount: this.partitioned.upToDate.length,
          });
        },
        error: () => {
          this.redirectHome("api-error");
        },
      });
  }

  private redirectHome(reason: string): void {
    this.captureEvent("redirect-home", { reason });
    void this.router.navigate([this.lang]);
  }

  public setAirConditioned(place: Place, value: boolean | null): void {
    if (place.modalities.thermalComfort.airConditioned === value) return;
    if (this.pendingByLieuId.has(place.lieu_id)) return;

    const previous = place.modalities.thermalComfort.airConditioned;
    place.modalities.thermalComfort.airConditioned = value;
    this.partitioned = this.partition(this.payload?.places ?? []);
    this.pendingByLieuId.add(place.lieu_id);
    this.captureEvent("set-air-conditioned", {
      lieu_id: place.lieu_id,
      previous,
      value,
    });

    this.adminCampaignsService
      .setAirConditionedForOrga(
        this.campaignSlug,
        this.orgaObjectId,
        place.lieu_id,
        value
      )
      .subscribe({
        next: () => {
          this.pendingByLieuId.delete(place.lieu_id);
        },
        error: () => {
          place.modalities.thermalComfort.airConditioned = previous;
          this.partitioned = this.partition(this.payload?.places ?? []);
          this.pendingByLieuId.delete(place.lieu_id);
          this.captureEvent("set-air-conditioned-error", {
            lieu_id: place.lieu_id,
            attempted: value,
          });
        },
      });
  }

  public trackByLieuId(_: number, place: Place): number {
    return place.lieu_id;
  }

  private partition(places: Place[]): PartitionedPlaces {
    const upToDate: Place[] = [];
    const toUpdate: Place[] = [];
    for (const place of places) {
      if (place.modalities.thermalComfort.airConditioned === null) {
        toUpdate.push(place);
      } else {
        upToDate.push(place);
      }
    }
    return { upToDate, toUpdate };
  }
}
