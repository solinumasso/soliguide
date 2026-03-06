import { Test } from "@nestjs/testing";
import {
  FastifyAdapter,
  type NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { CONFIG_VALIDATOR } from "../../../config";
import { CacheManagerService } from "../../../cache-manager/services/cache-manager.service";
import { PublicHolidaysService } from "../../services/public-holidays.service";
import { HolidaysModule } from "../../holidays.module";
import { addYears } from "date-fns";
import { GenerateHolidaysService } from "../../services/generate-holidays.service";
import { CacheManagerModule } from "../../../cache-manager";

// we use next year to try all dates in a year
const year = addYears(new Date(), 1).getFullYear();

describe("E2E - Holidays endpoints", () => {
  let app: NestFastifyApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          validationSchema: CONFIG_VALIDATOR,
        }),
        CacheManagerModule,
        HolidaysModule,
      ],
      providers: [
        ConfigService,
        CacheManagerService,
        GenerateHolidaysService,
        PublicHolidaysService,
      ],
    }).compile();

    app = moduleRef.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter()
    );
    await app.init();
  });

  it(`/GET ${year}-12-25 is a holiday in 75001 (Holidays for all FR country)`, async () => {
    const response = await app.inject({
      method: "GET",
      url: `/holidays/fr/${year}-12-25?postalCode=75001`,
    });

    expect(response.statusCode).toEqual(200);
    const result = response.json();
    expect(result.length).toEqual(1);
    expect(result[0]).toMatchObject({
      departments: [],
      endDate: `${year}-12-25`,
      isNational: true,
      name: "Noël",
      startDate: `${year}-12-25`,
    });
  });

  it(`/GET ${year}-12-26 is not a holiday in 75001 (Holidays for Alsace-Moselle)`, async () => {
    const response = await app.inject({
      method: "GET",
      url: `/holidays/fr/${year}-12-26?postalCode=75001`,
    });

    expect(response.statusCode).toEqual(200);
    expect(response.json()).toEqual([]);
  });

  it(`/GET ${year}-12-26 is not a holiday in 68000 => Alsace (Holidays for Alsace-Moselle)`, async () => {
    const response = await app.inject({
      method: "GET",
      url: `/holidays/fr/${year}-12-26?postalCode=68000`,
    });

    expect(response.statusCode).toEqual(200);
    const result = response.json();
    expect(result.length).toEqual(1);
    expect(result[0]).toMatchObject({
      departments: ["57", "67", "68"],
      endDate: `${year}-12-26`,
      isNational: false,
      name: "2ème jour de Noël",
      startDate: `${year}-12-26`,
    });
  });

  it(`/GET ${year}-04-27 is a holiday in 97650 => M Tsangamouji (Holidays Juste for Mayotte)`, async () => {
    const response = await app.inject({
      method: "GET",
      url: `/holidays/fr/${year}-04-27?postalCode=97650`,
    });

    expect(response.statusCode).toEqual(200);
    const result = response.json();
    expect(result.length).toEqual(1);
    expect(result[0]).toMatchObject({
      departments: ["976"],
      endDate: `${year}-04-27`,
      isNational: false,
      name: "Abolition de l'esclavage",
      startDate: `${year}-04-27`,
    });
  });
  it(`/GET ${year}-12-26 is not a holiday in 75001 => (Holidays Juste for Mayotte)`, async () => {
    const response = await app.inject({
      method: "GET",
      url: `/holidays/fr/${year}-04-27?postalCode=75001`,
    });

    expect(response.statusCode).toEqual(200);
    expect(response.json()).toEqual([]);
  });

  it(`/GET ${year}-12-25 holidays for FR country)`, async () => {
    const response = await app.inject({
      method: "GET",
      url: `/holidays/fr/${year}-12-25`,
    });

    expect(response.statusCode).toEqual(200);
    const result = response.json();
    expect(result.length).toEqual(1);
    expect(result[0]).toMatchObject({
      departments: [],
      endDate: `${year}-12-25`,
      isNational: true,
      name: "Noël",
      startDate: `${year}-12-25`,
    });
  });

  it(`/GET ${year}-12-26 holidays for FR country (Holidays for Alsace-Moselle)`, async () => {
    const response = await app.inject({
      method: "GET",
      url: `/holidays/fr/${year}-12-26`,
    });

    expect(response.statusCode).toEqual(200);
    const result = response.json();
    expect(result.length).toEqual(1);
    expect(result[0]).toMatchObject({
      endDate: `${year}-12-26`,
      isNational: false,
      startDate: `${year}-12-26`,
    });
  });
  afterAll(async () => {
    await app.close();
  });

  it(`/GET ${year}-12-27 holidays for FR country (No Holidays for FR country)`, async () => {
    const response = await app.inject({
      method: "GET",
      url: `/holidays/fr/${year}-12-27`,
    });

    expect(response.statusCode).toEqual(200);
    const body = response.json();
    expect(body.length).toEqual(0);
  });

  afterAll(async () => await app.close());
});
