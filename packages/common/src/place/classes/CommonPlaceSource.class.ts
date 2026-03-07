import { PlaceSourceId } from "../interfaces";

export class CommonPlaceSource {
  public name: string;
  public ids: PlaceSourceId[];
  public isOrigin: boolean;
  public license?: string;

  constructor(source: CommonPlaceSource) {
    this.name = source.name;
    this.ids = source.ids;
    this.isOrigin = source.isOrigin;
    if (source?.license) {
      this.license = source.license;
    }
  }
}
