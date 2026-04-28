import {
  Body,
  Controller,
  Post,
  UseGuards,
  HttpCode,
  UsePipes,
} from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

import { VersionedResources } from "../api-version.interceptor";
import { SearchUserContext } from "./auth/search-auth.resolver";
import { SearchAuthGuard } from "./auth/search-auth.guard";
import { User } from "../common/decorators";
import { ZodValidationPipe } from "../common/pipes/zod-validation.pipe";
import { SearchService } from "./search.service";
import {
  CanonicalSearchRequest,
  CanonicalZodRequestSchema,
} from "./canonical-search-request";
import { CanonicalSearchResponse } from "./canonical-search-response";

@ApiTags("search")
@Controller("search")
export class SearchController {
  constructor(private readonly searchApplicationService: SearchService) {}

  @Post()
  @HttpCode(200)
  @UseGuards(SearchAuthGuard)
  @UsePipes(new ZodValidationPipe(CanonicalZodRequestSchema))
  @ApiOperation({
    operationId: "search-places",
    summary: "Search places",
  })
  @ApiResponse({ status: 200, description: "Search results" })
  @VersionedResources({
    request: "search-request",
    response: "search-response",
  })
  async search(
    @Body() dto: CanonicalSearchRequest,
    @User() user: SearchUserContext
  ): Promise<CanonicalSearchResponse> {
    return this.searchApplicationService.search(dto, user);
  }
}
