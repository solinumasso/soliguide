import { Test } from "supertest";

import {
  CompatibilityCase,
  CompatibilityResponse,
  LegacyApiAdapter,
  PersonaContext,
  PublicApiAdapter,
} from "./compatibility.types";

const COMPAT_FRONT_ORIGIN = "https://soliguide.fr";
const COMPAT_FRONT_REFERER = `${COMPAT_FRONT_ORIGIN}/recherche`;

export class LegacyApiSupertestAdapter implements LegacyApiAdapter {
  constructor(private readonly client: HttpClient) {}

  async search(
    testCase: CompatibilityCase<Record<string, unknown>>,
    persona: PersonaContext,
  ): Promise<CompatibilityResponse> {
    const langSuffix = testCase.lang ? `/${testCase.lang}` : "";
    const request = this.client
      .post(`/new-search${langSuffix}`)
      .send(testCase.payload);

    this.applyRequestHeaders(request, persona);

    if (persona.isLogged && persona.legacyJwt) {
      request.set("Authorization", `JWT ${persona.legacyJwt}`);
    }

    const response = await request;

    return {
      status: response.status,
      body: response.body,
    };
  }

  async getPlace(params: {
    lieuId: string;
    lang?: string;
    persona: PersonaContext;
  }): Promise<CompatibilityResponse> {
    const langSuffix = params.lang ? `/${params.lang}` : "";
    const request = this.client.get(`/place/${params.lieuId}${langSuffix}`);

    this.applyRequestHeaders(request, params.persona);

    if (params.persona.isLogged && params.persona.legacyJwt) {
      request.set("Authorization", `JWT ${params.persona.legacyJwt}`);
    }

    const response = await request;

    return {
      status: response.status,
      body: response.body,
    };
  }

  private applyRequestHeaders(request: Test, _persona: PersonaContext): void {
    request
      .set("Origin", COMPAT_FRONT_ORIGIN)
      .set("Referer", COMPAT_FRONT_REFERER)
      .set("X-Document-Referrer", COMPAT_FRONT_REFERER);
  }
}

export class PublicApiSupertestAdapter implements PublicApiAdapter {
  constructor(private readonly client: HttpClient) {}

  async search(
    testCase: CompatibilityCase<Record<string, unknown>>,
    persona: PersonaContext,
  ): Promise<CompatibilityResponse> {
    const request = this.client.post("/search").send(testCase.payload);

    this.applyRequestHeaders(request, persona);

    const response = await request;

    return {
      status: response.status,
      body: response.body,
    };
  }

  async getPlace(params: {
    lieuId: string;
    lang?: string;
    persona: PersonaContext;
  }): Promise<CompatibilityResponse> {
    const langSuffix = params.lang ? `/${params.lang}` : "";
    const request = this.client.get(`/place/${params.lieuId}${langSuffix}`);

    this.applyRequestHeaders(request, params.persona);

    const response = await request;

    return {
      status: response.status,
      body: response.body,
    };
  }

  private applyRequestHeaders(request: Test, persona: PersonaContext): void {
    request
      .set("Origin", COMPAT_FRONT_ORIGIN)
      .set("Referer", COMPAT_FRONT_REFERER)
      .set("X-Document-Referrer", COMPAT_FRONT_REFERER);

    if (persona.isLogged && persona.legacyJwt) {
      request.set("Authorization", `JWT ${persona.legacyJwt}`);
    }
  }
}

type HttpClient = {
  post: (url: string) => Test;
  get: (url: string) => Test;
};
