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
import xmlbuilder from "xmlbuilder";

import {
  PlaceType,
  PlaceStatus,
  SupportedLanguagesCode,
  AnyRegionCode,
  SoliguideCountries,
} from "@soliguide/common";

import { CONFIG } from "../../_models";
import { PlaceModel } from "../../place/models";
import { logger } from "../logger";

export const generateRegionSitemap = async (siteMapDto: {
  country: SoliguideCountries;
  regionCode: AnyRegionCode;
}) => {
  const { country, regionCode } = siteMapDto;
  logger.info(
    `[SITEMAP] Generating sitemap for region ${regionCode} in ${country}`
  );

  try {
    const urlset = xmlbuilder
      .create("urlset")
      .att("xmlns", "http://www.sitemaps.org/schemas/sitemap/0.9");

    const sitemapPlaces = await PlaceModel.find({
      placeType: PlaceType.PLACE,
      "position.country": country,
      "position.regionCode": regionCode,
      status: PlaceStatus.ONLINE,
    })
      .select("seo_url updatedAt updatedByUserAt")
      .lean()
      .exec();

    logger.info(
      `[SITEMAP] Region ${regionCode} includes ${sitemapPlaces.length} places for sitemap`
    );

    const frontUrl = CONFIG.SOLIGUIDE_FR_URL;

    for (const place of sitemapPlaces) {
      const url = urlset.ele("url");
      url.ele(
        "loc",
        `${frontUrl}/${SupportedLanguagesCode.FR}/fiche/${place.seo_url}/`
      );
      url.ele("lastmod", place.updatedByUserAt || new Date().toISOString());
      url.ele("changefreq", "monthly");
      url.ele("priority", "0.8");
    }

    return urlset
      .dec({ version: "1.0", encoding: "UTF-8" })
      .end({ pretty: true });
  } catch (error) {
    logger.error(
      `[SITEMAP] Error generating sitemap for region ${regionCode}: ${error.message}`
    );
    return null;
  }
};
