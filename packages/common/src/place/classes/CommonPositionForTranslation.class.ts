import { AnyDepartmentCode, AnyRegionCode, CountryCodes } from "../../location";
import { CommonPlacePosition } from "./CommonPlacePosition.class";

export class CommonPositionForTranslation {
  public departmentCode?: AnyDepartmentCode;
  public regionCode?: AnyRegionCode;
  public country?: CountryCodes;

  constructor(
    position?: Partial<CommonPositionForTranslation | CommonPlacePosition>
  ) {
    this.departmentCode = position?.departmentCode;
    this.regionCode = position?.regionCode;
    this.country =
      (position as CommonPositionForTranslation)?.country ??
      (position as CommonPlacePosition)?.country;
  }
}
