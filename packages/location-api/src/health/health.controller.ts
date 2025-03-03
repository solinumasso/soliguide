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
import { Controller, Get } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
} from "@nestjs/terminus";
import type { AxiosResponse } from "axios";

@Controller("health")
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly http: HttpHealthIndicator,
    private readonly configService: ConfigService
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () =>
        this.http.responseCheck(
          "here-api",
          "https://status.here.com/api/here/v1/status",
          // TODO: check the result when there's an incident ongoing
          (response: AxiosResponse<{ result?: { status?: "ok" | string } }>) =>
            response.status === 200 &&
            response.data?.result?.status != null &&
            response.data?.result?.status === "ok",
          { params: { service: "Geocoding & Search API v7", format: "json" } }
        ),
      () =>
        this.http.pingCheck(
          "geoplateforme",
          `${this.configService.get<string>(
            "FRENCH_ADDRESS_API_URL"
          )}/getCapabilities`,
          {
            params: { service: "Geocoding & Search API v7", format: "json" },
          }
        ),
    ]);
  }
}
