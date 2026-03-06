import { Test } from "@nestjs/testing";
import {
  FastifyAdapter,
  type NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { CountryCodes, GeoTypes } from "@soliguide/common";

import { LocationModule } from "../../location.module";
import { CONFIG_VALIDATOR } from "../../../config";
import { CacheManagerService } from "../../../cache-manager/services/cache-manager.service";
import { CacheManagerModule } from "../../../cache-manager";

describe("E2E - Location autocomplete endpoints for Spain", () => {
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
      providers: [
        ConfigService,
        CacheManagerService,
        { provide: CACHE_MANAGER, useValue: {} },
      ],
    }).compile();

    app = moduleRef.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter()
    );
    await app.init();
  });

  describe("/autocomplete/ES", () => {
    const testQueryResult = (
      text: string,
      testCallback: (body: unknown[]) => void
    ): jest.ProvidesCallback => {
      return async () =>
        await app
          .inject({
            method: "GET",
            url: `/autocomplete/ES/all/${text}`,
          })
          .then((response) => {
            const body = response.json();
            expect(response.statusCode).toEqual(200);
            testCallback(body);
          });
    };

    it(
      `/GET autocomplete/ES/Lerida: should return a department first, then a city`,
      testQueryResult("lleida", (body) =>
        expect(body).toEqual([
          {
            label: "Lleida",
            name: "Lleida",
            region: "Catalunya",
            department: "Lleida",
            geoType: GeoTypes.DEPARTMENT,
            geoValue: "provincia-lleida",
            country: CountryCodes.ES,
            coordinates: [0.6267842, 41.6147605],
            slugs: {
              departement: "lleida",
              pays: CountryCodes.ES,
              department: "lleida",
              country: CountryCodes.ES,
              region: "catalunya",
            },
            departmentCode: "25",
            regionCode: "09",
            timeZone: "Europe/Madrid",
          },
          {
            geoValue: "lleida-25007",
            label: "Lleida, Catalunya, Espanya",
            name: "Lleida",
            postalCode: "25007",
            coordinates: [0.62755, 41.61495],
            region: "Catalunya",
            department: "Lleida",
            city: "Lleida",
            geoType: GeoTypes.CITY,
            country: CountryCodes.ES,
            slugs: {
              ville: "lleida",
              departement: "lleida",
              pays: CountryCodes.ES,
              department: "lleida",
              country: CountryCodes.ES,
              region: "catalunya",
              city: "lleida",
            },
            cityCode: "25007",
            departmentCode: "25",
            regionCode: "09",
            timeZone: "Europe/Madrid",
          },
        ])
      )
    );

    it(
      `/GET autocomplete/ES/extremadura: should return a region first, then de departement`,
      testQueryResult("extremadura", (body) => {
        expect(body[0]).toEqual({
          label: "Extremadura",
          name: "Extremadura",
          coordinates: [-6.1529891, 39.1748426],
          region: "Extremadura",
          regionCode: "11",
          geoType: GeoTypes.REGION,
          geoValue: "comunidad-autonoma-extremadura",
          country: CountryCodes.ES,
          slugs: {
            pays: CountryCodes.ES,
            country: CountryCodes.ES,
            region: "extremadura",
          },
          timeZone: "Europe/Madrid",
        });
      })
    );

    it(
      `/GET autocomplete/ES/villapalacios: should return a city`,
      testQueryResult("villapalacios", (body) =>
        expect(body).toEqual([
          {
            city: "Villapalacios",
            coordinates: [-2.6287, 38.57678],
            country: "es",
            department: "Albacete",
            geoType: GeoTypes.CITY,
            geoValue: "villapalacios-02350",
            label: "Villapalacios, Castella-La Manxa, Espanya",
            name: "Villapalacios",
            postalCode: "02350",
            region: "Castilla-La Mancha",
            slugs: {
              ville: "villapalacios",
              departement: "albacete",
              pays: "es",
              department: "albacete",
              country: "es",
              region: "castilla-la-mancha",
              city: "villapalacios",
            },
            cityCode: "02350",
            departmentCode: "02",
            regionCode: "08",
            timeZone: "Europe/Madrid",
          },
        ])
      )
    );

    it(
      `/GET autocomplete/ES/mollet del valles: should return a city`,
      testQueryResult("mollet del valles", (body) =>
        expect(body).toEqual([
          {
            city: "Mollet del Vallès",
            coordinates: [2.21695, 41.54419],
            country: "es",
            department: "Barcelona",
            geoType: GeoTypes.CITY,
            geoValue: "mollet-del-valles-08100",
            label: "Mollet del Vallès, Catalunya, Espanya",
            name: "Mollet del Vallès",
            postalCode: "08100",
            region: "Catalunya",
            slugs: {
              ville: "mollet-del-valles",
              departement: "barcelona",
              pays: "es",
              department: "barcelona",
              country: "es",
              region: "catalunya",
              city: "mollet-del-valles",
            },
            cityCode: "08100",
            departmentCode: "08",
            regionCode: "09",
            timeZone: "Europe/Madrid",
          },
        ])
      )
    );

    it(
      `/GET autocomplete/ES/calle Jesús 12, Fuente de Cantos,: should return an address`,
      testQueryResult("calle Jesús 12, Fuente de Cantos", (body) => {
        expect(body).toEqual([
          {
            city: "Fuente de Cantos",
            coordinates: [-6.30515, 38.24543],
            country: "es",
            department: "Badajoz",
            geoType: "position",
            geoValue: "calle-jesus-12-06240-fuente-de-cantos-badajoz-espanya",
            label: "Calle Jesús, 12, 06240 Fuente de Cantos (Badajoz), Espanya",
            name: "Calle Jesús, 12, 06240 Fuente de Cantos (Badajoz), Espanya",
            postalCode: "06240",
            region: "Extremadura",
            slugs: {
              ville: "fuente-de-cantos",
              departement: "badajoz",
              pays: "es",
              department: "badajoz",
              country: "es",
              region: "extremadura",
              city: "fuente-de-cantos",
            },
            cityCode: "06240",
            departmentCode: "06",
            regionCode: "11",
            timeZone: "Europe/Madrid",
          },
        ]);
      })
    );
  });

  afterAll(async () => {
    await app.close();
  });
});
