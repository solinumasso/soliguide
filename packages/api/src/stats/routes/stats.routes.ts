import apicache from "apicache";

import express from "express";

import * as StatsController from "../controllers/stats.controller";

import { CONFIG, ExpressRequest, ExpressResponse } from "../../_models";

const cache = apicache.middleware;

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Stats
 *   description: Statistics routes
 */

/**
 * @swagger
 *
 * /stats/services:
 *   get:
 *     description: Amount of services in Soliguide
 *     tags: [Stats]
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: count
 *     security:
 *      - bearerAuth: []
 */

router.get(
  "/services",
  CONFIG.ENV === "test" || CONFIG.ENV === "CI" ? [] : cache("24 hours"),
  async (_req: ExpressRequest, res: ExpressResponse) => {
    try {
      const stats = await StatsController.countAllServices();
      return res.status(200).json(stats);
    } catch (err) {
      return res.status(500).json({ message: "SERVICES_COUNT_ERROR" });
    }
  }
);

/**
 * @swagger
 *
 * /stats/all/:
 *   get:
 *     description: Amount of services in Soliguide
 *     tags: [Stats]
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: count
 */
router.get(
  "/all",
  CONFIG.ENV === "test" || CONFIG.ENV === "CI" ? [] : cache("24 hours"),
  async (_req: ExpressRequest, res: ExpressResponse) => {
    try {
      const stats = await StatsController.countAllPlaces();
      return res.status(200).json(stats);
    } catch (err) {
      return res.status(500).json({ message: "PLACES_COUNT_ERROR" });
    }
  }
);

export default router;
