import { weekDaysOrdering } from "./weekDaysOrdering";
import { WEEK_DAYS } from "@soliguide/common";

describe("Test function weekDaysOrdering", () => {
  it("Le tableau doit commencer par le jour courant", () => {
    const indexToday = (new Date().getDay() + 6) % 7;
    const testArray = weekDaysOrdering(WEEK_DAYS, indexToday);

    expect(testArray[0] === WEEK_DAYS[indexToday]).toBeTruthy();
  });
});
