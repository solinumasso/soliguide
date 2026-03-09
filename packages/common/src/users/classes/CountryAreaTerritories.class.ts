import { SoliguideCountries, DepartmentCode, RegionCode } from "../../location";

export class CountryAreaTerritories<CountryCode extends SoliguideCountries> {
  public departments: Array<DepartmentCode<CountryCode>>;
  public regions: Array<RegionCode<CountryCode>>;
  public cities: Array<{
    city: string;
    department: DepartmentCode<CountryCode>;
  }>;

  constructor(area?: Partial<CountryAreaTerritories<CountryCode>>) {
    this.departments = area?.departments ?? [];
    this.regions = area?.regions ?? [];
    this.cities = area?.cities ?? [];
  }
}
