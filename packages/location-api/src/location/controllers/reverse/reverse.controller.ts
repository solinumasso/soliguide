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
  UsePipes,
} from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiParam, ApiTags } from "@nestjs/swagger";
import {
  ParseLatitudePipe,
  ParseLongitudePipe,
  ValidateCountryPipe,
} from "../../pipes";
import { CountryCodes, SOLIGUIDE_COUNTRIES } from "@soliguide/common";
import { FrenchAddressService } from "../../services/french-address.service";
import { HereApiService } from "../../services/here-api/here-api.service";
import { CachePrefix } from "../../../cache-manager/enums";
import { UseCacheManager } from "../../../cache-manager";

@Controller("reverse/:country")
@ApiTags("soliguide-reverse")
@UsePipes(new ValidateCountryPipe())
export class ReverseController {
  private readonly logger = new Logger(ReverseController.name);
  constructor(
    private readonly frenchAddressService: FrenchAddressService,
    private readonly hereApiService: HereApiService
  ) {}
  @ApiOperation({
    summary: "Get adresses from a position",
  })
  @ApiResponse({
    status: 200,
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
    example: CountryCodes.FR,
  })
  @ApiParam({
    name: "latitude",
    required: true,
    type: Number,
    example: 48.85837,
  })
  @ApiParam({
    name: "longitude",
    required: true,
    type: Number,
    example: 2.294481,
  })
  @Get(":latitude/:longitude")
  @UseCacheManager(CachePrefix.LOCATION_AUTOCOMPLETE_REVERSE)
  async reverse(
    @Param("country") country: CountryCodes,
    @Param("latitude", new ParseLatitudePipe()) latitude: number,
    @Param("longitude", new ParseLongitudePipe()) longitude: number
  ) {
    // TODO: add another service when reverse does not return values
    const service = this.getService(country);

    try {
      return await service.reverse(country, latitude, longitude);
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
