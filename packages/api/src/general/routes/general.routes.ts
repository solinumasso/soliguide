/*
 * Soliguide: Useful information for those who need it
 *
 * SPDX-FileCopyrightText: © 2024 Solinum
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
import express from "express";
import { createCache } from "cache-manager";

import { ExpressRequest, ExpressResponse } from "../../_models";
import { contactEmailDto } from "../dto/contactEmail.dto";
import { emailContact } from "../../emailing/senders/send-contact.email";
import { generateSitemap } from "../services/generate-sitemap";
import { getFilteredData } from "../../middleware";

const router = express.Router();

const memoryCache = createCache({ ttl: 24 * 60 * 60 });

router.get("/", (_req: ExpressRequest, res: ExpressResponse) => {
  res.json("Soliguide API");
});

router.get(
  "/sitemap.xml",
  async (req: ExpressRequest, res: ExpressResponse) => {
    try {
      let xml = await memoryCache.get("sitemap");
      if (!xml) {
        xml = await generateSitemap(req.log);
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
