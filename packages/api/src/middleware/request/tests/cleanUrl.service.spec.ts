import { cleanUrl } from "../services/cleanUrl.service";

describe("cleanUrl", () => {
  it.each([
    ["soliguide.fr", "https://soliguide.fr"],
    ["https://soliguide.fr", "https://soliguide.fr"],
    ["http://soliguide.fr", "https://soliguide.fr"],

    ["https://https://soliguide.fr", "https://soliguide.fr"],
    ["http://https://soliguide.fr", "https://soliguide.fr"],

    ["soliguide.fr/", "https://soliguide.fr"],
    ["https://soliguide.fr/", "https://soliguide.fr"],
    ["https://soliguide.fr//////", "https://soliguide.fr"],
    ["https://////soliguide.fr", "https://soliguide.fr"],

    [" soliguide.fr ", "https://soliguide.fr"],
    ["soliguide.fr/ ", "https://soliguide.fr"],
    ["https:// soliguide.fr", "https://soliguide.fr"],

    ["", ""],
    [null, ""],
    [undefined, ""],
  ])(
    "should clean url %s to %s",
    (input: string | null | undefined, expected) => {
      expect(cleanUrl(input as string)).toBe(expected);
    }
  );
});
