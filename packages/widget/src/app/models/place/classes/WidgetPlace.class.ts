import {
  ApiPlace,
  CommonPlaceEntity,
  CommonPlacePosition,
} from "@soliguide/common";

export class WidgetPlace implements Partial<ApiPlace> {
  public _id: string;
  public lieu_id: number;
  public seo_url: string;

  public name: string;
  public entity: Pick<CommonPlaceEntity, "phones">;

  public position: CommonPlacePosition;
  public distance?: number;

  public isOpenToday: boolean;

  constructor(place?: Partial<WidgetPlace>) {
    this._id = place?._id ?? "";
    this.lieu_id = typeof place?.lieu_id === "number" ? place.lieu_id : 0;
    this.seo_url = place?.seo_url ?? "";

    this.name = place?.name ?? "";
    this.entity = place?.entity ?? { phones: [] };

    this.isOpenToday = place?.isOpenToday ?? true;

    this.position = place?.position
      ? new CommonPlacePosition(place.position)
      : new CommonPlacePosition();
    this.distance =
      typeof place?.distance === "number" ? place.distance : undefined;
  }
}
