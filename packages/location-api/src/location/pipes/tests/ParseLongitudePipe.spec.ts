import { BadRequestException } from "@nestjs/common";
import { ParseLongitudePipe } from "../ParseLongitude.pipe";

describe("ParseLongitudePipe", () => {
  let parseLongitudePipe: ParseLongitudePipe;

  beforeEach(() => {
    parseLongitudePipe = new ParseLongitudePipe();
  });

  it("should be defined", () => {
    expect(parseLongitudePipe).toBeDefined();
  });

  it("should return the same value if it is a valid longitude", () => {
    const validLongitude = "2.333333"; // Longitude of Paris
    expect(parseLongitudePipe.transform(validLongitude)).toBe(validLongitude);
  });

  it("should throw BadRequestException if value is not a valid longitude", () => {
    const invalidLongitude = "999999999";
    expect(() => parseLongitudePipe.transform(invalidLongitude)).toThrow(
      BadRequestException
    );
  });
});
