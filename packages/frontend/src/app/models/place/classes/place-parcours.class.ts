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
