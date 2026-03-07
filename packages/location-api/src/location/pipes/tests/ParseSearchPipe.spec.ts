import { BadRequestException } from "@nestjs/common";
import { ParseSearchPipe } from "../ParseSearch.pipe";

describe("ParseSearchPipe", () => {
  let parseSearchPipe: ParseSearchPipe;

  beforeEach(() => {
    parseSearchPipe = new ParseSearchPipe();
  });

  it("should be defined", () => {
    expect(parseSearchPipe).toBeDefined();
  });

  it("should throw BadRequestException for a string shorter than 2 characters", () => {
    const shortString = "a";
    expect(() => parseSearchPipe.transform(shortString)).toThrow(
      BadRequestException
    );
  });

  it("should throw BadRequestException for a string shorter than 2 characters", () => {
    const shortString = " a   ";
    expect(() => parseSearchPipe.transform(shortString)).toThrow(
      BadRequestException
    );
  });

  it("should remove special characters from the beginning of the string", () => {
    const stringWithColon = ": 182 Boulevard de la Madeleine";
    const expectedResult = "182 Boulevard de la Madeleine";
    expect(parseSearchPipe.transform(stringWithColon)).toBe(expectedResult);
  });

  it("should remove multiple special characters throughout the string", () => {
    const stringWithSpecialChars = ":;: Paris @ France";
    const expectedResult = "Paris France";
    expect(parseSearchPipe.transform(stringWithSpecialChars)).toBe(
      expectedResult
    );
  });

  it("should remove punctuation and symbols throughout the string", () => {
    const stringWithPunctuation = "123: rue@ de# la$ paix%";
    const expectedResult = "123 rue de la paix";
    expect(parseSearchPipe.transform(stringWithPunctuation)).toBe(
      expectedResult
    );
  });

  it("should normalize multiple spaces to single space", () => {
    const stringWithSpaces = "123    rue    de    Paris";
    const expectedResult = "123 rue de Paris";
    expect(parseSearchPipe.transform(stringWithSpaces)).toBe(expectedResult);
  });

  it("should handle valid addresses without special characters", () => {
    const validAddress = "182 Boulevard de la Madeleine 06000 NICE";
    expect(parseSearchPipe.transform(validAddress)).toBe(validAddress);
  });

  it("should throw BadRequestException if result is empty after cleaning", () => {
    const onlySpecialChars = ":;@#$%";
    expect(() => parseSearchPipe.transform(onlySpecialChars)).toThrow(
      BadRequestException
    );
  });
});
