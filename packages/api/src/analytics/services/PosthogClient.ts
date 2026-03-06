import { PostHog } from "posthog-node";

import { CONFIG } from "../../_models/config";
import type { ExpressRequest } from "../../_models";
import { UNKNOWN_DISTINCT_ID, UNKNOWN_SESSION_ID } from "../constants";

export interface PosthogEventMessage {
  event: string;
  req?: ExpressRequest;
  properties?: Record<string | number, any>; // skipcq: JS-0323
}

export class PosthogClient {
  static #instance: PosthogClient | null = null;
  private readonly posthog: PostHog | null;

  constructor() {
    this.posthog = CONFIG.SOLIGUIDE_POSTHOG_API_KEY
      ? new PostHog(CONFIG.SOLIGUIDE_POSTHOG_API_KEY, {
          host: CONFIG.SOLIGUIDE_POSTHOG_URL,
        })
      : null;
  }

  public static get instance(): PosthogClient {
    if (PosthogClient.#instance === null) {
      PosthogClient.#instance = new PosthogClient();
    }
    return PosthogClient.#instance;
  }

  public static getDistinctIdAndSessionIdFromRequest(req?: ExpressRequest): {
    distinctId: string;
    sessionId: string;
  } {
    const posthogUserDistinctIdHeaderValue = req?.get("X-Ph-User-Distinct-Id");
    const posthogSessionIdHeaderValue = req?.get("X-Ph-User-Session-Id");

    const distinctId =
      posthogUserDistinctIdHeaderValue != null
        ? posthogUserDistinctIdHeaderValue
        : String(req?.userForLogs?.user_id ?? UNKNOWN_DISTINCT_ID);

    const sessionId =
      posthogSessionIdHeaderValue != null
        ? posthogSessionIdHeaderValue
        : UNKNOWN_SESSION_ID;

    return { distinctId, sessionId };
  }

  public capture({ event, req, properties }: PosthogEventMessage): void {
    if (this.posthog !== null) {
      const { distinctId, sessionId } =
        PosthogClient.getDistinctIdAndSessionIdFromRequest(req);
      this.posthog.capture({
        distinctId,
        event,
        properties: {
          ...properties,
          sessionId,
        },
      });
    }
  }
}
