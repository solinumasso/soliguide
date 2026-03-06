import { Test, TestingModule } from "@nestjs/testing";
import { FrenchAddressService } from "../french-address.service";
import { HttpService } from "@nestjs/axios";
import { of, throwError } from "rxjs";
import { AxiosHeaders, AxiosResponse } from "axios";
import * as HOUSE_NUMBER from "../../mocks/HOUSE_NUMBER.mock.json";
import * as MUNICIPALITY from "../../mocks/MUNICIPALITY.mock.json";
import { ConfigModule } from "@nestjs/config";
import { Feature, Point } from "geojson";
import { FrenchAddress } from "../../sources/FR/interfaces";
import { CONFIG_VALIDATOR } from "../../../config";
import { CountryCodes, GeoTypes } from "@soliguide/common";

describe("FrenchAddressService", () => {
  let service: FrenchAddressService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FrenchAddressService,
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          validationSchema: CONFIG_VALIDATOR,
        }),
      ],
    }).compile();

    service = module.get<FrenchAddressService>(FrenchAddressService);
    httpService = module.get<HttpService>(HttpService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("Test API calls", () => {
    it("Should return transformed addresses data on successful API call", async () => {
      const mockApiResponse: AxiosResponse = {
        status: 200,
        statusText: "OK",
        config: { headers: new AxiosHeaders() },
        headers: {},
        data: structuredClone(HOUSE_NUMBER),
      };

      jest.spyOn(httpService, "get").mockReturnValueOnce(of(mockApiResponse));
      const result = await service.searchForLocation(
        CountryCodes.FR,
        "12 Rue des Bois"
      );

      expect(result.length).toEqual(5);
    });

    it("Should return transformed municipality data on successful API call", async () => {
      const mockApiResponse: AxiosResponse = {
        status: 200,
        statusText: "OK",
        config: { headers: new AxiosHeaders() },
        headers: {},
        data: structuredClone(MUNICIPALITY),
      };

      jest.spyOn(httpService, "get").mockReturnValueOnce(of(mockApiResponse));
      const result = await service.searchForLocation(
        CountryCodes.FR,
        "Villetaneuse"
      );

      expect(result).toEqual([
        {
          city: "Villetaneuse",
          name: "Villetaneuse",
          label: "Villetaneuse (93430)",
          geoType: GeoTypes.CITY,
          coordinates: [2.34416, 48.957567],
          postalCode: "93430",
          cityCode: "93079",
          country: CountryCodes.FR,
          department: "Seine-Saint-Denis",
          departmentCode: "93",
          region: "Île-de-France",
          regionCode: "11",
          geoValue: "villetaneuse-93430",
          slugs: {
            city: "villetaneuse",
            ville: "villetaneuse",
            country: "fr",
            pays: "fr",
            department: "seine-saint-denis",
            departement: "seine-saint-denis",
            region: "ile-de-france",
          },
          timeZone: "Europe/Paris",
        },
      ]);
    });

    it("Should handle API call failure", async () => {
      jest
        .spyOn(httpService, "get")
        .mockReturnValueOnce(throwError(() => new Error("API error")));
      await expect(
        service.searchForLocation(CountryCodes.FR, "query")
      ).rejects.toThrow("CANNOT_GET_ADDRESS_OR_CITY");
    });
  });

  describe("getGeoTypeForAddress", () => {
    it("Should return BOROUGH for 75015", () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const feature: Feature<Point, FrenchAddress> = {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [2.294954, 48.841549],
        },
        properties: {
          label: "Paris 15e Arrondissement",
          score: 0.40684486166007905,
          id: "75115",
          type: "municipality",
          name: "Paris 15e Arrondissement",
          postcode: "75015",
          citycode: "75115",
          x: 648253.88,
          y: 6860397.72,
          city: "Paris 15e Arrondissement",
          context: "75, Paris, Île-de-France",
          importance: 0.56225,
        },
      };
      expect(service.getGeoTypeForAddress(feature)).toEqual(GeoTypes.BOROUGH);
    });

    it("Should return CITY for 81320", () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const feature: any = {
        properties: {
          label: "Moulin-mage",
          type: "municipality",
          name: "Moulin-mage",
          postcode: "81320",
        },
      };
      expect(service.getGeoTypeForAddress(feature)).toEqual(GeoTypes.CITY);
    });
  });
});
