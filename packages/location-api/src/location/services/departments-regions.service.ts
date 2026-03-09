import { Injectable } from "@nestjs/common";
import {
  AD_REGIONS_DEF,
  CountryCodes,
  DEPARTMENTS_MAP,
  DepartmentInfoContent,
  ES_REGIONS_DEF,
  FR_OVERSEAS_REGIONS,
  FR_REGIONS_DEF,
  GeoTypes,
  LocationAutoCompleteAddress,
  PositionSlugs,
  RegionCode,
  RegionDef,
  SoliguideCountries,
  getDepartmentCodeFromPostalCode,
  slugLocation,
  slugString,
} from "@soliguide/common";
import Fuse, { FuseResult, IFuseOptions } from "fuse.js";
import { GEO_TYPES_KEYS } from "../constants";
import { getGeoValue } from "./get-geo-value";

export const COMMON_FUSE_CONFIG: IFuseOptions<unknown> = {
  threshold: 0.2,
  location: 0,
  minMatchCharLength: 4,
  shouldSort: true,
  distance: 2,
  findAllMatches: false,
};

@Injectable()
export class DepartmentsAndRegionsService {
  private readonly FUSE_REGIONS_OPTIONS: IFuseOptions<
    RegionDef<SoliguideCountries>
  > = {
    keys: [
      {
        name: "regionName",
        getFn: (obj: { regionName: string }) => slugString(obj.regionName),
      },
      {
        name: "regionCode",
      },
    ],
    ...COMMON_FUSE_CONFIG,
  };

  private readonly FUSE_DEPARTMENTS_OPTIONS: IFuseOptions<{
    departmentName: string;
    departmentCode: string;
  }> = {
    keys: [
      {
        name: "departmentName",
        getFn: (obj: { departmentName: string }) =>
          slugString(obj.departmentName),
      },
      { name: "departmentCode" },
    ],
    ...COMMON_FUSE_CONFIG,
  };

  private fuseDepartments: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key in SoliguideCountries]?: Fuse<any>;
  } = {
    [CountryCodes.FR]: new Fuse(
      Object.values(DEPARTMENTS_MAP[CountryCodes.FR]),
      this.FUSE_DEPARTMENTS_OPTIONS
    ),
    [CountryCodes.AD]: new Fuse(
      Object.values(DEPARTMENTS_MAP[CountryCodes.AD]),
      this.FUSE_DEPARTMENTS_OPTIONS
    ),
    [CountryCodes.ES]: new Fuse(
      Object.values(DEPARTMENTS_MAP[CountryCodes.ES]),
      {
        keys: ["departmentName", "departmentCode", "otherNames.name"],
        threshold: 0.4,
      }
    ),
  };

  private fuseRegions: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key in SoliguideCountries]?: Fuse<any>;
  } = {
    [CountryCodes.FR]: new Fuse(FR_REGIONS_DEF, this.FUSE_REGIONS_OPTIONS),
    [CountryCodes.ES]: new Fuse(ES_REGIONS_DEF, this.FUSE_REGIONS_OPTIONS),
    [CountryCodes.AD]: new Fuse(AD_REGIONS_DEF, this.FUSE_REGIONS_OPTIONS),
  };

  public searchDepartmentOrRegion(
    search: string,
    geoType: GeoTypes.DEPARTMENT | GeoTypes.REGION,
    countryCode: SoliguideCountries
  ): LocationAutoCompleteAddress[] {
    let positions: LocationAutoCompleteAddress[] = [];

    if (geoType === GeoTypes.DEPARTMENT) {
      const items =
        this.fuseDepartments[countryCode].search<
          DepartmentInfoContent<typeof countryCode>
        >(search);

      items.forEach(
        ({ item }: FuseResult<DepartmentInfoContent<typeof countryCode>>) => {
          const name = item.departmentName;

          const position: LocationAutoCompleteAddress = {
            city: undefined,
            cityCode: undefined,
            postalCode: undefined,
            label: name,
            name: name,
            coordinates: item.coordinates,
            department: name,
            departmentCode: item.departmentCode,
            region: item.regionName,
            regionCode: item.regionCode,
            geoType: GeoTypes.DEPARTMENT,
            geoValue: `${
              GEO_TYPES_KEYS[countryCode].departement
            }-${slugLocation(name)}`,
            country: countryCode,
            slugs: {},
            timeZone: item.timeZone,
          };
          position.slugs = new PositionSlugs(position);
          positions.push(position);
        }
      );
    } else {
      const items =
        this.fuseRegions[countryCode].search<RegionDef<typeof countryCode>>(
          search
        );

      items.forEach(({ item }: FuseResult<RegionDef<typeof countryCode>>) => {
        const position: LocationAutoCompleteAddress = {
          postalCode: undefined,
          city: undefined,
          cityCode: undefined,
          department: undefined,
          departmentCode: undefined,
          label: item.regionName,
          name: item.regionName,
          region: item.regionName,
          regionCode: item.regionCode,
          coordinates: item.coordinates,
          geoType: GeoTypes.REGION,
          geoValue: undefined,
          country: countryCode,
          slugs: {},
          timeZone: item.timeZone,
        };

        position.geoValue = getGeoValue(position);
        position.slugs = new PositionSlugs(position);
        positions.push(position);
      });
    }

    // For French Regions, we display only departments
    if (geoType === GeoTypes.REGION && countryCode === CountryCodes.FR) {
      positions = positions.filter(
        (position) =>
          !FR_OVERSEAS_REGIONS.includes(
            position.regionCode as RegionCode<CountryCodes.FR>
          )
      );
    }

    return positions.slice(0, 5);
  }

  public getDepartmentAndRegion(
    country: SoliguideCountries,
    position: LocationAutoCompleteAddress
  ): LocationAutoCompleteAddress {
    if (position.postalCode) {
      position.departmentCode = getDepartmentCodeFromPostalCode(
        country,
        position.postalCode
      );
    }

    if (position?.geoType === GeoTypes.REGION) {
      delete position.postalCode;
      delete position.city;
      delete position.cityCode;
      delete position.department;
      delete position.departmentCode;
    } else if (position?.geoType === GeoTypes.DEPARTMENT) {
      delete position.city;
      delete position.cityCode;
      delete position.postalCode;
    } else if (position?.cityCode) {
      position.departmentCode = getDepartmentCodeFromPostalCode(
        country,
        position.cityCode
      );
    } else if (position?.postalCode) {
      position.departmentCode = getDepartmentCodeFromPostalCode(
        country,
        position.postalCode
      );
    }

    if (position.departmentCode) {
      const department = DEPARTMENTS_MAP[country][position.departmentCode];
      position.department = department.departmentName;
      position.regionCode = department.regionCode;
      position.region = department.regionName;
      position.timeZone = department.timeZone;
    }

    position.slugs = new PositionSlugs(position);
    return position;
  }
}
