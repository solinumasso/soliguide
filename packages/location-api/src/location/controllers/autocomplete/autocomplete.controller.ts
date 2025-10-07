/*
 * Soliguide: Useful information for those who need it
 *
 * SPDX-FileCopyrightText: © 2024 Solinum
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
import {
  BadRequestException,
  Controller,
  Get,
  Logger,
  Param,
  Query,
  UsePipes,
} from "@nestjs/common";
import { AutoCompleteResults } from "../../classes/AutoCompleteResults.class";
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { ParseGeoTypePipe, ValidateCountryPipe } from "../../pipes";
import { FrenchAddressService } from "../../services/french-address.service";
import {
  CountryCodes,
  GeoTypes,
  LocationAutoCompleteAddress,
  SoliguideCountries,
  COUNTRIES_LOCATION,
  SOLIGUIDE_COUNTRIES,
  extractGeoTypeFromSearch,
} from "@soliguide/common";
import { ParseSearchPipe } from "../../pipes/ParseSearch.pipe";
import { DepartmentsAndRegionsService } from "../../services/departments-regions.service";
import { HereApiService } from "../../services/here-api/here-api.service";
import { cleanSearchValue } from "../../services/clean-search-value";
import { CachePrefix, UseCacheManager } from "../../../cache-manager";

@ApiTags("soliguide-location-autocomplete")
@UsePipes(new ValidateCountryPipe())
@Controller("autocomplete/:country")
export class AutocompleteController {
  private readonly logger = new Logger(AutocompleteController.name);

  constructor(
    private readonly departmentsAndRegionsService: DepartmentsAndRegionsService,
    private readonly frenchAddressService: FrenchAddressService,
    private readonly hereApiService: HereApiService
  ) {}

  @Get("all/:search")
  @UseCacheManager(CachePrefix.LOCATION_AUTOCOMPLETE_ALL)
  @ApiOperation({
    summary: "Get adresses, cities, regions, departments from a query",
  })
  @ApiResponse({
    status: 200,
    type: AutoCompleteResults,
  })
  @ApiResponse({
    status: 400,
    description: "Bad request",
  })
  @ApiParam({
    name: "country",
    required: true,
    description: "Country in which research",
    type: String,
    enum: SOLIGUIDE_COUNTRIES,
  })
  @ApiParam({
    schema: { minLength: 2 },
    name: "search",
    required: true,
    example: "1 esplanade Jean Moulin Bobigny",
    description:
      "Query string for searching addresses, cities, etc. Must be at least 2 characters long.",
    type: String,
  })
  @ApiQuery({
    name: "latitude",
    required: false,
    description: "Latitude of a location to favor the closest candidates.",
    type: Number,
  })
  @ApiQuery({
    name: "longitude",
    required: false,
    description: "Longitude of a location to favor the closest candidates.",
    type: Number,
  })
  @ApiQuery({
    name: "geoType",
    required: false,
    description: "Type of address sought: department, region, etc.",
    enum: GeoTypes,
  })
  async getAddressesInNestedObject(
    @Param("country") country: SoliguideCountries,
    @Param("search", new ParseSearchPipe())
    search: string,
    @Query("latitude") latitude?: number,
    @Query("longitude") longitude?: number,
    @Query("geoType", ParseGeoTypePipe) geoType?: GeoTypes
  ) {
    const cleanedSearch = extractGeoTypeFromSearch(search, country);

    search = cleanedSearch.search;
    geoType = geoType ?? cleanedSearch?.geoType;

    const service = this.getService(country);
    search = cleanSearchValue(country, search);

    try {
      let results: LocationAutoCompleteAddress[] = [];

      if (!geoType || geoType === GeoTypes.COUNTRY) {
        const countries = Object.values(COUNTRIES_LOCATION).filter(
          (element: LocationAutoCompleteAddress) =>
            new RegExp(search, "gi").test(element.label)
        );
        results = results.concat(countries);
      }

      if (!geoType || geoType === GeoTypes.REGION) {
        const regions =
          this.departmentsAndRegionsService.searchDepartmentOrRegion(
            search,
            GeoTypes.REGION,
            country
          );
        results = results.concat(regions);
      }
      if (!geoType || geoType === GeoTypes.DEPARTMENT) {
        const departments =
          this.departmentsAndRegionsService.searchDepartmentOrRegion(
            search,
            GeoTypes.DEPARTMENT,
            country
          );
        results = results.concat(departments);
      }

      if (
        !geoType ||
        geoType === GeoTypes.POSITION ||
        geoType === GeoTypes.CITY ||
        geoType === GeoTypes.BOROUGH
      ) {
        // Split "paris 75018" to search postal code only
        if (geoType === GeoTypes.BOROUGH) {
          const parts = search.split(" ");
          search = parts.length > 1 ? parts[parts.length - 1] : search;
        }

        let pois = await service.searchForLocation(
          country,
          search,
          latitude,
          longitude
        );

        // If only some geoType is needed, filter by geoType
        if (geoType === GeoTypes.CITY || geoType === GeoTypes.BOROUGH) {
          pois = pois.filter((location) => location.geoType === geoType);
        }

        results = results.concat(pois);
      }

      return results;
    } catch (e) {
      this.logger.error(e, (e as Error).stack);
      throw new BadRequestException();
    }
  }

  @Get("address/:search")
  @UseCacheManager(CachePrefix.LOCATION_AUTOCOMPLETE_ADDRESSES_ONLY)
  @ApiOperation({
    summary: "Get adresses from a query",
  })
  @ApiResponse({
    status: 200,
    type: AutoCompleteResults,
  })
  @ApiResponse({
    status: 400,
    description: "Bad request",
  })
  @ApiParam({
    name: "search",
    required: true,
    description:
      "Query string for searching addresses. Must be at least 3 characters long.",
    type: String,
  })
  @ApiParam({
    name: "country",
    required: true,
    description: "Country in which research",
    type: String,
    enum: SOLIGUIDE_COUNTRIES,
  })
  @ApiQuery({
    name: "latitude",
    required: false,
    description: "Latitude of a location to favor the closest candidates.",
    type: Number,
  })
  @ApiQuery({
    name: "longitude",
    required: false,
    description: "Longitude of a location to favor the closest candidates.",
    type: Number,
  })
  async getLocationInOneArray(
    @Param("country") country: CountryCodes,
    @Param("search", new ParseSearchPipe()) search: string,
    @Query("latitude") latitude?: number,
    @Query("longitude") longitude?: number
  ) {
    const service = this.getService(country);

    search = cleanSearchValue(country, search);
    try {
      return await service.searchForLocation(
        country,
        search,
        latitude,
        longitude
      );
    } catch (e) {
      this.logger.error(e);
      throw new BadRequestException();
    }
  }

  private getService(country: CountryCodes) {
    if (country === CountryCodes.FR) {
      return this.frenchAddressService;
    }
    return this.hereApiService;
  }
}
