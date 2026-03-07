import {
  Controller,
  Get,
  Param,
  ParseBoolPipe,
  ParseIntPipe,
  Query,
} from "@nestjs/common";
import { ApiParam, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CachePrefix, UseCacheManager } from "../../cache-manager";
import { ParseLatitudePipe, ParseLongitudePipe } from "../../location/pipes";
import { StationRef } from "../classes/StationRef.class";
import { HereTransportsService } from "../services/here-transports.service";

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
  @ApiQuery({
    name: "refresh",
    required: false,
    description: "Set to 'true' to force refresh and bypass cache",
    type: String,
    example: "true",
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
    @Param("placeId", new ParseIntPipe()) _placeId?: number,
    // Used by CacheManagerInterceptor to bypass cache when refresh=true
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Query("refresh", new ParseBoolPipe({ optional: true })) _refresh?: boolean
  ) {
    return await this.transportService.getTransports(latitude, longitude);
  }
}
