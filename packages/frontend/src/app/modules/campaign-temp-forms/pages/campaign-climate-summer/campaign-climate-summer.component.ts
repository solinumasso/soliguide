import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

import { ApiPlace } from "@soliguide/common";
import type { PosthogProperties } from "@soliguide/common-angular";

import {
  CampaignTempFormsPayload,
  CampaignTempFormsService,
} from "../../services/campaign-temp-forms.service";
import { Place } from "../../../../models/place";
import { PosthogService } from "../../../analytics/services/posthog.service";

interface PartitionedPlaces {
  upToDate: Place[];
  toUpdate: Place[];
}

@Component({
  selector: "app-campaign-climate-summer",
  templateUrl: "./campaign-climate-summer.component.html",
  styleUrls: ["./campaign-climate-summer.component.css"],
})
export class CampaignClimateSummerComponent implements OnInit {
  public loading = true;
  // `loadError` : state UX pour le cas "lien invalide / expiré / user plus
  // éligible". Aujourd'hui, on affiche un message explicite en lieu et place
  // du redirect home (silencieux et frustrant après clic sur un lien reçu
  // par mail Brevo).
  public loadError = false;
  public payload:
    | (Omit<CampaignTempFormsPayload, "places"> & { places: Place[] })
    | null = null;
  public partitioned: PartitionedPlaces = { upToDate: [], toUpdate: [] };

  // `pendingByLieuId` : trace des lieux en cours de sauvegarde pour désactiver
  // les boutons pendant la requête et éviter les doubles clics.
  public pendingByLieuId = new Set<number>();

  public lang = "fr";

  private campaignSlug!: string;
  private campaignUserUuid!: string;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly service: CampaignTempFormsService,
    private readonly posthogService: PosthogService
  ) {}

  public captureEvent(eventName: string, properties?: PosthogProperties): void {
    this.posthogService.capture(`campaign-temp-forms-${eventName}`, {
      campaignSlug: this.campaignSlug,
      ...properties,
    });
  }

  public ngOnInit(): void {
    // `:lang` est porté par la première route enfant du root (définition
    // `:lang/...` dans `app-routing.module`). `route.root.firstChild` pointe
    // dessus directement — pas besoin de remonter l'arbre.
    this.lang =
      this.route.root.firstChild?.snapshot.paramMap.get("lang") ?? "fr";
    this.campaignSlug = this.route.snapshot.paramMap.get("campaignSlug") ?? "";
    this.campaignUserUuid =
      this.route.snapshot.paramMap.get("campaignUserUuid") ?? "";

    if (!this.campaignSlug || !this.campaignUserUuid) {
      this.setError("invalid-link");
      return;
    }

    this.service
      .getPayload(this.campaignSlug, this.campaignUserUuid)
      .subscribe({
        next: (payload) => {
          const rawPlaces = payload?.places ?? [];
          const places = rawPlaces.map(
            (place) => new Place(place as unknown as ApiPlace)
          );
          // Payload vide (aucun lieu éditable pour ce user sur cette campagne)
          // = état légitime, on rend la page avec un message dédié — pas de
          // redirect home (frustrant pour l'utilisateur qui a cliqué un lien
          // valide envoyé par email).
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
          this.setError("api-error");
        },
      });
  }

  private setError(reason: string): void {
    this.captureEvent("load-error", { reason });
    this.loadError = true;
    this.loading = false;
  }

  public setAirConditioned(place: Place, value: boolean | null): void {
    if (place.modalities.thermalComfort.airConditioned === value) return;
    if (this.pendingByLieuId.has(place.lieu_id)) return;

    // Optimistic update : on flip la valeur localement pour un feedback
    // instantané. En cas d'échec API on revert et on affiche une erreur.
    const previous = place.modalities.thermalComfort.airConditioned;
    place.modalities.thermalComfort.airConditioned = value;
    this.partitioned = this.partition(this.payload?.places ?? []);
    this.pendingByLieuId.add(place.lieu_id);
    this.captureEvent("set-air-conditioned", {
      lieu_id: place.lieu_id,
      previous,
      value,
    });

    this.service
      .setAirConditioned(
        this.campaignSlug,
        this.campaignUserUuid,
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

  /**
   * Split client-side : un lieu est "à jour" dès qu'il a une valeur explicite
   * (true OR false) sur `airConditioned`. `null` = pas encore renseigné.
   */
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
