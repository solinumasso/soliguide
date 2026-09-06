import {
  matchedData,
  validationResult,
  type ValidationChain,
} from "express-validator";

import type { ExpressRequest } from "../../_models";

export interface DtoRunResult {
  /** Validation errors, as `getFilteredData` would return them in the 400 body */
  errors: { path: string; msg: string }[];
  /** Error messages only, for concise assertions */
  messages: string[];
  /** What `getFilteredData` would place in `req.bodyValidated` */
  data: Record<string, unknown>;
  /** The request after the chains ran, sanitizers included */
  request: Record<string, unknown>;
  /**
   * Set when a chain threw instead of recording an error.
   * express-validator does not catch exceptions raised inside a `customSanitizer`:
   * the middleware promise rejects and the request ends as a 500, not a 400.
   * A DTO must never produce this, whatever the input.
   */
  thrown?: Error;
}

export interface DtoRunInput {
  body?: Record<string, unknown>;
  params?: Record<string, unknown>;
  query?: Record<string, unknown>;
  /** Merged into the request, for chains that read `req.user` or `req.organization` */
  context?: Record<string, unknown>;
}

/**
 * Runs a DTO exactly as the route pipeline does: every chain, then the checks
 * `getFilteredData` performs. Never throws, so a spec can assert on `thrown`
 * instead of failing with an unrelated stack trace.
 */
export const runDto = async (
  chains: ValidationChain[],
  input: DtoRunInput = {}
): Promise<DtoRunResult> => {
  const request = {
    body: input.body ?? {},
    params: input.params ?? {},
    query: input.query ?? {},
    headers: {},
    ...(input.context ?? {}),
  } as unknown as ExpressRequest;

  let thrown: Error | undefined;

  for (const chain of chains) {
    try {
      await chain.run(request);
    } catch (error) {
      thrown = error as Error;
      break;
    }
  }

  const errors = validationResult(request)
    .array()
    .map((error) => ({
      path: "path" in error ? String(error.path) : "",
      msg: String(error.msg),
    }));

  return {
    errors,
    messages: errors.map((error) => error.msg),
    // Same options as the getFilteredData middleware
    data: thrown ? {} : matchedData(request, { includeOptionals: true }),
    request: request as unknown as Record<string, unknown>,
    thrown,
  };
};

/**
 * Asserts the contract every DTO owes the API: whatever comes in, the request
 * ends as a 400 or a clean 200, never as an exception escaping the chain.
 */
export const expectNoServerError = (result: DtoRunResult): void => {
  if (result.thrown) {
    throw new Error(
      `A DTO chain threw instead of recording a validation error, which the route returns as a 500: ${result.thrown.message}`
    );
  }
};

/** Asserts the value was refused, optionally with a precise message */
export const expectRejected = (
  result: DtoRunResult,
  message?: string
): void => {
  expectNoServerError(result);
  if (result.errors.length === 0) {
    throw new Error(
      `Expected the value to be refused, but the DTO accepted it and produced ${JSON.stringify(
        result.data
      )}`
    );
  }
  if (message && !result.messages.includes(message)) {
    throw new Error(
      `Expected the error "${message}", got ${JSON.stringify(result.messages)}`
    );
  }
};

/** Asserts the value was accepted */
export const expectAccepted = (result: DtoRunResult): void => {
  expectNoServerError(result);
  if (result.errors.length > 0) {
    throw new Error(
      `Expected the value to be accepted, got ${JSON.stringify(result.errors)}`
    );
  }
};
