/*
 * Soliguide: Useful information for those who need it
 *
 * SPDX-FileCopyrightText: © 2024 Solinum
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
import {
  AfterViewInit,
  Component,
  EventEmitter,
  Inject,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  PLATFORM_ID,
} from "@angular/core";
import { CommonModule, isPlatformBrowser } from "@angular/common";
import { environment } from "../../../../../environments/environment";
import { MarkerOptions } from "../../../../models/search-places";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare let google: any;

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    google?: any;
  }
}

const DEFAULT_ZOOM = 15;

type MapMode = "roadmap" | "satellite" | "hybrid";

@Component({
  standalone: true,
  selector: "app-google-map",
  imports: [CommonModule],
  templateUrl: "./google-map.component.html",
  styleUrls: ["./google-map.component.scss"],
})
export class GoogleMapComponent
  implements OnInit, AfterViewInit, OnChanges, OnDestroy
{
  @Input() public markers!: MarkerOptions[];
  @Input() public mapIndex!: number;
  @Input() public moveOnClick!: boolean;
  @Input() public scrollOnClick!: boolean;
  @Input() public withPopup!: boolean;

  @Output() public readonly newCoordinates = new EventEmitter<{
    lat: number;
    lng: number;
  }>();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private googleMap: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private googleMarkers: any[] = [];
  private loadedScript: HTMLScriptElement | null = null;

  public mapId!: string;
  public hasApiKey = false;
  public isLoading = false;
  public loadError = false;
  public currentMode: MapMode = "roadmap";

  constructor(
    @Inject(PLATFORM_ID) private readonly platformId: object,
    private readonly ngZone: NgZone
  ) {}

  public ngOnInit(): void {
    this.mapId =
      this.mapIndex != null ? `google-map_${this.mapIndex}` : "google-map";
  }

  public ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadAndInit();
    }
  }

  public ngOnChanges(): void {
    if (this.googleMap) {
      for (const m of this.googleMarkers) {
        m.setMap(null);
      }
      this.googleMarkers = [];
      this.addMarkersToMap();
    }
  }

  public ngOnDestroy(): void {
    if (this.loadedScript) {
      this.loadedScript.remove();
    }
  }

  public setMode(mode: MapMode): void {
    this.currentMode = mode;
    if (this.googleMap) {
      this.googleMap.setMapTypeId(mode);
    }
  }

  private async loadAndInit(): Promise<void> {
    this.isLoading = true;
    try {
      const apiKey = environment.googleMapsApiKey ?? "";
      this.hasApiKey = !!apiKey;
      if (this.hasApiKey) {
        await this.loadGoogleMapsScript(apiKey);
      }
    } catch {
      this.loadError = true;
    } finally {
      this.isLoading = false;
    }

    // initMap() must run AFTER isLoading=false so Angular renders the map div
    // before Google Maps tries to attach to it. setTimeout(0) gives Angular
    // one change-detection cycle to update the DOM.
    if (this.hasApiKey && !this.loadError) {
      setTimeout(() => this.initMap(), 0);
    }
  }

  private loadGoogleMapsScript(apiKey: string): Promise<void> {
    if (window.google?.maps) {
      return Promise.resolve();
    }

    return new Promise<void>((resolve, reject) => {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () =>
        reject(new Error("Échec du chargement de l'API Google Maps"));
      this.loadedScript = script;
      document.head.appendChild(script);
    });
  }

  private initMap(): void {
    const center = this.markers?.length
      ? { lat: this.markers[0].lat, lng: this.markers[0].lng }
      : { lat: 48.8566, lng: 2.3522 };

    this.googleMap = new google.maps.Map(document.getElementById(this.mapId), {
      center,
      zoom: DEFAULT_ZOOM,
      mapTypeId: this.currentMode,
      streetViewControl: false,
      mapTypeControl: false,
      fullscreenControl: true,
    });

    if (this.moveOnClick) {
      this.googleMap.addListener(
        "click",
        (e: { latLng: { lat(): number; lng(): number } }) => {
          const [first] = this.googleMarkers;
          first?.setPosition(e.latLng);
          this.googleMap.panTo(e.latLng);
          this.ngZone.run(() => {
            this.newCoordinates.emit({
              lat: e.latLng.lat(),
              lng: e.latLng.lng(),
            });
          });
        }
      );
    }

    this.addMarkersToMap();
  }

  private addMarkersToMap(): void {
    if (!this.markers?.length) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const bounds = new google.maps.LatLngBounds();

    for (const markerOption of this.markers) {
      this.addMarker(markerOption, bounds);
    }

    if (this.markers.length > 1) {
      this.googleMap.fitBounds(bounds, 50);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private addMarker(markerOption: MarkerOptions, bounds: any): void {
    const position = { lat: markerOption.lat, lng: markerOption.lng };

    const marker = new google.maps.Marker({
      position,
      map: this.googleMap,
      draggable: this.moveOnClick ?? false,
      title: markerOption.options.title,
    });

    this.googleMarkers.push(marker);
    bounds.extend(position);

    if (this.withPopup) {
      const infoWindow = new google.maps.InfoWindow({
        content: `<div id="${markerOption.options.id}" class="popup-soli">${markerOption.options.title}</div>`,
      });
      marker.addListener("click", () => {
        infoWindow.open({ anchor: marker, map: this.googleMap });
      });
    }

    if (this.scrollOnClick) {
      marker.addListener("click", () => {
        this.ngZone.run(() => {
          const el = document.getElementById(
            `structure-${markerOption.options.id}`
          );
          el?.scrollIntoView({
            behavior: "smooth",
            block: "start",
            inline: "nearest",
          });
        });
      });
    }

    if (this.moveOnClick) {
      marker.addListener("dragend", () => {
        const pos = marker.getPosition();
        this.ngZone.run(() => {
          this.newCoordinates.emit({ lat: pos.lat(), lng: pos.lng() });
        });
      });
    }
  }
}
