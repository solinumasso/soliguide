import { Controller, Get } from "@nestjs/common";
import { HealthCheck } from "@nestjs/terminus";

@Controller()
export class AppController {
  @Get("/")
  @HealthCheck()
  async check() {
    return {
      message: "Hello! Welcome to Location API from Soliguide",
      timestamp: new Date().toISOString(),
    };
  }
}
