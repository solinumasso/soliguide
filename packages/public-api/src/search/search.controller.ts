import {
  BadRequestException,
  Body,
  Controller,
  Req,
  Post,
  UseGuards,
  HttpCode,
} from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

import { SearchService } from "./search.service";
import {
  v20260101SearchRequestSchema,
  V20260101SearchRequest,
} from "../versions/2026-01-01/2026-01-01.search-request.schema.generated";
import {
  v20260101SearchResponseSchema,
  V20260101SearchResponse,
} from "../versions/2026-01-01/2026-01-01.search-response.schema.generated";
import { SearchUserContext } from "./auth/search-auth.resolver";
import { SearchAuthGuard } from "./auth/search-auth.guard";

type SearchRequest = {
  searchUser: SearchUserContext;
};

@ApiTags("search")
@Controller("search")
export class SearchController {
  constructor(private readonly searchApplicationService: SearchService) {}

  @Post()
  @HttpCode(200)
  @UseGuards(SearchAuthGuard)
  @ApiOperation({
    operationId: "search-places",
    summary: "Search places",
  })
  @ApiResponse({ status: 200, description: "Search results" })
  async search(
    @Body() body: unknown,
    @Req() req: SearchRequest
  ): Promise<V20260101SearchResponse> {
    const parsedRequest = this.parseRequest(body);
    const result = await this.searchApplicationService.search(
      parsedRequest,
      req.searchUser
    );

    return this.parseResponse(result);
  }

  private parseRequest(body: unknown): V20260101SearchRequest {
    const parsed = v20260101SearchRequestSchema.safeParse(body);

    if (!parsed.success) {
      throw new BadRequestException({
        message: "INVALID_SEARCH_REQUEST",
        details: parsed.error.flatten(),
      });
    }

    return parsed.data;
  }

  private parseResponse(response: unknown): V20260101SearchResponse {
    const parsed = v20260101SearchResponseSchema.safeParse(response);

    if (!parsed.success) {
      throw new BadRequestException({
        message: "INVALID_SEARCH_RESPONSE",
        details: parsed.error.flatten(),
      });
    }

    return parsed.data;
  }
}
