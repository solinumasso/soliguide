import { generateFullName } from "./generateFullName";

describe("Check full Name", () => {
  it("Test with:", async () => {
    expect(generateFullName(null, null)).toEqual("");
    expect(generateFullName("CHIPS", null)).toEqual("CHIPS");
    expect(generateFullName(null, "COCA ")).toEqual("COCA");
    expect(generateFullName(" CHIPS ", "COCA")).toEqual("CHIPS COCA");
  });
});
