import { SupportedLanguagesCode } from "@soliguide/common";

import {
  isRetryableGoogleTranslateError,
  translateTextWithRetry,
} from "./translate-fields.job";

jest.mock("@google-cloud/translate", () => ({
  v2: {
    Translate: jest.fn().mockImplementation(() => ({
      translate: jest.fn(),
    })),
  },
}));

jest.mock("../../../general/logger", () => ({
  logger: {
    error: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
  },
}));

describe("translate-fields job helpers", () => {
  it("retries transient Google Translate stream errors", async () => {
    const translate = jest
      .fn()
      .mockRejectedValueOnce({ code: "ERR_STREAM_PREMATURE_CLOSE" })
      .mockResolvedValueOnce(["translated content"]);

    await expect(
      translateTextWithRetry(
        { translate },
        "content",
        SupportedLanguagesCode.EN,
        0
      )
    ).resolves.toBe("translated content");

    expect(translate).toHaveBeenCalledTimes(2);
  });

  it("does not retry non-retryable Google Translate errors", async () => {
    const translate = jest.fn().mockRejectedValue({ code: 403 });

    await expect(
      translateTextWithRetry(
        { translate },
        "content",
        SupportedLanguagesCode.EN,
        0
      )
    ).rejects.toMatchObject({ code: 403 });

    expect(translate).toHaveBeenCalledTimes(1);
  });

  it("identifies retryable status errors", () => {
    expect(isRetryableGoogleTranslateError({ statusCode: 429 })).toBe(true);
    expect(isRetryableGoogleTranslateError({ status: 503 })).toBe(true);
    expect(isRetryableGoogleTranslateError({ code: 400 })).toBe(false);
  });
});
