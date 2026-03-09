import { supertest } from "../endPointTester";

describe("GET /sitemap/:country/:regionCode", () => {
  test("✅ Returns sitemap XML without origin header (like Googlebot)", async () => {
    const response = await supertest()
      .get("/sitemap/fr/01")
      .set(
        "User-Agent",
        "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"
      );

    expect(response.status).toEqual(200);
    expect(response.headers["content-type"]).toContain("text/xml");
    expect(response.text).toContain("<?xml");
    expect(response.text).toContain("urlset");
  });

  test("✅ Returns sitemap without referer header", async () => {
    const response = await supertest()
      .get("/sitemap/fr/01")
      .set(
        "User-Agent",
        "Mozilla/5.0 (compatible; Bingbot/2.0; +http://www.bing.com/bingbot.htm)"
      );

    expect(response.status).toEqual(200);
    expect(response.headers["content-type"]).toContain("text/xml");
  });

  test("✅ Returns 400 for invalid country", async () => {
    const response = await supertest()
      .get("/sitemap/invalid-country/11")
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
