import { PositionSlugs } from "../../classes";
import { GeoTypes, SoliguideCountries } from "../../enums";
import { AnyDepartmentCode, AnyRegionCode, AnyTimeZone } from "../../types";
export class LocationAutoCompleteAddress {
  public label: string;
  public coordinates: number[];
  public postalCode?: string;
  public cityCode?: string;
  public city?: string;
  public name?: string;
  public geoType: GeoTypes;
  public geoValue: string;
  public department?: string;
  public departmentCode?: AnyDepartmentCode;
  public country?: SoliguideCountries;
  public region?: string;
  public regionCode?: AnyRegionCode;
  public timeZone?: AnyTimeZone;
  public slugs: PositionSlugs;

  constructor(data: Partial<LocationAutoCompleteAddress>) {
    this.label = data?.label ?? "";
    this.coordinates = data?.coordinates ?? [];
    this.geoType = data?.geoType ?? GeoTypes.UNKNOWN;
    this.geoValue = data?.geoValue ?? "";
    this.slugs = new PositionSlugs(data);
    this.postalCode = data?.postalCode ?? undefined;
    this.cityCode = data?.cityCode ?? undefined;
    this.city = data?.city ?? undefined;
    this.name = data?.name ?? undefined;
    this.department = data?.department ?? undefined;
    this.departmentCode = data?.departmentCode ?? undefined;
    this.country = data?.country ?? undefined;
    this.region = data?.region ?? undefined;
    this.regionCode = data?.regionCode ?? undefined;
    this.timeZone = data?.timeZone ?? undefined;
  }
}
