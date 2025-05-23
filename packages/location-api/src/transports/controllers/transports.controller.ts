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
import { Controller, Get, Param, ParseIntPipe } from "@nestjs/common";
import { ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { HereTransportsService } from "../services/here-transports.service";
import { ParseLatitudePipe, ParseLongitudePipe } from "../../location/pipes";
import { StationRef } from "../classes/StationRef.class";
import { CachePrefix, UseCacheManager } from "../../cache-manager";

@ApiTags("soliguide-transports")
@Controller("transports")
export class TransportsController {
  constructor(private readonly transportService: HereTransportsService) {}

  @ApiParam({
    name: "latitude",
    required: true,
    description: "Latitude of a location to favor the closest candidates.",
    type: Number,
    example: 48.85837,
  })
  @ApiParam({
    name: "longitude",
    required: true,
    description: "Longitude of a location to favor the closest candidates.",
    type: Number,
    example: 2.3548921,
  })
  @ApiParam({
    name: "placeId",
    required: true,
    description: "This place id is needed to ask the cache",
    type: Number,
    example: 100,
  })
  @ApiResponse({
    status: 200,
    type: StationRef,
  })
  @ApiResponse({
    status: 400,
    description: "BAD_REQUEST",
  })
  @Get(":latitude/:longitude/:placeId")
  @UseCacheManager(CachePrefix.TRANSPORTS, "placeId")
  async getTransports(
    @Param("latitude", new ParseLatitudePipe()) latitude: number,
    @Param("longitude", new ParseLongitudePipe()) longitude: number,
    // Required for cache management through @UseCacheManager decorator
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Param("placeId", new ParseIntPipe()) _placeId?: number
  ) {
    return await this.transportService.getTransports(latitude, longitude);
  }
}
