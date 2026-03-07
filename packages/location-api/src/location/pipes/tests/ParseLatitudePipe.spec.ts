import { BadRequestException } from "@nestjs/common";
import { ParseLatitudePipe } from "../ParseLatitude.pipe";

describe("ParseLatitudePipe", () => {
  let parseLatitudePipe: ParseLatitudePipe;

  beforeEach(() => {
    parseLatitudePipe = new ParseLatitudePipe();
  });

  it("should be defined", () => {
    expect(parseLatitudePipe).toBeDefined();
  });

  it("should return the same value if it is a valid latitude", () => {
    const validLatitude = "48.866667";
    expect(parseLatitudePipe.transform(validLatitude)).toBe(validLatitude);
  });

  it("should throw BadRequestException if value is not a valid latitude", () => {
    const invalidLatitude = "68877344";
    expect(() => parseLatitudePipe.transform(invalidLatitude)).toThrow(
      BadRequestException
    );
  });
});
