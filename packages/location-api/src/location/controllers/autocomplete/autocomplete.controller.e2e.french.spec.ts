/*
 * Soliguide: Useful information for those who need it
 *
 * SPDX-FileCopyrightText: © 2024 Solinum
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
import { Test } from "@nestjs/testing";
import {
  FastifyAdapter,
  type NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { ConfigModule, ConfigService } from "@nestjs/config";

import {
  CountryCodes,
  GeoTypes,
  LocationAutoCompleteAddress,
} from "@soliguide/common";

import { LocationModule } from "../../location.module";
import { CONFIG_VALIDATOR } from "../../../config";
import { CacheManagerService } from "../../../cache-manager/services/cache-manager.service";
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
      providers: [ConfigService, CacheManagerService],
    }).compile();

    app = moduleRef.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter()
    );
    await app.init();
  });

  describe("/autocomplete/FR", () => {
    it("/GET autocomplete/FR: should return France with two characters. Should not return addresses (not available before 3 characters)", async () =>
      await app
        .inject({
          method: "GET",
          url: "/autocomplete/fr/all/fr",
        })
        .then((response) => {
          const body = response.json();
          expect(response.statusCode).toEqual(200);
          expect(body[0]).toEqual({
            label: "France",
            geoValue: CountryCodes.FR,
            coordinates: [2.343837096283199, 48.85058894753169],
            geoType: GeoTypes.COUNTRY,
            country: CountryCodes.FR,
            slugs: {
              country: CountryCodes.FR,
              pays: CountryCodes.FR,
            },
          });

          const isAdressesInsideResults = body.find(
            (location: LocationAutoCompleteAddress) =>
              location?.geoType === GeoTypes.POSITION
          );

          expect(isAdressesInsideResults).toBeUndefined();
        }));
    it("/GET autocomplete/FR: should return France", async () =>
      await app
        .inject({
          method: "GET",
          url: "/autocomplete/fr/all/fra",
        })
        .then((response) => {
          const body = response.json();
          expect(response.statusCode).toEqual(200);
          expect(body[0]).toEqual({
            label: "France",
            geoValue: CountryCodes.FR,
            coordinates: [2.343837096283199, 48.85058894753169],
            geoType: GeoTypes.COUNTRY,
            country: CountryCodes.FR,
            slugs: {
              country: CountryCodes.FR,
              pays: CountryCodes.FR,
            },
          });
        }));

    it("/GET autocomplete/FR/bretagne: should return a region first, then a city", async () =>
      await app
        .inject({
          method: "GET",
          url: "/autocomplete/FR/all/bretagne",
        })
        .then((response) => {
          const body = response.json();
          expect(response.statusCode).toEqual(200);
          expect(body[0]).toEqual({
            label: "Bretagne",
            coordinates: [-3.477866, 48.144871],
            country: CountryCodes.FR,
            region: "Bretagne",
            regionCode: "53",
            geoValue: "region-bretagne",
            slugs: {
              country: "fr",
              pays: "fr",
              region: "bretagne",
            },
            name: "Bretagne",
            geoType: GeoTypes.REGION,
            timeZone: "Europe/Paris",
          });
        }));

    it("/GET autocomplete/FR/seine saint denis: should return a department", async () =>
      await app
        .inject({
          method: "GET",
          url: "/autocomplete/FR/all/seine saint%20denis",
        })
        .then((response) => {
          const body = response.json();
          expect(response.statusCode).toEqual(200);
          expect(body[0]).toEqual({
            label: "Seine-Saint-Denis",
            coordinates: [2.502605, 48.923555],
            country: CountryCodes.FR,
            department: "Seine-Saint-Denis",
            departmentCode: "93",
            geoValue: "departement-seine-saint-denis",
            region: "Île-de-France",
            regionCode: "11",
            slugs: {
              pays: "fr",
              country: "fr",
              department: "seine-saint-denis",
              departement: "seine-saint-denis",
              region: "ile-de-france",
            },
            name: "Seine-Saint-Denis",
            geoType: GeoTypes.DEPARTMENT,
            timeZone: "Europe/Paris",
          });
        }));

    it("/GET autocomplete/FR/saint-denis-97400: should return Saint-Denis in Réunion", async () =>
      await app
        .inject({
          method: "GET",
          url: "/autocomplete/FR/all/saint-denis-97400",
        })
        .then((response) => {
          const body = response.json();
          expect(response.statusCode).toEqual(200);
          expect(body[0]).toEqual({
            label: "Saint-Denis (97400)",
            coordinates: [55.444588, -20.909778],
            postalCode: "97400",
            cityCode: "97411",
            city: "Saint-Denis",
            name: "Saint-Denis",
            country: "fr",
            geoType: GeoTypes.CITY,
            slugs: {
              city: "saint-denis",
              department: "la-reunion",
              region: "la-reunion",
              country: "fr",
              ville: "saint-denis",
              departement: "la-reunion",
              pays: "fr",
            },
            geoValue: "saint-denis-97400",
            departmentCode: "974",
            department: "La Réunion",
            region: "La Réunion",
            regionCode: "04",
            timeZone: "Indian/Reunion",
          });
        }));

    it("/GET autocomplete/FR/mamoudzou-97600: should return Mamoudzou in Mayotte", async () =>
      await app
        .inject({
          method: "GET",
          url: "/autocomplete/FR/all/mamoudzou-97600",
        })
        .then((response) => {
          const body = response.json();
          expect(response.statusCode).toEqual(200);
          expect(body[0]).toEqual({
            label: "Mamoudzou (97600)",
            coordinates: [45.197602, -12.797661],
            postalCode: "97600",
            cityCode: "97611",
            city: "Mamoudzou",
            name: "Mamoudzou",
            country: "fr",
            geoType: "ville",
            slugs: {
              ville: "mamoudzou",
              departement: "mayotte",
              pays: "fr",
              department: "mayotte",
              country: "fr",
              region: "mayotte",
              city: "mamoudzou",
            },
            geoValue: "mamoudzou-97600",
            departmentCode: "976",
            department: "Mayotte",
            region: "Mayotte",
            regionCode: "06",
            timeZone: "Indian/Mayotte",
          });
        }));

    it("/GET autocomplete/FR/ajaccio-20000: should return Ajaccio in 'Corse'", async () =>
      await app
        .inject({
          method: "GET",
          url: "/autocomplete/FR/all/ajaccio-20000",
        })
        .then((response) => {
          const body = response.json();
          expect(response.statusCode).toEqual(200);
          expect(body[0]).toEqual({
            label: "Ajaccio (20000)",
            coordinates: [8.715325, 41.93368],
            postalCode: "20000",
            cityCode: "2A004",
            city: "Ajaccio",
            name: "Ajaccio",
            country: "fr",
            geoType: "ville",
            slugs: {
              ville: "ajaccio",
              departement: "corse-du-sud",
              pays: "fr",
              department: "corse-du-sud",
              country: "fr",
              region: "corse",
              city: "ajaccio",
            },
            geoValue: "ajaccio-20000",
            departmentCode: "2A",
            department: "Corse-du-Sud",
            region: "Corse",
            regionCode: "94",
            timeZone: "Europe/Paris",
          });
        }));

    it("/GET autocomplete/FR/cote d'armor: should return department Côtes d'armor first", async () =>
      await app
        .inject({
          method: "GET",
          url: "/autocomplete/FR/all/Cotes%20d%27armor",
        })
        .then((response) => {
          const body = response.json();
          expect(response.statusCode).toEqual(200);
          expect(body[0]).toEqual({
            country: CountryCodes.FR,
            department: "Côtes-d'armor",
            departmentCode: "22",
            region: "Bretagne",
            regionCode: "53",
            label: "Côtes-d'armor",
            name: "Côtes-d'armor",
            coordinates: [-2.943113, 48.596217],
            geoValue: "departement-cotes-d-armor",
            slugs: {
              departement: "cotes-d-armor",
              pays: "fr",
              department: "cotes-d-armor",
              country: "fr",
              region: "bretagne",
            },
            geoType: GeoTypes.DEPARTMENT,
            timeZone: "Europe/Paris",
          });
        }));

    it("/GET autocomplete/FR/cote d'or: should return department Côte d'or first", async () =>
      await app
        .inject({
          method: "GET",
          url: "/autocomplete/FR/all/cote%20d%27or",
        })
        .then((response) => {
          const body = response.json();
          expect(response.statusCode).toEqual(200);
          expect(body[0]).toEqual({
            label: "Côte-d'Or",
            name: "Côte-d'Or",
            coordinates: [4.749979, 47.412075],
            department: "Côte-d'Or",
            departmentCode: "21",
            region: "Bourgogne-Franche-Comté",
            regionCode: "27",
            geoType: "departement",
            geoValue: "departement-cote-d-or",
            country: "fr",
            slugs: {
              departement: "cote-d-or",
              pays: "fr",
              department: "cote-d-or",
              country: "fr",
              region: "bourgogne-franche-comte",
            },
            timeZone: "Europe/Paris",
          });
        }));

    it("/GET autocomplete/FR/paris: should return department & city", async () =>
      await app
        .inject({
          method: "GET",
          url: "/autocomplete/FR/all/paris",
        })
        .then((response) => {
          const body = response.json();
          expect(response.statusCode).toEqual(200);
          expect(body[0]).toEqual({
            name: "Paris",
            country: CountryCodes.FR,
            department: "Paris",
            departmentCode: "75",
            coordinates: [2.362203, 48.846223],
            region: "Île-de-France",
            regionCode: "11",
            geoValue: "departement-paris",
            slugs: {
              country: "fr",
              pays: "fr",
              department: "paris",
              departement: "paris",
              region: "ile-de-france",
            },
            label: "Paris",
            geoType: GeoTypes.DEPARTMENT,
            timeZone: "Europe/Paris",
          });

          expect(body[1]).toEqual({
            name: "Paris",
            city: "Paris",
            cityCode: "75056",
            country: CountryCodes.FR,
            department: "Paris",
            departmentCode: "75",
            coordinates: [2.347, 48.859],
            postalCode: "75001",
            region: "Île-de-France",
            regionCode: "11",
            geoValue: "paris-75001",
            slugs: {
              city: "paris",
              ville: "paris",
              country: "fr",
              pays: "fr",
              department: "paris",
              departement: "paris",
              region: "ile-de-france",
            },
            label: "Paris (75001)",
            geoType: GeoTypes.CITY,
            timeZone: "Europe/Paris",
          });
        }));

    it("/GET autocomplete/FR/palavas les flots: should return a city", async () =>
      await app
        .inject({
          method: "GET",
          url: "/autocomplete/FR/all/palavas les flots",
        })
        .then((response) => {
          const body = response.json();
          expect(response.statusCode).toEqual(200);

          expect(body[0]).toEqual({
            name: "Palavas-les-Flots",
            city: "Palavas-les-Flots",
            cityCode: "34192",
            country: CountryCodes.FR,
            department: "Hérault",
            departmentCode: "34",
            coordinates: [3.942202, 43.530342],
            postalCode: "34250",
            region: "Occitanie",
            regionCode: "76",
            geoValue: "palavas-les-flots-34250",
            slugs: {
              city: "palavas-les-flots",
              ville: "palavas-les-flots",
              country: "fr",
              pays: "fr",
              department: "herault",
              departement: "herault",
              region: "occitanie",
            },
            label: "Palavas-les-Flots (34250)",
            geoType: GeoTypes.CITY,
            timeZone: "Europe/Paris",
          });
        }));

    it("/GET autocomplete/FR/2 boulevard de l'europe poissy: should return an address", async () =>
      await app
        .inject({
          method: "GET",
          url: "/autocomplete/FR/all/2%20boulevard%20de%20l%27europe%20poissy",
        })
        .then((response) => {
          const body = response.json();
          expect(response.statusCode).toEqual(200);
          expect(body[0]).toEqual({
            label: "2 Boulevard de l’Europe, 78300 Poissy",
            coordinates: [2.043986, 48.933577],
            postalCode: "78300",
            cityCode: "78498",
            city: "Poissy",
            name: "2 Boulevard de l’Europe",
            country: CountryCodes.FR,
            department: "Yvelines",
            departmentCode: "78",
            region: "Île-de-France",
            regionCode: "11",
            geoType: "position",
            geoValue: "2-boulevard-de-l-europe-78300-poissy",
            slugs: {
              ville: "poissy",
              departement: "yvelines",
              pays: "fr",
              department: "yvelines",
              country: "fr",
              region: "ile-de-france",
              city: "poissy",
            },
            timeZone: "Europe/Paris",
          });
        }));

    it("/GET autocomplete/FR/29-9 Rue de la Gare, 52100 Saint-Eulien: address with department different than postal code", async () =>
      await app
        .inject({
          method: "GET",
          url: "/autocomplete/FR/all/29-9 Rue de la Gare, 52100 Saint-Eulien",
        })
        .then((response) => {
          const body = response.json();
          expect(response.statusCode).toEqual(200);

          expect(body[0]).toEqual({
            geoValue: "9-rue-de-la-gare-52100-saint-eulien",
            label: "9 Rue de la Gare, 52100 Saint-Eulien",
            coordinates: [4.878801, 48.683103],
            postalCode: "52100",
            cityCode: "51478",
            city: "Saint-Eulien",
            name: "9 Rue de la Gare",
            country: CountryCodes.FR,
            department: "Marne",
            departmentCode: "51",
            region: "Grand Est",
            regionCode: "44",
            geoType: GeoTypes.POSITION,
            slugs: {
              ville: "saint-eulien",
              departement: "marne",
              pays: "fr",
              department: "marne",
              country: "fr",
              region: "grand-est",
              city: "saint-eulien",
            },
            timeZone: "Europe/Paris",
          });
        }));

    it("/GET autocomplete: should return 404", async () =>
      await app
        .inject({
          method: "GET",
          url: "/autocomplete/FR",
        })
        .then(({ statusCode }) => {
          expect(statusCode).toEqual(404);
        }));
  });

  afterAll(async () => await app.close());
});
