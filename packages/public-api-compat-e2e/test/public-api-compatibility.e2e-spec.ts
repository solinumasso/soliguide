import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { afterAll, beforeAll, describe, it, expect } from "vitest";

import { createCompatibilityEnvironment } from "./support/compatibility.environment";
import { CompatibilityEnvironment } from "./support/compatibility.environment";
import { SEARCH_PERSONA_KEYS } from "./support/persona.constants";
import { SEARCH_COMPATIBILITY_CASES } from "./support/search-compatibility.cases";
import {
  CompatibilityCase,
  PersonaContext,
  CompatibilityResponse,
} from "./support/compatibility.types";

describe("public-api compatibility e2e", () => {
  let environment: CompatibilityEnvironment;

  beforeAll(async () => {
    environment = await createCompatibilityEnvironment();
  });

  afterAll(async () => {
    if (environment) {
      await environment.dispose();
    }
  });

  describe("POST /new-search/:lang? parity with POST /search", () => {
    for (const personaKey of SEARCH_PERSONA_KEYS) {
      describe(`persona: ${personaKey}`, () => {
        for (const testCase of SEARCH_COMPATIBILITY_CASES) {
          it(`${testCase.id} - ${testCase.title}`, async () => {
            const persona = environment.personas[personaKey];

            const legacyResponse = await environment.legacyApiAdapter.search(
              testCase,
              persona,
            );

            const publicApiResponse = await environment.publicApiAdapter.search(
              testCase,
              persona,
            );

            await assertResponsesEquality({
              testCase,
              persona,
              legacyResponse,
              publicApiResponse,
            });
          });
        }
      });
    }
  });

  describe.skip("GET /place/:lieu_id/:lang? parity scaffolding", () => {
    it("is scaffolded and will be activated once public-api place endpoint is implemented", async () => {
      const persona = environment.personas.NOT_LOGGED;

      // Strategy: take a stable lieu_id from seeded data, or bootstrap from search result.
      const legacyResponse = await environment.legacyApiAdapter.getPlace({
        lieuId: "1",
        lang: "fr",
        persona,
      });
      const publicApiResponse = await environment.publicApiAdapter.getPlace({
        lieuId: "1",
        lang: "fr",
        persona,
      });

      await assertResponsesEquality({
        testCase: {
          id: "place-get",
          title: "place endpoint parity",
          routeIntent: "place",
          payload: {},
          lang: "fr",
        },
        persona,
        legacyResponse,
        publicApiResponse,
      });
    });
  });
});

async function assertResponsesEquality(params: {
  testCase: CompatibilityCase<Record<string, unknown>>;
  persona: PersonaContext;
  legacyResponse: CompatibilityResponse;
  publicApiResponse: CompatibilityResponse;
}): Promise<void> {
  const { legacyResponse, publicApiResponse } = params;

  expect(
    publicApiResponse.status,
    buildMismatchLabel(params, "HTTP status"),
  ).toBe(legacyResponse.status);

  if (legacyResponse.status >= 200 && legacyResponse.status < 300) {
    await expectWithArtifacts({
      ...params,
      mismatchType: "success-payload",
      actual: publicApiResponse.body,
      expected: legacyResponse.body,
      message: "Success payload mismatch",
    });

    return;
  }

  await expectWithArtifacts({
    ...params,
    mismatchType: "error-body",
    actual: publicApiResponse.body,
    expected: legacyResponse.body,
    message: "Error payload mismatch",
  });
}

function readMessage(body: unknown): string | null {
  if (!body || typeof body !== "object") {
    return null;
  }

  const maybeMessage = (body as Record<string, unknown>).message;

  return typeof maybeMessage === "string" ? maybeMessage : null;
}

async function expectWithArtifacts(params: {
  testCase: CompatibilityCase<Record<string, unknown>>;
  persona: PersonaContext;
  legacyResponse: CompatibilityResponse;
  publicApiResponse: CompatibilityResponse;
  mismatchType: string;
  actual: unknown;
  expected: unknown;
  message: string;
}): Promise<void> {
  const { actual, expected } = params;

  try {
    expect(actual, buildMismatchLabel(params, params.message)).toEqual(
      expected,
    );
  } catch (error) {
    await writeMismatchArtifacts(params);
    throw error;
  }
}

function buildMismatchLabel(
  params: {
    testCase: CompatibilityCase<Record<string, unknown>>;
    persona: PersonaContext;
  },
  message: string,
): string {
  return `${message} for ${params.testCase.id} (${params.persona.key})`;
}

async function writeMismatchArtifacts(params: {
  testCase: CompatibilityCase<Record<string, unknown>>;
  persona: PersonaContext;
  legacyResponse: CompatibilityResponse;
  publicApiResponse: CompatibilityResponse;
  mismatchType: string;
}): Promise<void> {
  const { testCase, persona, legacyResponse, publicApiResponse, mismatchType } =
    params;
  const directory = path.join(
    process.cwd(),
    ".tmp",
    "public-api-compat-failures",
    `${sanitizePathSegment(testCase.id)}-${sanitizePathSegment(persona.key)}-${sanitizePathSegment(mismatchType)}`,
  );

  await mkdir(directory, { recursive: true });
  await Promise.all([
    writeArtifact(path.join(directory, "legacy.json"), legacyResponse.body),
    writeArtifact(
      path.join(directory, "public-api.json"),
      publicApiResponse.body,
    ),
    writeArtifact(path.join(directory, "meta.json"), {
      caseId: testCase.id,
      title: testCase.title,
      persona: persona.key,
      mismatchType,
      legacyStatus: legacyResponse.status,
      publicApiStatus: publicApiResponse.status,
      legacyMessage: readMessage(legacyResponse.body),
      publicApiMessage: readMessage(publicApiResponse.body),
    }),
  ]);
}

async function writeArtifact(filePath: string, value: unknown): Promise<void> {
  await writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf-8");
}

function sanitizePathSegment(value: string): string {
  return value.replace(/[^a-zA-Z0-9-_]/g, "_");
}
