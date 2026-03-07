import { Controller, Get } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
} from "@nestjs/terminus";
import type { AxiosResponse } from "axios";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

@Controller("health")
export class HealthController {
  private readonly version: string;

  constructor(
    private readonly health: HealthCheckService,
    private readonly http: HttpHealthIndicator,
    private readonly configService: ConfigService
  ) {
    this.version = this.getVersion();
  }

  private getVersion(): string {
    try {
      const paths = [
        resolve(__dirname, "../../package.json"),
        resolve(__dirname, "../../../package.json"),
      ];

      for (const packageJsonPath of paths) {
        try {
          const packageJson = JSON.parse(
            readFileSync(packageJsonPath, "utf-8")
          );
          if (packageJson.version) {
            return packageJson.version;
          }
        } catch {
          continue;
        }
      }
      return "0.0.0";
    } catch {
      return "0.0.0";
    }
  }

  @Get()
  @HealthCheck()
  async check() {
    const checks = [
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
    ];

    const result = await this.health.check(checks);

    return {
      ...result,
      version: this.version,
    };
  }
}
