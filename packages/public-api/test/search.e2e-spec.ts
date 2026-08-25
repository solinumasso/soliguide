import { type CanActivate, type ExecutionContext } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";
import {
  CountryCodes,
  GeoTypes,
  PlaceType,
  UserStatusNotLogged,
} from "@soliguide/common";
import request from "supertest";
import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import { SearchAuthGuard } from "../src/search/auth/search-auth.guard";
import { SearchUserContext } from "../src/search/auth/search-auth.resolver";
import { SearchModule } from "../src/search/search.module";
import { SearchService } from "../src/search/search.service";

describe("POST /search", () => {
  const searchUser: SearchUserContext = {
    status: UserStatusNotLogged.NOT_LOGGED,
    userId: "anonymous",
  };
  const searchService = {
    search: vi.fn(),
  };
  const searchAuthGuard: CanActivate = {
    canActivate(context: ExecutionContext): boolean {
      context.switchToHttp().getRequest().searchUser = searchUser;

      return true;
    },
  };
  let app: NestFastifyApplication;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [SearchModule],
    })
      .overrideGuard(SearchAuthGuard)
      .useValue(searchAuthGuard)
      .overrideProvider(SearchService)
      .useValue(searchService)
      .compile();

    app = module.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter()
    );
    await app.init();
    await app.listen(0, "127.0.0.1");
  });

  afterAll(async () => {
    await app?.close();
  });

  beforeEach(() => {
    vi.clearAllMocks();
    searchService.search.mockResolvedValue({ nbResults: 0, places: [] });
  });

  it("rejects an invalid payload before calling the search service", async () => {
    await request(app.getHttpServer())
      .post("/search")
      .send({ locations: "not-an-array" })
      .expect(400);

    expect(searchService.search).not.toHaveBeenCalled();
  });

  it("delegates the validated payload and guard-resolved user", async () => {
    const payload = {
      locations: [{ geoType: GeoTypes.COUNTRY, geoValue: CountryCodes.FR }],
      placeType: PlaceType.PLACE,
    };

    await request(app.getHttpServer())
      .post("/search")
      .send(payload)
      .expect(200)
      .expect({ nbResults: 0, places: [] });

    expect(searchService.search).toHaveBeenCalledWith(payload, searchUser);
  });
});
