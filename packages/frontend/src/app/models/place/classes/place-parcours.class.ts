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
import { PlacePosition } from "./place-position.class";

import { Photo } from "./photo.class";
import { CommonPlaceParcours, OpeningHours } from "@soliguide/common";

export class PlaceParcours implements CommonPlaceParcours {
  public description: string;
  public hours: OpeningHours;
  public position: PlacePosition;
  public photos: Photo[];

  public show: boolean;

  constructor(parcours?: Partial<CommonPlaceParcours>, isInForm = false) {
    this.description = parcours?.description ?? null;
    this.hours = new OpeningHours(parcours?.hours, isInForm);
    this.position = new PlacePosition(parcours?.position ?? null);
    this.photos =
      parcours?.photos?.map((photo: Photo) => new Photo(photo)) ?? [];
    this.show = parcours?.show ?? false;
  }
}
