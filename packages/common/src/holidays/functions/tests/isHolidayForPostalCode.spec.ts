import { PublicHoliday } from "../../interfaces";
import { isHolidayForPostalCode } from "../filterDepartmentsForHolidays";

describe("isHolidayForPostalCode", () => {
  it("should return true for national holidays regardless of departments", () => {
    const armisticeDay: PublicHoliday = {
      isNational: true,
      name: "Armistice 1918",
      departments: [],
      startDate: "2024-11-11",
      endDate: "2024-11-11",
      translations: {
        en: "Armistice Day",
      },
    };

    expect(isHolidayForPostalCode(armisticeDay, [])).toBe(true);
    expect(isHolidayForPostalCode(armisticeDay, ["75"])).toBe(true);
    expect(isHolidayForPostalCode(armisticeDay, ["974"])).toBe(true);
  });

  it("should return true when department matches for regional holiday", () => {
    const abolitionDay: PublicHoliday = {
      isNational: false,
      name: "Abolition de l'esclavage",
      departments: ["974"],
      startDate: "2024-12-20",
      endDate: "2024-12-20",
      translations: {
        en: "Abolition of slavery",
      },
    };

    expect(isHolidayForPostalCode(abolitionDay, ["974"])).toBe(true);
    expect(isHolidayForPostalCode(abolitionDay, ["974", "75"])).toBe(true);
  });

  it("should return false when department does not match for regional holiday", () => {
    const secondChristmasDay: PublicHoliday = {
      isNational: false,
      name: "2ème jour de Noël",
      departments: ["57", "67", "68"],
      startDate: "2024-12-26",
      endDate: "2024-12-26",
      translations: {
        en: "2nd day of Christmas",
      },
    };

    expect(isHolidayForPostalCode(secondChristmasDay, ["75"])).toBe(false);
    expect(isHolidayForPostalCode(secondChristmasDay, ["974"])).toBe(false);
  });

  it("should return false when holiday has no departments and is not national", () => {
    const invalidHoliday: PublicHoliday = {
      isNational: false,
      name: "Invalid Holiday",
      departments: [],
      startDate: "2024-12-26",
      endDate: "2024-12-26",
      translations: {
        en: "Invalid Holiday",
      },
    };

    expect(isHolidayForPostalCode(invalidHoliday, ["75"])).toBe(false);
  });

  it("should return false when no departments are provided", () => {
    const regionalHoliday: PublicHoliday = {
      isNational: false,
      name: "Regional Holiday",
      departments: ["75"],
      startDate: "2024-12-26",
      endDate: "2024-12-26",
      translations: {
        en: "Regional Holiday",
      },
    };

    expect(isHolidayForPostalCode(regionalHoliday, [])).toBe(false);
    expect(isHolidayForPostalCode(regionalHoliday, undefined as any)).toBe(
      false
    );
  });
});
