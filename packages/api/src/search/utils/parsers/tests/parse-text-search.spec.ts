import { FilterQuery } from "mongoose";
import { createSafeRegex, parseTextSearch } from "../parse-text-search";

describe("CreateSafeRegex", () => {
  it("Should escape special characters", () => {
    const regex = createSafeRegex(".*?+[]{}()");
    expect(regex.source).toBe(".*\\.\\*\\?\\+\\[\\]\\{\\}\\(\\).*");
  });

  it("Should create a case-insensitive regex", () => {
    const regex = createSafeRegex("Test");
    expect(regex.source).toBe(".*Test.*");
  });
});

describe("ParseTextSearch", () => {
  let query: FilterQuery<any>;
  let searchData: { [key: string]: any };

  beforeEach(() => {
    query = {};
    searchData = {
      name: "Alice",
      email: null,
    };
  });

  it("Should add a regex query if field is not empty", () => {
    parseTextSearch(query, searchData, "name");
    expect(query).toEqual({
      name: {
        $options: "i",
        $regex: /.*Alice.*/,
      },
    });
  });

  it("should not add a regex query if field is empty", () => {
    parseTextSearch(query, searchData, "email");
    expect(query).toEqual({});
  });
});
