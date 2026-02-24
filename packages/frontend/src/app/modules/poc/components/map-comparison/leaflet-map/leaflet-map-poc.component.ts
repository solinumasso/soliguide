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

import * as L from "leaflet";

const MAYOTTE_CENTER: L.LatLngExpression = [-12.8275, 45.1662];
const DEFAULT_ZOOM = 13;

type LayerMode = "plan" | "satellite" | "hybrid";

@Component({
  standalone: true,
  selector: "app-leaflet-map-poc",
  imports: [CommonModule],
  templateUrl: "./leaflet-map-poc.component.html",
  styleUrls: ["./leaflet-map-poc.component.scss"],
})
export class LeafletMapPocComponent implements AfterViewInit, OnDestroy {
  @Output() public readonly newCoordinates = new EventEmitter<{
    lat: number;
    lng: number;
  }>();

  private map!: L.Map;
  private marker!: L.Marker;
  private planLayer!: L.TileLayer;
  private satelliteLayer!: L.TileLayer;
  private labelsLayer!: L.TileLayer;

  public currentMode: LayerMode = "satellite";

  constructor(@Inject(PLATFORM_ID) private readonly platformId: object) {}

  public ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.initMap();
    }
  }

  public ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }

  public setLayer(mode: LayerMode): void {
    this.currentMode = mode;

    if (this.map.hasLayer(this.planLayer)) this.map.removeLayer(this.planLayer);
    if (this.map.hasLayer(this.satelliteLayer))
      this.map.removeLayer(this.satelliteLayer);
    if (this.map.hasLayer(this.labelsLayer))
      this.map.removeLayer(this.labelsLayer);

    if (mode === "plan") {
      this.planLayer.addTo(this.map);
    } else if (mode === "satellite") {
      this.satelliteLayer.addTo(this.map);
    } else {
      this.satelliteLayer.addTo(this.map);
      this.labelsLayer.addTo(this.map);
    }
  }

  private initMap(): void {
    this.fixLeafletDefaultIcon();

    this.map = L.map("leaflet-poc-map", {
      center: MAYOTTE_CENTER,
      zoom: DEFAULT_ZOOM,
    });

    this.planLayer = L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: "abcd",
        maxZoom: 20,
      }
    );

    this.satelliteLayer = L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      {
        attribution:
          "Tiles &copy; Esri &mdash; Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP",
        maxZoom: 20,
      }
    );

    this.labelsLayer = L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}",
      { maxZoom: 20, opacity: 0.9 }
    );

    // Start on satellite view
    this.satelliteLayer.addTo(this.map);

    // Draggable marker centered on Mayotte
    this.marker = L.marker(MAYOTTE_CENTER, { draggable: true }).addTo(this.map);

    this.marker.on("dragend", () => {
      const { lat, lng } = this.marker.getLatLng();
      this.newCoordinates.emit({ lat, lng });
    });

    this.map.on("click", (e: L.LeafletMouseEvent) => {
      this.marker.setLatLng(e.latlng);
      this.newCoordinates.emit({ lat: e.latlng.lat, lng: e.latlng.lng });
    });
  }

  private fixLeafletDefaultIcon(): void {
    // Angular's build system breaks Leaflet's default icon URL resolution
    const defaultIcon = L.icon({
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      iconRetinaUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      shadowUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });
    L.Marker.prototype.options.icon = defaultIcon;
  }
}
