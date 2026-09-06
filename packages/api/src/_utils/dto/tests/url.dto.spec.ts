import { checkUrlFieldDto } from "../url.dto";
import {
  HTML_INJECTIONS,
  NON_STRING_INJECTIONS,
} from "../../tests/injection-payloads";
import { expectAccepted, expectRejected, runDto } from "../../tests/run-dto";

const websiteDto = [checkUrlFieldDto("website")];

describe("checkUrlFieldDto", () => {
  it.each([
    "https://soliguide.fr",
    "http://soliguide.fr/lieu/123",
    "soliguide.fr",
    "www.soliguide.fr/contact",
  ])("should accept %p", async (website) => {
    expectAccepted(await runDto(websiteDto, { body: { website } }));
  });

  it("should add the scheme when the value has none", async () => {
    const result = await runDto(websiteDto, {
      body: { website: "soliguide.fr" },
    });

    expectAccepted(result);
    expect(result.data.website).toBe("https://soliguide.fr");
  });

  it("should accept an absent value", async () => {
    expectAccepted(await runDto(websiteDto, { body: {} }));
  });

  it.each([
    "javascript:alert(1)",
    "JaVaScRiPt:alert(1)",
    "data:text/html,<script>alert(1)</script>",
    "vbscript:msgbox(1)",
    "file:///etc/passwd",
  ])("should refuse the executable scheme %p", async (website) => {
    expectRejected(await runDto(websiteDto, { body: { website } }));
  });

  it.each(NON_STRING_INJECTIONS)(
    "should refuse $label without answering 500",
    async ({ value }) => {
      const result = await runDto(websiteDto, { body: { website: value } });

      expect(result.thrown).toBeUndefined();

      if (result.errors.length === 0) {
        // The only values allowed through are the falsy ones the field is optional for
        expect(result.data.website ?? "").toBeFalsy();
      }
    }
  );

  it.each(HTML_INJECTIONS)(
    "should never store $label as a usable address",
    async ({ value }) => {
      const result = await runDto(websiteDto, { body: { website: value } });

      expect(result.thrown).toBeUndefined();

      const stored = (result.data.website ?? "") as string;

      expect(stored).not.toMatch(/javascript\s*:/i);
      expect(stored).not.toMatch(/vbscript\s*:/i);
      expect(stored).not.toMatch(/^data\s*:/i);
    }
  );
});
