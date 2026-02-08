/*
 * Soliguide: Useful information for those who need it
 *
 * SPDX-FileCopyrightText: © 2025 Solinum
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
import { supertest } from "../endPointTester";

describe("GET /sitemap/:country/:regionCode", () => {
  test("✅ Returns sitemap XML without origin header (like Googlebot)", async () => {
    const response = await supertest()
      .get("/sitemap/fr/ile-de-france")
      .set("User-Agent", "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)");

    expect(response.status).toEqual(200);
    expect(response.headers["content-type"]).toContain("text/xml");
    expect(response.text).toContain("<?xml");
    expect(response.text).toContain("urlset");
  });

  test("✅ Returns sitemap without referer header", async () => {
    const response = await supertest()
      .get("/sitemap/fr/provence-alpes-cote-d-azur")
      .set("User-Agent", "Mozilla/5.0 (compatible; Bingbot/2.0; +http://www.bing.com/bingbot.htm)");

    expect(response.status).toEqual(200);
    expect(response.headers["content-type"]).toContain("text/xml");
  });

  test("✅ Returns 400 for invalid country", async () => {
    const response = await supertest()
      .get("/sitemap/invalid-country/ile-de-france")
      .set("User-Agent", "Mozilla/5.0 (compatible; Googlebot/2.1)");

    expect(response.status).toEqual(400);
  });

  test("✅ Returns 400 for invalid region code", async () => {
    const response = await supertest()
      .get("/sitemap/fr/invalid-region")
      .set("User-Agent", "Mozilla/5.0 (compatible; Googlebot/2.1)");

    expect(response.status).toEqual(400);
  });
});
