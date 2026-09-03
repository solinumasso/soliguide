import { PlaceModel } from "@soliguide/api";
import { PlaceStatus, PlaceVisibility } from "@soliguide/common";
import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
  type Mock,
  type Mocked,
} from "vitest";

import { SearchQuery } from "../../search-query/search-query";

import { PlacesMongoRepository } from "./places.mongo.repository";
import { PlacesSearchQueryBuilder } from "./query-builder/search.query-builder";
import { SearchResultMapper } from "./result-mapper/search.result-mapper";

vi.mock("@soliguide/api", () => ({
  PlaceModel: {
    aggregate: vi.fn(),
    findOne: vi.fn(),
  },
  FIELDS_FOR_SEARCH: {
    API: "lieu_id name",
    ITINERARY_PUBLIC_SEARCH: "lieu_id name",
    PLACE_PUBLIC_SEARCH: "lieu_id name",
  },
}));

describe("PlacesMongoRepository", () => {
  const queryBuilder: Mocked<PlacesSearchQueryBuilder> = {
    build: vi.fn(),
  } as unknown as Mocked<PlacesSearchQueryBuilder>;

  const mapper = new SearchResultMapper();
  const repository = new PlacesMongoRepository(queryBuilder, mapper);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("applies the supplied access query to an identifier lookup", async () => {
    const place = { lieu_id: 42, name: "Food bank" };
    const exec = vi.fn().mockResolvedValue(place);
    const lean = vi.fn().mockReturnValue({ exec });
    const mapPlace = vi
      .spyOn(mapper, "mapPlace")
      .mockReturnValue(place as never);
    (PlaceModel.findOne as Mock).mockReturnValue({ lean });

    await expect(
      repository.getByIdentifier("42", {
        status: PlaceStatus.ONLINE,
        visibility: PlaceVisibility.ALL,
      })
    ).resolves.toEqual(place);

    expect(PlaceModel.findOne).toHaveBeenCalledWith({
      lieu_id: 42,
      status: PlaceStatus.ONLINE,
      visibility: PlaceVisibility.ALL,
    });
    expect(mapPlace).toHaveBeenCalledWith(place);
    mapPlace.mockRestore();
  });

  it("executes both pipelines and maps result", async () => {
    queryBuilder.build.mockReturnValue({
      resultsPipeline: [{ $match: { status: "ONLINE" } }],
      countPipeline: [{ $count: "totalResults" }],
    });

    const aggregate = vi
      .fn()
      .mockReturnValueOnce({
        allowDiskUse: vi.fn().mockResolvedValue([
          {
            lieu_id: 1,
            name: "x",
            publics: { ukrainePrecisions: "Accueil possible" },
          },
        ]),
      })
      .mockReturnValueOnce({
        allowDiskUse: vi.fn().mockResolvedValue([{ totalResults: 1 }]),
      });

    (PlaceModel.aggregate as Mock) = aggregate;

    const result = await repository.search({} as SearchQuery, {
      page: 1,
      limit: 20,
    });

    expect(result).toEqual({
      nbResults: 1,
      places: [
        {
          lieu_id: 1,
          name: "x",
          publics: {
            specialSupportContext: {
              type: "humanitarianCrisis",
              key: "ukraine-displacement",
              label: "Support for displaced people from Ukraine",
              details: "Accueil possible",
            },
          },
        },
      ],
    });
    expect(queryBuilder.build).toHaveBeenCalled();
    expect(aggregate).toHaveBeenCalledTimes(2);
  });
});
