import { DEPARTMENTS_MAP } from "../constants";
import { CountryCodes, SoliguideCountries } from "../enums";
import { getDepartmentCodeFromPostalCode } from "../functions";
import { LocationAutoCompleteAddress } from "../interfaces";
import { AnyDepartmentCode } from "../types";

// @Deprecated
export class LocationAreas {
  public _id?: { id: boolean };

  // @Deprecated start ---
  public ville?: string;
  public codePostal?: string;
  public departement?: string;
  public departementCode?: string;
  public pays?: string;
  // @Deprecated end ---

  // Optionnal fields
  public city?: string;
  public cityCode?: string;
  public department?: string;
  public departmentCode?: AnyDepartmentCode;

  public postalCode?: string;

  // Required fields
  public country: SoliguideCountries;
  public region?: string;
  public regionCode?: string;

  // TODO: check with team data if it's needed
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public slugs: any;

  constructor(data?: Partial<LocationAutoCompleteAddress>) {
    // DEPRECATED START
    this.codePostal = data?.postalCode ?? undefined;
    this.departement = data?.department ?? undefined;
    this.departementCode = data?.departmentCode ?? undefined;
    this.pays = data?.country ?? undefined;
    this.ville = data?.city ?? undefined;
    // DEPRECATED END

    this.cityCode = data?.cityCode;
    this.postalCode = data?.postalCode;
    this.city = data?.city;
    this.country = data?.country ?? CountryCodes.FR;

    if (data?.cityCode) {
      this.departmentCode = getDepartmentCodeFromPostalCode(
        this.country,
        data.cityCode
      );
      this.departementCode = getDepartmentCodeFromPostalCode(
        this.country,
        data.cityCode
      );
    } else if (data?.postalCode) {
      this.departmentCode = getDepartmentCodeFromPostalCode(
        this.country,
        data.postalCode
      );
      this.departementCode = getDepartmentCodeFromPostalCode(
        this.country,
        data.postalCode
      );
    }

    if (this.departmentCode) {
      const department = DEPARTMENTS_MAP[this.country][this.departmentCode];
      if (department) {
        this.department = department.departmentName;
        this.departement = department.departmentName;
        this.region = department.regionName;
        this.regionCode = department.regionCode;
      }
    }
  }
}
