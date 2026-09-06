import { captureException } from "@sentry/node";

import type { NextFunction, Request, RequestHandler, Response } from "express";

import type { ExpressRequest } from "../_models";

interface HttpError extends Error {
  status?: number;
  statusCode?: number;
  code?: string;
  type?: string;
}

const BAD_REQUEST = 400;
const PAYLOAD_TOO_LARGE = 413;
const UNSUPPORTED_MEDIA_TYPE = 415;
const INTERNAL_SERVER_ERROR = 500;

/**
 * Maps the errors thrown outside a validation chain onto the status the client
 * deserves. Everything listed here is caused by the request itself, so answering 500
 * would both mislead the caller and hide the real incidents in the logs.
 */
const getStatus = (error: HttpError): number => {
  // Multer, when the upload exceeds the route's limit
  if (error.code === "LIMIT_FILE_SIZE") {
    return PAYLOAD_TOO_LARGE;
  }

  if (error.code === "LIMIT_UNEXPECTED_FILE") {
    return UNSUPPORTED_MEDIA_TYPE;
  }

  // A malformed percent-encoding in the URL, raised by decodeURIComponent
  if (error instanceof URIError) {
    return BAD_REQUEST;
  }

  // A malformed JSON body, raised by the express.json parser
  if (error instanceof SyntaxError && "body" in error) {
    return BAD_REQUEST;
  }

  // An identifier that is not an ObjectId, raised by Mongoose or the BSON driver
  if (error.name === "CastError" || error.name === "BSONError") {
    return BAD_REQUEST;
  }

  const declared = error.status ?? error.statusCode;

  if (
    typeof declared === "number" &&
    declared >= BAD_REQUEST &&
    declared < 600
  ) {
    return declared;
  }

  return INTERNAL_SERVER_ERROR;
};

/**
 * The application had no error-handling middleware, so an exception raised outside a
 * route's own try/catch reached Express' default handler: an HTML page carrying the
 * stack trace whenever the environment is not production. Worse, on Express 4 a
 * rejected promise from an async handler reached no handler at all and the request
 * hung until the client timed out.
 *
 * This middleware is the last one mounted. It answers JSON, keeps the status the
 * request actually deserves, and reports only the genuine server errors.
 */
export const errorHandler = (
  error: HttpError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // The response has already started, only Express can close it now
  if (res.headersSent) {
    next(error);
    return;
  }

  const status = getStatus(error);
  const logged = req as ExpressRequest;

  if (status >= INTERNAL_SERVER_ERROR) {
    logged.log?.error(error, "UNHANDLED_ERROR");
    captureException(error);
  } else {
    logged.log?.warn({ err: error.message }, "REQUEST_REJECTED");
  }

  res.status(status).json({
    message:
      status >= INTERNAL_SERVER_ERROR ? "INTERNAL_SERVER_ERROR" : error.message,
  });
};

/**
 * Wraps an async handler so a rejected promise reaches `errorHandler` instead of
 * leaving the request without a response. Express 5 does this on its own; Express 4,
 * which this application runs, does not.
 */
export const asyncHandler =
  (handler: RequestHandler): RequestHandler =>
  (req, res, next) => {
    void Promise.resolve(handler(req, res, next)).catch(next);
  };
