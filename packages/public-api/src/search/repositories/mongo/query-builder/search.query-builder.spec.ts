import { CountryCodes, GeoTypes } from "@soliguide/common";
import { describe, expect, it } from "vitest";

import { SearchQuery } from "../../../search-query/search-query";

import { PlacesSearchQueryBuilder } from "./search.query-builder";

describe("PlacesSearchQueryBuilder", () => {
  const builder = new PlacesSearchQueryBuilder();

  it("builds geoNear pipelines for position searches", () => {
    const location = {
      geoType: GeoTypes.POSITION,
      coordinates: [2.3522, 48.8566],
      distance: 5,
      country: CountryCodes.FR,
    };
    const query = {
      locations: [location],
      proximity: location,
      placeType: "PLACE",
    } as unknown as SearchQuery;

    const pipelines = builder.build(query, { page: 1, limit: 20 });

    expect(pipelines.resultsPipeline[0]).toHaveProperty("$geoNear");
    expect(pipelines.countPipeline[pipelines.countPipeline.length - 1]).toEqual(
      {
        $count: "totalResults",
      }
    );
  });

  it("does not add closed-place sorting when it is disabled", () => {
    const location = {
      geoType: GeoTypes.POSITION,
      coordinates: [2.3522, 48.8566],
      distance: 5,
      country: CountryCodes.FR,
    };
    const query = {
      closedPlacesLast: false,
      locations: [location],
      proximity: location,
      placeType: "PLACE",
    } as unknown as SearchQuery;

    const pipelines = builder.build(query, { page: 1, limit: 20 });

    expect(pipelines.resultsPipeline).not.toContainEqual(
      expect.objectContaining({ $sort: expect.any(Object) })
    );
  });

  it("keeps requested sorting as the only sort when closed-place sorting is disabled", () => {
    const query = {
      closedPlacesLast: false,
      options: {
        sortBy: "lieu_id",
        sortValue: -1,
      },
      placeType: "PLACE",
    } as unknown as SearchQuery;

    const pipelines = builder.build(query, { page: 1, limit: 20 });

    expect(pipelines.resultsPipeline).toContainEqual({
      $sort: { lieu_id: -1 },
    });
  });

  it("sorts public searches like the legacy new-search route", () => {
    const location = {
      geoType: GeoTypes.POSITION,
      coordinates: [2.3522, 48.8566],
      distance: 5,
      country: CountryCodes.FR,
    };
    const query = {
      closedPlacesLast: true,
      locations: [location],
      proximity: location,
      placeType: "PLACE",
    } as unknown as SearchQuery;

    const pipelines = builder.build(query, { page: 1, limit: 20 });

    expect(pipelines.resultsPipeline).toContainEqual({
      $addFields: {
        statusSort: {
          $cond: {
            if: { $eq: ["$status", "PERMANENTLY_CLOSED"] },
            then: 1,
            else: 0,
          },
        },
      },
    });
    expect(pipelines.resultsPipeline).toContainEqual({
      $sort: { statusSort: 1, distance: 1 },
    });
  });

  it("injects api user restrictions into match stage", () => {
    const query = {
      apiUserRestrictions: {
        $or: [
          {
            "position.departmentCode": { $in: ["75"] },
            "position.country": "fr",
          },
        ],
      },
      placeType: "PLACE",
    } as unknown as SearchQuery;

    const pipelines = builder.build(query, { page: 1, limit: 20 });

    expect(pipelines.resultsPipeline[0]).toEqual(
      expect.objectContaining({
        $match: {
          $and: expect.arrayContaining([
            {
              $or: [
                {
                  "position.departmentCode": { $in: ["75"] },
                  "position.country": "fr",
                },
              ],
            },
          ]),
        },
      })
    );
  });

  it("keeps CategoriesQueryBuilder before service-level builders", () => {
    const stepBuilderNames = (
      builder as unknown as {
        stepBuilders: Array<{ constructor: { name: string } }>;
      }
    ).stepBuilders.map((stepBuilder) => stepBuilder.constructor.name);

    const categoriesBuilderIndex = stepBuilderNames.indexOf(
      "CategoriesQueryBuilder"
    );
    const audienceBuilderIndex = stepBuilderNames.indexOf(
      "AudienceQueryBuilder"
    );
    const modalitiesBuilderIndex = stepBuilderNames.indexOf(
      "ModalitiesQueryBuilder"
    );
    const openTodayBuilderIndex = stepBuilderNames.indexOf(
      "OpenTodayConstraintQueryBuilder"
    );

    expect(categoriesBuilderIndex).toBeGreaterThanOrEqual(0);
    expect(audienceBuilderIndex).toBeGreaterThanOrEqual(0);
    expect(modalitiesBuilderIndex).toBeGreaterThanOrEqual(0);
    expect(openTodayBuilderIndex).toBeGreaterThanOrEqual(0);
    expect(categoriesBuilderIndex).toBeLessThan(audienceBuilderIndex);
    expect(categoriesBuilderIndex).toBeLessThan(modalitiesBuilderIndex);
    expect(categoriesBuilderIndex).toBeLessThan(openTodayBuilderIndex);
  });
});
