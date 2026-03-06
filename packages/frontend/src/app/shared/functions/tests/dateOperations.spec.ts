import { convertNgbDateToDate } from "../dateOperations";

describe("dateOperations", () => {
  describe("convertNgbDateToDate", () => {
    it("Doit retourner 'null'", () => {
      expect(
        convertNgbDateToDate({ year: 202, month: 1, day: 2 }, null, "end")
      ).toBeNull();
    });

    it("Doit retourner une date valide", () => {
      expect(
        convertNgbDateToDate({ year: 2021, month: 1, day: 15 }, null, "end")
      ).not.toBeNull();
    });

    it("Doit aussi retourner une date valide", () => {
      expect(
        convertNgbDateToDate(
          { year: 2021, month: 1, day: 15 },
          { year: 2021, month: 2, day: 15 },
          "end"
        )
      ).not.toBeNull();
    });

    it("Doit retourner une date valide mais à avec l'heure égale à 23h59", () => {
      const res = convertNgbDateToDate(
        { year: 2021, month: 1, day: 15 },
        { year: 2021, month: 1, day: 15 },
        "start"
      );

      expect(res.getHours()).toBe(23);
      expect(res.getMinutes()).toBe(59);
    });
  });
});
