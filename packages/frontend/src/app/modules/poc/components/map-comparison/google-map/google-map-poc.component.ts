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
  OnDestroy,
  Output,
  PLATFORM_ID,
} from "@angular/core";
import { CommonModule, isPlatformBrowser } from "@angular/common";

import { environment } from "../../../../../../environments/environment";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare let google: any;

const MAYOTTE_CENTER = { lat: -12.8275, lng: 45.1662 };
const DEFAULT_ZOOM = 13;

type MapMode = "roadmap" | "satellite" | "hybrid";

@Component({
  standalone: true,
  selector: "app-google-map-poc",
  imports: [CommonModule],
  templateUrl: "./google-map-poc.component.html",
  styleUrls: ["./google-map-poc.component.scss"],
})
export class GoogleMapPocComponent implements AfterViewInit, OnDestroy {
  @Output() public readonly newCoordinates = new EventEmitter<{
    lat: number;
    lng: number;
  }>();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private googleMap: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private googleMarker: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private streetViewPanorama: any;
  private loadedScript: HTMLScriptElement | null = null;

  public readonly hasApiKey = !!environment.googleMapsApiKey;
  public isLoading = false;
  public loadError = false;
  public showStreetView = false;
  public currentMode: MapMode = "satellite";

  constructor(@Inject(PLATFORM_ID) private readonly platformId: object) {}

  public ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId) && this.hasApiKey) {
      this.loadAndInit();
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

  public toggleStreetView(): void {
    this.showStreetView = !this.showStreetView;
    if (this.showStreetView && this.googleMarker) {
      // Let Angular render the streetview container first
      setTimeout(() => {
        this.initStreetView(this.googleMarker.getPosition());
      }, 50);
    }
  }

  private async loadAndInit(): Promise<void> {
    this.isLoading = true;
    try {
      await this.loadGoogleMapsScript(environment.googleMapsApiKey ?? "");
      this.initMap();
    } catch {
      this.loadError = true;
    } finally {
      this.isLoading = false;
    }
  }

  private loadGoogleMapsScript(apiKey: string): Promise<void> {
    if (typeof google !== "undefined" && google?.maps) {
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
    this.googleMap = new google.maps.Map(
      document.getElementById("google-poc-map"),
      {
        center: MAYOTTE_CENTER,
        zoom: DEFAULT_ZOOM,
        mapTypeId: "satellite",
        streetViewControl: true,
        mapTypeControl: false,
        fullscreenControl: true,
      }
    );

    this.googleMarker = new google.maps.Marker({
      position: MAYOTTE_CENTER,
      map: this.googleMap,
      draggable: true,
      title: "Déplacez ce marqueur pour positionner l'adresse",
    });

    this.googleMarker.addListener("dragend", () => {
      const pos = this.googleMarker.getPosition();
      this.newCoordinates.emit({ lat: pos.lat(), lng: pos.lng() });
    });

    this.googleMap.addListener(
      "click",
      (e: { latLng: { lat(): number; lng(): number } }) => {
        this.googleMarker.setPosition(e.latLng);
        this.newCoordinates.emit({
          lat: e.latLng.lat(),
          lng: e.latLng.lng(),
        });
      }
    );
  }

  private initStreetView(position: { lat(): number; lng(): number }): void {
    if (!position) return;

    this.streetViewPanorama = new google.maps.StreetViewPanorama(
      document.getElementById("google-streetview"),
      {
        position: { lat: position.lat(), lng: position.lng() },
        pov: { heading: 0, pitch: 0 },
        zoom: 1,
        addressControl: true,
        fullscreenControl: true,
      }
    );

    this.googleMap.setStreetView(this.streetViewPanorama);
  }
}
