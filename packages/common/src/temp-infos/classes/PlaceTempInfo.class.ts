import { IPlaceTempInfo } from "../interfaces";

import { BasePlaceTempInfo } from "./BasePlaceTempInfo.class";

export class PlaceTempInfo {
  public closure: BasePlaceTempInfo;
  public hours: BasePlaceTempInfo;
  public message: BasePlaceTempInfo;

  constructor(placeTempInfo?: IPlaceTempInfo, isInForm?: boolean) {
    this.closure = new BasePlaceTempInfo(
      placeTempInfo?.closure ?? null,
      isInForm
    );
    this.hours = new BasePlaceTempInfo(placeTempInfo?.hours ?? null, isInForm);
    this.message = new BasePlaceTempInfo(
      placeTempInfo?.message ?? null,
      isInForm
    );
  }
}
