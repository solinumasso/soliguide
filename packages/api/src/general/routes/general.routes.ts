import express from "express";
import { createCache } from "cache-manager";

import { ExpressRequest, ExpressResponse } from "../../_models";
import { getFilteredData } from "../../middleware";
import { sitemapDto, contactEmailDto } from "../dto";
import { generateRegionSitemap, getVersion, checkMongo } from "../services";
import { emailContact } from "../../emailing/senders/send-contact.email";

const router = express.Router();

const memoryCache = createCache({ ttl: 24 * 60 * 60 });

router.get("/", (_req: ExpressRequest, res: ExpressResponse) => {
  res.setHeader("X-Robots-Tag", "noindex, nofollow");
  res.json("Soliguide API");
});

/**
 * @swagger
 *
 * /health:
 *   get:
 *     description: Health check endpoint to verify API and database status
 *     tags: [general]
 *     responses:
 *       200:
 *         description: Health status response
 */
router.get("/health", async (_req: ExpressRequest, res: ExpressResponse) => {
  const mongo = await checkMongo();

  res.setHeader("X-Robots-Tag", "noindex, nofollow");
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");

  return res.status(mongo === "up" ? 200 : 503).json({
    status: mongo === "up" ? "ok" : "down",
    version: getVersion(),
    mongo,
  });
});

router.get(
  "/sitemap/:country/:regionCode",
  sitemapDto,
  getFilteredData,
  async (req: ExpressRequest, res: ExpressResponse) => {
    try {
      let xml = await memoryCache.get("sitemap");
      if (!xml) {
        xml = await generateRegionSitemap(req.bodyValidated);
        await memoryCache.set("sitemap", xml);
      }
      res.set("Content-Type", "text/xml");
      return res.send(xml);
    } catch (error) {
      req.log.error(error);
      return res.status(500).send("CANNOT_GET_SITEMAP");
    }
  }
);

/**
 * @swagger
 *
 * /general/contact
 *   post:
 *     description: send an email to Soliguide team according to the request body
 *     tags: [general]
 */
router.post("/contact", contactEmailDto, getFilteredData, emailContact);

export default router;
