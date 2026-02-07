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
import { supertest } from "../endPointTester";

describe("GET /health", () => {
  test("✅ Returns health status with correct structure", async () => {
    const startTime = Date.now();
    const response = await supertest().get("/health");
    const responseTime = Date.now() - startTime;

    expect(response.status).toEqual(200);
    expect(response.body).toHaveProperty("status");
    expect(response.body).toHaveProperty("version");
    expect(response.body).toHaveProperty("mongo");
    expect(response.body).toHaveProperty("redis");

    expect(["ok", "degraded", "down"]).toContain(response.body.status);
    expect(["up", "down"]).toContain(response.body.mongo);
    expect(["up", "down"]).toContain(response.body.redis);
    expect(typeof response.body.version).toBe("string");

    if (response.body.mongo === "up" && response.body.redis === "up") {
      expect(response.body.status).toBe("ok");
    } else if (
      response.body.mongo === "down" &&
      response.body.redis === "down"
    ) {
      expect(response.body.status).toBe("down");
    } else {
      expect(response.body.status).toBe("degraded");
    }
    expect(responseTime).toBeLessThan(100);
  });

  test("✅ Returns 200 even when services are healthy", async () => {
    const response = await supertest().get("/health");

    expect(response.status).toEqual(200);
  });

  test("✅ Version is correctly injected", async () => {
    const response = await supertest().get("/health");

    expect(response.body.version).toMatch(/^\d+\.\d+\.\d+.*$|^0\.0\.0$/);
  });
});
