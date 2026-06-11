import express, { type NextFunction } from "express";

import {
  CONFIG,
  type ExpressRequest,
  type ExpressResponse,
} from "../../_models";
import { PlaceModel } from "../models/place.model";

const router = express.Router();

// Simple sliding-window rate limiter: max 60 requests per minute per IP
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_MAX = 60;
const RATE_LIMIT_WINDOW_MS = 60_000;

setInterval(() => {
  const now = Date.now();
  for (const [ip, timestamps] of rateLimitMap.entries()) {
    const fresh = timestamps.filter(
      (timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS
    );
    if (fresh.length === 0) {
      rateLimitMap.delete(ip);
    } else {
      rateLimitMap.set(ip, fresh);
    }
  }
}, RATE_LIMIT_WINDOW_MS);

const rateLimit = (
  req: ExpressRequest,
  res: ExpressResponse,
  next: NextFunction
) => {
  const ip = req.ip ?? "unknown";
  const now = Date.now();
  const timestamps = (rateLimitMap.get(ip) ?? []).filter(
    (timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS
  );

  if (timestamps.length >= RATE_LIMIT_MAX) {
    return res.status(429).json({ message: "TOO_MANY_REQUESTS" });
  }

  timestamps.push(now);
  rateLimitMap.set(ip, timestamps);
  return next();
};

const checkAirtableToken = (
  req: ExpressRequest,
  res: ExpressResponse,
  next: NextFunction
) => {
  if (!CONFIG.N8N_AIRTABLE_TOKEN) {
    return res.status(503).json({ message: "AIRTABLE_SYNC_NOT_CONFIGURED" });
  }

  const token = req.headers["x-airtable-token"];
  if (token !== CONFIG.N8N_AIRTABLE_TOKEN) {
    return res.status(401).json({ message: "UNAUTHORIZED" });
  }

  return next();
};

router.patch(
  "/places/:lieu_id/at-sync-date",
  rateLimit,
  checkAirtableToken,
  async (req: ExpressRequest, res: ExpressResponse) => {
    const lieu_id = parseInt(req.params.lieu_id, 10);

    if (isNaN(lieu_id)) {
      return res.status(400).json({ message: "INVALID_PLACE_ID" });
    }

    try {
      const result = await PlaceModel.updateOne(
        { lieu_id },
        { $set: { atSyncDate: new Date() } }
      ).exec();

      if (result.matchedCount === 0) {
        return res.status(404).json({ message: "PLACE_NOT_FOUND" });
      }

      return res.status(200).json({ message: "OK" });
    } catch (error) {
      req.log.error(error, "AIRTABLE_SYNC_DATE_UPDATE_FAIL");
      return res
        .status(500)
        .json({ message: "AIRTABLE_SYNC_DATE_UPDATE_FAIL" });
    }
  }
);

export default router;
