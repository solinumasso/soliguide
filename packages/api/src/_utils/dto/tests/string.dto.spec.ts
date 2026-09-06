import { richTextDto, stringDto } from "../string.dto";
import {
  ARRAY_SMUGGLING,
  HTML_INJECTIONS,
  MONGO_INJECTIONS,
  NON_EMPTY_INJECTIONS,
  NON_STRING_INJECTIONS,
} from "../../tests/injection-payloads";
import { expectAccepted, expectRejected, runDto } from "../../tests/run-dto";

const nameDto = [stringDto("name", true, 200, 3)];
const optionalDto = [stringDto("precision", false, 200)];
const descriptionDto = [richTextDto("description", false, 4000, 10)];

describe("stringDto", () => {
  describe("valid input", () => {
    it("should accept an ordinary text", async () => {
      const result = await runDto(nameDto, {
        body: { name: "Accueil de jour Saint-Martin" },
      });

      expectAccepted(result);
      expect(result.data.name).toBe("Accueil de jour Saint-Martin");
    });

    it("should trim and collapse the whitespace of a pasted value", async () => {
      const result = await runDto(nameDto, {
        body: { name: "  Accueil    de   jour  " },
      });

      expectAccepted(result);
      expect(result.data.name).toBe("Accueil de jour");
    });

    it("should remove the control characters XML forbids", async () => {
      const result = await runDto(nameDto, {
        body: { name: "Accueil\u0000 \u0007de jour" },
      });

      expectAccepted(result);
      expect(result.data.name).toBe("Accueil de jour");
    });
  });

  describe("markup and script", () => {
    it.each(HTML_INJECTIONS)("should refuse $label", async ({ value }) => {
      const result = await runDto(nameDto, { body: { name: value } });

      expectRejected(result);
      expect(result.data.name).toBeUndefined();
    });

    it("should refuse even a single formatting tag", async () => {
      expectRejected(
        await runDto(nameDto, { body: { name: "Accueil <b>de jour</b>" } }),
        "TEXT_CONTAINS_HTML"
      );
    });
  });

  describe("type confusion", () => {
    it.each(NON_STRING_INJECTIONS)(
      "should refuse $label without answering 500",
      async ({ value }) => {
        const result = await runDto(nameDto, { body: { name: value } });

        expectRejected(result);
        expect(result.data.name).toBeUndefined();
      }
    );

    it.each(ARRAY_SMUGGLING)(
      "should refuse $label instead of reading its first element",
      async ({ value }) => {
        expectRejected(await runDto(nameDto, { body: { name: value } }));
      }
    );

    it.each(MONGO_INJECTIONS)(
      "should keep $label out of the validated body",
      async ({ value }) => {
        const result = await runDto(nameDto, { body: { name: value } });

        expect(result.thrown).toBeUndefined();
        expect(result.data.name).toBeUndefined();
      }
    );
  });

  describe("length", () => {
    it("should refuse a value below the minimum", async () => {
      expectRejected(
        await runDto(nameDto, { body: { name: "ab" } }),
        "TEXT_TOO_SHORT"
      );
    });

    it("should refuse a value above the maximum", async () => {
      expectRejected(
        await runDto(nameDto, { body: { name: "a".repeat(201) } }),
        "TEXT_TOO_LONG"
      );
    });
  });

  describe("optional fields", () => {
    it("should accept an absent value", async () => {
      expectAccepted(await runDto(optionalDto, { body: {} }));
    });

    it("should accept an empty value", async () => {
      expectAccepted(await runDto(optionalDto, { body: { precision: "" } }));
    });

    it("should still refuse markup when a value is given", async () => {
      expectRejected(
        await runDto(optionalDto, {
          body: { precision: "<img src=x onerror=alert(1)>" },
        })
      );
    });

    it("should still refuse a non-string when a value is given", async () => {
      expectRejected(
        await runDto(optionalDto, { body: { precision: { $ne: null } } })
      );
    });
  });
});

describe("richTextDto", () => {
  it("should keep the formatting written in the editor", async () => {
    const result = await runDto(descriptionDto, {
      body: {
        description: "<p>Un <strong>accueil</strong> ouvert tous les jours</p>",
      },
    });

    expectAccepted(result);
    expect(result.data.description).toBe(
      "<p>Un <strong>accueil</strong> ouvert tous les jours</p>"
    );
  });

  it.each(HTML_INJECTIONS)(
    "should store nothing executable from $label",
    async ({ value }) => {
      const result = await runDto(descriptionDto, {
        body: { description: `<p>Bonjour tout le monde</p>${value as string}` },
      });

      expect(result.thrown).toBeUndefined();

      const stored = (result.data.description ?? "") as string;

      expect(stored).not.toMatch(/<script/i);
      expect(stored).not.toMatch(/<iframe/i);
      expect(stored).not.toMatch(/\son\w+\s*=/i);
      expect(stored).not.toMatch(/\sstyle\s*=/i);
      expect(stored).not.toMatch(
        /(?:href|src|action)\s*=\s*["']?\s*(?:javascript|vbscript|data)\s*:/i
      );
    }
  );

  it.each(
    NON_EMPTY_INJECTIONS.filter(({ value }) => typeof value !== "string")
  )("should refuse $label without answering 500", async ({ value }) => {
    const result = await runDto(descriptionDto, {
      body: { description: value },
    });

    expect(result.thrown).toBeUndefined();
    expect(result.data.description).toBeUndefined();
  });

  it("should read null as a request to clear the description", async () => {
    expectAccepted(
      await runDto(descriptionDto, { body: { description: null } })
    );
  });

  it("should measure the length on the text, not on the markup", async () => {
    const result = await runDto(descriptionDto, {
      body: { description: `<p><strong>${"a".repeat(30)}</strong></p>` },
    });

    expectAccepted(result);
  });

  it("should refuse a description whose text exceeds the maximum", async () => {
    expectRejected(
      await runDto(descriptionDto, {
        body: { description: `<p>${"a".repeat(4001)}</p>` },
      }),
      "TEXT_TOO_LONG"
    );
  });
});
