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
      url.ele(
        "lastmod",
        new Date(place.updatedByUserAt || Date.now())
          .toISOString()
          .replace(/\.\d{3}Z$/, "+00:00")
      );
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
