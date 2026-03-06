
import {
  AnyDepartmentCode,
  AnyRegionCode,
  AnyTimeZone,
  CountryCodes,
  PositionSlugs,
} from "../../location";
import { PlaceLocation } from "../interfaces/PlaceLocation.interface";

export class CommonPlacePosition {
  public adresse?: string; // @deprecated
  public codePostal?: string; // @deprecated
  public complementAdresse: string | null; // @deprecated
  public departement?: string; // @deprecated
  public departementCode?: string; // @deprecated
  public location: PlaceLocation; // @deprecated
  public pays?: string; // @deprecated
  public ville?: string; // @deprecated

  // New fields in english
  public address: string;
  public additionalInformation?: string;
  public city: string;
  public cityCode: string;
  public postalCode: string;
  public department: string;
  public departmentCode?: AnyDepartmentCode;
  public region: string;
  public regionCode?: AnyRegionCode;
  public country?: CountryCodes;
  public timeZone: AnyTimeZone;

  public slugs?: PositionSlugs;

  constructor(position?: Partial<CommonPlacePosition>) {
    this.location = position?.location ?? {
      coordinates: [],
      type: "Point",
    };

    this.address = position?.address ?? "";
    this.additionalInformation = position?.additionalInformation;
    this.city = position?.city ?? "";
    this.postalCode = position?.postalCode ?? "";
    this.cityCode = position?.cityCode ?? "";
    this.department = position?.department ?? "";
    this.departmentCode = position?.departmentCode;
    this.region = position?.region ?? "";
    this.regionCode = position?.regionCode;
    this.country = position?.country ?? undefined;

    // @deprecated start
    this.adresse = position?.address ?? "";
    this.codePostal = position?.postalCode ?? "";
    this.complementAdresse = position?.additionalInformation ?? null;
    this.departement = position?.department ?? "";
    this.departementCode = position?.departmentCode ?? "";
    this.pays = position?.country ?? "";
    this.ville = position?.city ?? "";
    // @deprecated end

    this.timeZone = position?.timeZone ?? "Europe/Paris";

    this.slugs = new PositionSlugs(this);
  }
}
