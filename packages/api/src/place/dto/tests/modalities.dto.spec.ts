import { modalitiesDto } from "../modalities.dto";
import {
  expectAccepted,
  expectRejected,
  runDto,
} from "../../../_utils/tests/run-dto";

const buildModalities = (other: unknown) => ({
  modalities: {
    inconditionnel: true,
    appointment: { checked: false, precisions: "" },
    inscription: { checked: false, precisions: "" },
    orientation: { checked: false, precisions: "" },
    other,
    docs: [],
  },
});

describe("modalitiesDto", () => {
  it("should keep the formatting the editor writes in the precisions", async () => {
    const result = await runDto(modalitiesDto(), {
      body: buildModalities("<p>Accueil sur <strong>rendez-vous</strong></p>"),
    });

    expectAccepted(result);
    expect((result.request.body as any).modalities.other).toBe(
      "<p>Accueil sur <strong>rendez-vous</strong></p>"
    );
  });

  it("should store nothing executable from the precisions", async () => {
    const result = await runDto(modalitiesDto(), {
      body: buildModalities(
        "<p>Accueil</p><script>alert(1)</script><img src=x onerror=alert(1)>"
      ),
    });

    expectAccepted(result);

    const stored = (result.request.body as any).modalities.other as string;

    expect(stored).not.toMatch(/<script/i);
    expect(stored).not.toMatch(/<img/i);
    expect(stored).not.toMatch(/\son\w+\s*=/i);
    expect(stored).toContain("Accueil");
  });

  it("should accept precisions left empty", async () => {
    expectAccepted(
      await runDto(modalitiesDto(), { body: buildModalities("") })
    );
  });

  it("should refuse a non-string in the precisions", async () => {
    expectRejected(
      await runDto(modalitiesDto(), { body: buildModalities({ $ne: null }) })
    );
  });
});
