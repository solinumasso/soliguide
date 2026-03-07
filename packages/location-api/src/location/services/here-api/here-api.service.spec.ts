import { Test, TestingModule } from "@nestjs/testing";
import { HereApiService } from "./here-api.service";
import { DepartmentsAndRegionsService } from "../departments-regions.service";
import { ConfigModule } from "@nestjs/config";
import { CONFIG_VALIDATOR } from "../../../config";
import { HttpModule } from "@nestjs/axios";
import { GeoTypes } from "@soliguide/common";

describe("HereApiService", () => {
  let service: HereApiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HereApiService, DepartmentsAndRegionsService],
      imports: [
        HttpModule,
        ConfigModule.forRoot({
          isGlobal: true,
          validationSchema: CONFIG_VALIDATOR,
        }),
      ],
    }).compile();

    service = module.get<HereApiService>(HereApiService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("getGeoTypeForAddress", () => {
    test("should return GeoTypes.POSITION for place, street, or houseNumber resultType", () => {
      expect(service.getGeoTypeForAddress("place", "city")).toBe(
        GeoTypes.POSITION
      );
      expect(service.getGeoTypeForAddress("street", "postalCode")).toBe(
        GeoTypes.POSITION
      );
      expect(service.getGeoTypeForAddress("houseNumber", "subdistrict")).toBe(
        GeoTypes.POSITION
      );
    });

    test("should return GeoTypes.BOROUGH for city or postalCode localityType", () => {
      expect(service.getGeoTypeForAddress("locality", "subdistrict")).toBe(
        GeoTypes.BOROUGH
      );
      expect(service.getGeoTypeForAddress("locality", "district")).toBe(
        GeoTypes.BOROUGH
      );
    });

    test("should return GeoTypes.CITY for other cases", () => {
      expect(service.getGeoTypeForAddress("locality", "postalCode")).toBe(
        GeoTypes.CITY
      );
      expect(service.getGeoTypeForAddress("locality", "city")).toBe(
        GeoTypes.CITY
      );
    });
  });
});
