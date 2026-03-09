import { Test } from "@nestjs/testing";
import {
  FastifyAdapter,
  type NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { CountryCodes, GeoTypes } from "@soliguide/common";

import { LocationModule } from "../../location.module";
import { CONFIG_VALIDATOR } from "../../../config";
import { CacheManagerModule } from "../../../cache-manager";

describe("E2E - Location autocomplete endpoints", () => {
  let app: NestFastifyApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          validationSchema: CONFIG_VALIDATOR,
        }),
        CacheManagerModule,
        LocationModule,
      ],
      providers: [ConfigService],
    }).compile();

    app = moduleRef.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter()
    );
    await app.init();
  });

  describe("/autocomplete/AD", () => {
    it(`/GET autocomplete/AD: should return Andorra`, async () =>
      await app
        .inject({
          method: "GET",
          url: "/autocomplete/AD/all/and",
        })
        .then((response) => {
          const body = response.json();
          expect(response.statusCode).toEqual(200);
          expect(body[0]).toEqual({
            label: "Andorra",
            coordinates: [1.5255804423331272, 42.50583018383308],
            geoType: GeoTypes.COUNTRY,
            geoValue: "andorra",
            country: CountryCodes.AD,
            slugs: {
              country: CountryCodes.AD,
              pays: CountryCodes.AD,
            },
          });
        }));

    it(`/GET autocomplete/AD/encamp: should return a region first, then a city`, async () =>
      await app
        .inject({
          method: "GET",
          url: "/autocomplete/AD/all/encam",
        })
        .then((response) => {
          const body = response.json();
          expect(response.statusCode).toEqual(200);
          expect(body[0]).toEqual({
            label: "Encamp",
            coordinates: [1.5836096, 42.5360425],
            country: CountryCodes.AD,
            region: "Encamp",
            regionCode: "03",
            geoValue: "parroquia-encamp",
            slugs: {
              country: CountryCodes.AD,
              pays: CountryCodes.AD,
              region: "encamp",
            },
            name: "Encamp",
            geoType: GeoTypes.REGION,
            timeZone: "Europe/Andorra",
          });

          // body[1] is a department

          expect(body[2]).toEqual({
            label: "Encamp, Andorra",
            city: "Encamp",
            coordinates: [1.58273, 42.53638],
            country: CountryCodes.AD,
            region: "Encamp",
            regionCode: "03",
            geoValue: "encamp-AD200",
            department: "Encamp",
            departmentCode: "03",
            postalCode: "AD200",
            cityCode: "AD200",
            slugs: {
              city: "encamp",
              country: "ad",
              departement: "encamp",
              department: "encamp",
              pays: "ad",
              region: "encamp",
              ville: "encamp",
            },
            name: "Encamp",
            geoType: GeoTypes.CITY,
            timeZone: "Europe/Andorra",
          });
        }));

    it(`/GET autocomplete/AD/Soldeu : should return a city`, async () =>
      await app
        .inject({
          method: "GET",
          url: "/autocomplete/AD/all/Soldeu",
        })
        .then((response) => {
          const body = response.json();
          expect(response.statusCode).toEqual(200);

          expect(body[0]).toEqual({
            city: "Canillo",
            cityCode: "AD100",
            coordinates: [1.66779, 42.5767],
            country: "ad",
            department: "Canillo",
            departmentCode: "02",
            geoType: GeoTypes.BOROUGH,
            geoValue: "canillo-AD100",
            label: "Soldeu, Canillo, Andorra",
            name: "Soldeu, Canillo, Andorra",
            postalCode: "AD100",
            region: "Canillo",
            regionCode: "02",
            slugs: {
              city: "canillo",
              country: "ad",
              departement: "canillo",
              department: "canillo",
              pays: "ad",
              region: "canillo",
              ville: "canillo",
            },
            timeZone: "Europe/Andorra",
          });
        }));
    it(`/GET autocomplete/AD/Avinguda Sant Antoni: should return an address`, async () =>
      await app
        .inject({
          method: "GET",
          url: "/autocomplete/AD/all/Avinguda%20Sant%20Antoni",
        })
        .then((response) => {
          const body = response.json();
          expect(response.statusCode).toEqual(200);

          expect(body[0]).toEqual({
            coordinates: [1.51591, 42.5442],
            city: "La Massana",
            cityCode: "AD400",
            country: CountryCodes.AD,
            geoType: "position",
            geoValue: "avinguda-de-sant-antoni-ad400-la-massana-andorra",
            label: "Avinguda de Sant Antoni, AD400 La Massana, Andorra",
            name: "Avinguda de Sant Antoni, AD400 La Massana, Andorra",
            postalCode: "AD400",
            department: "La Massana",
            departmentCode: "04",
            region: "La Massana",
            regionCode: "04",
            slugs: {
              city: "la-massana",
              country: "ad",
              departement: "la-massana",
              department: "la-massana",
              pays: "ad",
              region: "la-massana",
              ville: "la-massana",
            },
            timeZone: "Europe/Andorra",
          });
        }));

    it(`/GET autocomplete/AD/Soldeu : should return a city`, async () =>
      await app
        .inject({
          method: "GET",
          url: "/autocomplete/AD/all/Soldeu",
        })
        .then((response) => {
          const body = response.json();
          expect(response.statusCode).toEqual(200);

          expect(body[0]).toEqual({
            city: "Canillo",
            cityCode: "AD100",
            coordinates: [1.66779, 42.5767],
            country: "ad",
            department: "Canillo",
            departmentCode: "02",
            geoType: GeoTypes.BOROUGH,
            geoValue: "canillo-AD100",
            label: "Soldeu, Canillo, Andorra",
            name: "Soldeu, Canillo, Andorra",
            postalCode: "AD100",
            region: "Canillo",
            regionCode: "02",
            slugs: {
              city: "canillo",
              country: "ad",
              departement: "canillo",
              department: "canillo",
              pays: "ad",
              region: "canillo",
              ville: "canillo",
            },
            timeZone: "Europe/Andorra",
          });
        }));

    it(`/GET autocomplete/AD/Avinguda Sant Antoni: should return an address`, async () =>
      await app
        .inject({
          method: "GET",
          url: "/autocomplete/AD/all/Avinguda%20Sant%20Antoni",
        })
        .then((response) => {
          const body = response.json();
          expect(response.statusCode).toEqual(200);

          expect(body[0]).toEqual({
            coordinates: [1.51591, 42.5442],
            city: "La Massana",
            cityCode: "AD400",
            country: CountryCodes.AD,
            geoType: "position",
            geoValue: "avinguda-de-sant-antoni-ad400-la-massana-andorra",
            label: "Avinguda de Sant Antoni, AD400 La Massana, Andorra",
            name: "Avinguda de Sant Antoni, AD400 La Massana, Andorra",
            postalCode: "AD400",
            department: "La Massana",
            departmentCode: "04",
            region: "La Massana",
            regionCode: "04",
            slugs: {
              city: "la-massana",
              country: "ad",
              departement: "la-massana",
              department: "la-massana",
              pays: "ad",
              region: "la-massana",
              ville: "la-massana",
            },
            timeZone: "Europe/Andorra",
          });
        }));
  });

  afterAll(async () => await app.close());
});
