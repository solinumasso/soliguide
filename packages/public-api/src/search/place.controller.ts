import {
  Controller,
  Get,
  NotFoundException,
  Param,
  UseGuards,
} from "@nestjs/common";
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";

import { VersionedResources } from "../api-version.interceptor";
import { User } from "../common/decorators";
import { SearchAuthGuard } from "./auth/search-auth.guard";
import { SearchUserContext } from "./auth/search-auth.resolver";
import { CanonicalPlaceResponse } from "./canonical-place-response";
import { SearchService } from "./search.service";

@ApiTags("places")
@Controller("places")
export class PlaceController {
  constructor(private readonly searchApplicationService: SearchService) {}

  @Get(":placeId")
  @UseGuards(SearchAuthGuard)
  @ApiOperation({
    operationId: "get-place",
    summary: "Get a place by its identifier",
  })
  @ApiParam({
    name: "placeId",
    description: "Numeric lieu_id or SEO URL of the place.",
  })
  @ApiResponse({ status: 200, description: "Place information" })
  @VersionedResources({ response: "place-response" })
  async getPlace(
    @Param("placeId") placeId: string,
    @User() user: SearchUserContext
  ): Promise<CanonicalPlaceResponse> {
    const place = await this.searchApplicationService.getPlace(placeId, user);

    if (!place) {
      throw new NotFoundException({ message: "PLACE_NOT_FOUND" });
    }

    return place;
  }
}
