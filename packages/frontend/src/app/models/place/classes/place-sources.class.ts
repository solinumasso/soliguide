
import {
  type CommonPlaceSource,
  checkIfSourceMustBeDisplayed,
  PlaceSourceId,
  getSourceUrl,
} from "@soliguide/common";

export class PlaceSource {
  public name: string;
  public ids: PlaceSourceId[];
  public isOrigin: boolean;
  public license?: string;
  public externalUrl: string;
  public toDisplay?: boolean;

  constructor(source: CommonPlaceSource) {
    this.name = source.name;
    this.ids = source.ids;
    this.isOrigin = source.isOrigin;

    if (source?.license) {
      this.license = source.license;
    }

    this.toDisplay = checkIfSourceMustBeDisplayed(source.name, source.isOrigin);
    this.externalUrl = getSourceUrl(source);
  }
}
