import { Controller, Get } from "@nestjs/common";
import { HealthCheck } from "@nestjs/terminus";

@Controller()
export class AppController {
  constructor() {}

  @Get("/")
  @HealthCheck()
  async check() {
    return {
      message: "Hello! Welcome to Location API",
      timestamp: new Date().toISOString(),
    };
  }
}
