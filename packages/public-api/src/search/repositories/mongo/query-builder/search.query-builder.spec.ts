import { CountryCodes, GeoTypes } from "@soliguide/common";
import { describe, expect, it } from "vitest";

import { SearchQuery } from "../../../search-query/search-query";

import { PlacesSearchQueryBuilder } from "./search.query-builder";

describe("PlacesSearchQueryBuilder", () => {
  const builder = new PlacesSearchQueryBuilder();

  it("builds geoNear pipelines for position searches", () => {
    const query = {
      locations: [
        {
          geoType: GeoTypes.POSITION,
          coordinates: [2.3522, 48.8566],
          distance: 5,
          country: CountryCodes.FR,
        },
      ],
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
