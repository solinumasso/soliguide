import { getTodayName } from "./date.functions";

beforeAll(() => {
  jest.useFakeTimers();
  jest.setSystemTime(new Date("2020-06-01T01:00:00.000Z"));
});

describe("Check Today's Name", () => {
  it("Check display date :", async () => {
    let fakeToday = new Date("2021-06-28T12:30:52.256Z"); // Monday June 28, 2021
    expect(getTodayName(fakeToday)).toBe("monday");
    fakeToday = new Date("2021-06-23T12:30:52.256Z"); // Wednesday June 23, 2021
    expect(getTodayName(fakeToday)).toBe("wednesday");

    const getFooTodayName = () => {
      getTodayName("foo");
    };
    expect(getFooTodayName).toThrow("The provided value isn't a date");
  });
});
