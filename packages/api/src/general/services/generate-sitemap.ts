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
import type { Logger } from "pino";
import xmlbuilder from "xmlbuilder";

import {
  PlaceType,
  PlaceStatus,
  SupportedLanguagesCode,
} from "@soliguide/common";

import { CONFIG } from "../../_models";
import { logger as defaultLogger } from "../logger";
import { PlaceModel } from "../../place/models";

export const generateSitemap = async (logger: Logger = defaultLogger) => {
  logger.info("[SITEMAP] Generate sitemap start");
  const urlset = xmlbuilder
    .create("urlset")
    .att("xmlns", "http://www.sitemaps.org/schemas/sitemap/0.9");

  const sitemapPlaces = await PlaceModel.find({
    placeType: PlaceType.PLACE,
    "position.slugs.city": "paris",
    status: PlaceStatus.ONLINE,
  })
    .select("seo_url updatedAt")
    .lean()
    .exec();

  logger.info(
    `sitemap includes ${sitemapPlaces.length} places to add to sitemap.xml`
  );
  const frontUrl = CONFIG.SOLIGUIDE_FR_URL;

  let url = urlset.ele("url");
  url.ele("loc", `${frontUrl}${SupportedLanguagesCode.FR}`);
  url.ele("priority", 1);

  url = urlset.ele("url");
  url.ele("loc", `${frontUrl}${SupportedLanguagesCode.FR}/contact/`);
  url.ele("priority", 1);

  for (const place of sitemapPlaces) {
    url = urlset.ele("url");
    url.ele(
      "loc",
      `${frontUrl}${SupportedLanguagesCode.FR}/fiche/${place.seo_url}/`
    );
    url.ele("lastmod", place.updatedByUserAt);
    url.ele("changefreq", "monthly");
    url.ele("priority", "0.8");
  }

  return urlset.dec("1.0", "UTF-8").end({ pretty: true });
};
