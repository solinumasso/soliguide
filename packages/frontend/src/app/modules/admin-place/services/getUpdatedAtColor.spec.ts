import { getUpdatedAtColor } from "./getUpdatedAtColor.service";

beforeAll(() => {
  jest.useFakeTimers();
  jest.setSystemTime(new Date(2021, 9, 1));
});

describe("getUpdatedAtColor", () => {
  it("Test UpdatedAt Colors", () => {
    expect(getUpdatedAtColor(new Date(2021, 8, 10))).toBe("success");
    expect(getUpdatedAtColor(new Date(2021, 5, 1))).toBe("warning");
    expect(getUpdatedAtColor(new Date(2021, 1, 1))).toBe("danger");
    expect(getUpdatedAtColor(null)).toBe("danger");
  });
});
