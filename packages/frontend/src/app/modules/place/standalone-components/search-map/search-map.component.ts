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
  Input,
  OnChanges,
  OnInit,
  Output,
} from "@angular/core";

import * as L from "leaflet";
import { MarkerOptions } from "../../../../models/search-places";

@Component({
  standalone: true,
  selector: "app-search-map",
  templateUrl: "./search-map.component.html",
  styleUrls: ["./search-map.component.css"],
})
export class SearchMapComponent implements AfterViewInit, OnChanges, OnInit {
  @Input() public scrollOnClick!: boolean;
  @Input() public moveOnClick!: boolean;
  @Input() public withPopup!: boolean;

  @Input() public markers!: MarkerOptions[];
  @Input() public mapIndex!: number;

  public map!: L.Map;
  public markerGroup!: L.FeatureGroup;
  public layer!: L.TileLayer;
  public mapId!: string;

  @Output() public readonly newCoordinates = new EventEmitter<{
    lat: number;
    lng: number;
  }>();

  public ngOnInit(): void {
    this.mapId = this.mapIndex !== null ? `map_${this.mapIndex}` : "map";
  }

  public ngAfterViewInit(): void {
    this.createMap();
  }

  public ngOnChanges(): void {
    if (this.map) {
      const layers = this.markerGroup.getLayers();
      for (const layer of layers) {
        this.map.removeLayer(layer);
      }
      this.markerGroup.clearLayers();
      this.addMarkersToMap();
    }
  }

  public createMap(): void {
    this.map = L.map(this.mapId, {
      scrollWheelZoom: false,
      maxZoom: 17,
    });

    this.layer = L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: "abcd",
        maxZoom: 19,
      }
    );

    this.markerGroup = L.featureGroup();

    this.layer.addTo(this.map);
    this.addMarkersToMap();
  }

  public addMarkersToMap() {
    // add markers to map
    for (const marker of this.markers) {
      this.addMarker(marker);
    }

    // rescale zoom based on marker
    if (this.markers.length) {
      this.map.fitBounds(this.markerGroup.getBounds(), { padding: [50, 50] });
    }
  }

  public addMarker(markerOption: MarkerOptions): void {
    const pinIcon = new L.Icon({
      iconUrl: markerOption.options.icon.url,
      iconRetinaUrl: markerOption.options.icon.url,
      iconSize: [
        markerOption.options.icon.scaledSize.width,
        markerOption.options.icon.scaledSize.height,
      ],
    });

    const marker = L.marker([markerOption.lat, markerOption.lng], {
      icon: pinIcon,
      draggable: !!this.moveOnClick,
      autoPan: this.moveOnClick ?? false,
      autoPanPadding: this.moveOnClick
        ? new L.Point(50, 50)
        : new L.Point(0, 0),
    });
    marker.addTo(this.map);

    if (this.withPopup) {
      marker.bindPopup(
        `<div id='${markerOption.options.id}' class='popup-soli'>${markerOption.options.title}</div>`
      );
    }

    if (this.scrollOnClick) {
      marker.on("click", (e) => {
        const popupHtml = e.sourceTarget._popup._content;
        const doc = new DOMParser().parseFromString(popupHtml, "text/html");
        const popupid = doc.getElementsByClassName("popup-soli");
        const el = document.getElementById(`structure-${popupid[0].id}`);

        el.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "nearest",
        });
      });
    }

    if (this.moveOnClick) {
      marker.on("moveend", (e) => {
        this.map.panTo(
          new L.LatLng(e.target._latlng.lat, e.target._latlng.lng)
        );
        this.newCoordinates.emit({
          lat: e.target._latlng.lat,
          lng: e.target._latlng.lng,
        });
      });

      this.map.on("click", (e) => {
        const newMouseEvent = e as unknown as L.LeafletMouseEvent;
        this.map.panTo(
          new L.LatLng(newMouseEvent.latlng.lat, newMouseEvent.latlng.lng)
        );
        this.newCoordinates.emit({
          lat: newMouseEvent.latlng.lat,
          lng: newMouseEvent.latlng.lng,
        });
      });
    }
    // add marker to markergroup to scalle map based on markers
    marker.addTo(this.markerGroup);
  }
}
