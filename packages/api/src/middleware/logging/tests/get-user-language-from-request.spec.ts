import { SupportedLanguagesCode } from "@soliguide/common";
import { getUserLanguageFromRequest } from "../services";

describe("getUserLanguageFromRequest", () => {
  let mockRequest: any;

  beforeEach(() => {
    mockRequest = {
      params: {},
    };
  });

  it("should return FR as default when no language parameter is provided", () => {
    const result = getUserLanguageFromRequest(mockRequest);
    expect(result).toBe(SupportedLanguagesCode.FR);
  });

  it("should return the provided language when it is supported", () => {
    mockRequest.params.lang = SupportedLanguagesCode.EN;
    const result = getUserLanguageFromRequest(mockRequest);
    expect(result).toBe(SupportedLanguagesCode.EN);
  });

  it("should throw an error when provided language is not supported", () => {
    mockRequest.params.lang = "DE" as SupportedLanguagesCode;
    expect(() => getUserLanguageFromRequest(mockRequest)).toThrow(
      "Language not supported"
    );
  });

  it("should handle undefined lang parameter", () => {
    mockRequest.params.lang = undefined;
    const result = getUserLanguageFromRequest(mockRequest);
    expect(result).toBe(SupportedLanguagesCode.FR);
  });

  it("should handle empty string as lang parameter", () => {
    mockRequest.params.lang = "";
    const result = getUserLanguageFromRequest(mockRequest);
    expect(result).toBe(SupportedLanguagesCode.FR);
  });
});
