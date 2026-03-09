import { generateCompleteName } from "../generateCompleteName";

describe("Check Complete Name", () => {
  it("Test de valeurs :", async () => {
    expect(generateCompleteName(null, null)).toEqual("");
    expect(generateCompleteName("CHIPS", null)).toEqual("CHIPS");
    expect(generateCompleteName(null, "COCA ")).toEqual("COCA");
    expect(generateCompleteName(" CHIPS ", "COCA")).toEqual("CHIPS COCA");
  });
});
