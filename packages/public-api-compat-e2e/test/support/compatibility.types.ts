import { Categories, UserStatus, UserStatusNotLogged } from "@soliguide/common";

export type PersonaKey =
  | "NOT_LOGGED"
  | "API_USER"
  | "PRO"
  | "SIMPLE_USER"
  | "VOLUNTEER"
  | "WIDGET_USER"
  | "SOLI_BOT";

export type PersonaStatus =
  | UserStatus.API_USER
  | UserStatus.PRO
  | UserStatus.SIMPLE_USER
  | UserStatus.VOLUNTEER
  | UserStatus.WIDGET_USER
  | UserStatus.SOLI_BOT
  | UserStatusNotLogged.NOT_LOGGED;

export interface PersonaContext {
  key: PersonaKey;
  status: PersonaStatus;
  isLogged: boolean;
  publicApiUserId?: string;
  legacyUserObjectId?: string;
  legacyJwt?: string;
  categoriesLimitations?: Categories[];
}

export interface CompatibilityCase<TPayload> {
  id: string;
  title: string;
  routeIntent: "search" | "place";
  payload: TPayload;
  lang?: string;
}

export interface CompatibilityResponse {
  status: number;
  body: unknown;
}

export interface ResponseComparator {
  compare(params: {
    testCase: CompatibilityCase<Record<string, unknown>>;
    persona: PersonaContext;
    legacyResponse: CompatibilityResponse;
    publicApiResponse: CompatibilityResponse;
  }): void;
}

export interface LegacyApiAdapter {
  search(
    testCase: CompatibilityCase<Record<string, unknown>>,
    persona: PersonaContext
  ): Promise<CompatibilityResponse>;

  getPlace(params: {
    lieuId: string;
    lang?: string;
    persona: PersonaContext;
  }): Promise<CompatibilityResponse>;
}

export interface PublicApiAdapter {
  search(
    testCase: CompatibilityCase<Record<string, unknown>>,
    persona: PersonaContext
  ): Promise<CompatibilityResponse>;

  getPlace(params: {
    lieuId: string;
    lang?: string;
    persona: PersonaContext;
  }): Promise<CompatibilityResponse>;
}
