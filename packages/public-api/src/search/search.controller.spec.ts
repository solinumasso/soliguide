import { BadRequestException } from "@nestjs/common";
import { UserStatusNotLogged } from "@soliguide/common";
import { beforeEach, describe, expect, it, vi, type Mocked } from "vitest";

import { SearchController } from "./search.controller";
import { SearchService } from "./search.service";

describe("SearchController", () => {
  const applicationService: Mocked<SearchService> = {
    search: vi.fn(),
  } as unknown as Mocked<SearchService>;

  const controller = new SearchController(applicationService);

  beforeEach(() => {
    vi.clearAllMocks();
    applicationService.search.mockResolvedValue({ nbResults: 0, places: [] });
  });

  it("rejects invalid payload", async () => {
    await expect(controller.search({}, buildRequest())).rejects.toThrow(
      BadRequestException
    );
  });

  it("delegates valid request using guard-resolved user", async () => {
    const payload = {
      location: { geoType: "pays", geoValue: "FR" },
      placeType: "LIEU",
    };

    const req = buildRequest();

    await controller.search(payload, req);

    expect(applicationService.search).toHaveBeenCalledWith(
      payload,
      req.searchUser
    );
  });
});

function buildRequest() {
  return {
    searchUser: {
      userId: "anonymous",
      status: UserStatusNotLogged.NOT_LOGGED,
    },
  };
}
