import { kmOrMeters } from "./kmOrMeters.function";

describe("kmOrMeters", () => {
  it("should return the input in meters if it is less than 1000", () => {
    expect(kmOrMeters(500)).toBe("500 m");
  });

  it("should return the input in kilometers if it is greater than or equal to 1000", () => {
    expect(kmOrMeters(1000)).toBe("1 km");
    expect(kmOrMeters(2000)).toBe("2 km");
    expect(kmOrMeters(2500)).toBe("2,5 km");
  });

  it("should round down distances ", () => {
    expect(kmOrMeters(999.9)).toBe("990 m");
    expect(kmOrMeters(1000.5)).toBe("1 km");
    expect(kmOrMeters(1234.56)).toBe("1,2 km");
  });
});
