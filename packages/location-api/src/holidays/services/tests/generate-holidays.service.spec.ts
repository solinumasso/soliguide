import { Test, TestingModule } from "@nestjs/testing";
import { ConfigModule } from "@nestjs/config";
import { CONFIG_VALIDATOR } from "../../../config";
import { GenerateHolidaysService } from "../generate-holidays.service";
import { CountryCodes } from "@soliguide/common";
import { Holiday } from "../../interfaces/holidays.interface";
import { PUBLIC_HOLIDAYS_MOCK } from "./PUBLIC_HOLIDAYS_MOCK";

describe("GenerateHolidaysService", () => {
  let service: GenerateHolidaysService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GenerateHolidaysService],
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          validationSchema: CONFIG_VALIDATOR,
        }),
      ],
    }).compile();

    service = module.get<GenerateHolidaysService>(GenerateHolidaysService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("Generate holidays from openholidaysapi.org", () => {
    describe("getDepartmentCodeFromOpenHolidays ", () => {
      it("Should return 974 for Martinique", () => {
        expect(
          service.getDepartmentCodeFromOpenHolidays("FR-MQ", CountryCodes.FR)
        ).toEqual(["972"]);
      });

      it("Should return 974 for Martinique", () => {
        expect(
          service.getDepartmentCodeFromOpenHolidays("FR-XX-MO", CountryCodes.FR)
        ).toEqual(["57"]);
      });
    });

    describe("processHolidays ", () => {
      it("should return holidays in Soliguide Format", () => {
        const result = service.processHolidays(
          PUBLIC_HOLIDAYS_MOCK as Holiday[],
          CountryCodes.FR
        );

        expect(result[0]).toMatchObject({
          isNational: true,
          name: "Jour de l'an",
          departments: [],
          startDate: "2025-01-01",
          endDate: "2025-01-01",
        });
      });
    });
  });
});
