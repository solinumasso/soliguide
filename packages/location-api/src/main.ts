import "./sentry/instrument";
import { bootstrapApplication } from "./app-bootstrap";
import { ConfigService } from "@nestjs/config";
import { captureMessage } from "@sentry/nestjs";

(async () => {
  const app = await bootstrapApplication();
  // Get port
  const configService = app.get(ConfigService);

  const port = configService.get("PORT");

  if (configService.get("ENV") !== "test") {
    // enableShutdownHooks consumes memory by starting listeners.
    // In cases where you are running multiple Nest apps in a single Node process
    // (e.g., when running parallel tests with Jest),
    // Node may complain about excessive listener processes.
    // For this reason, enableShutdownHooks is not enabled by default.
    // Be aware of this condition when you are running multiple instances in a single Node process.
    // see more https://docs.nestjs.com/fundamentals/lifecycle-events#application-shutdown

    // Starts listening for shutdown hooks
    app.enableShutdownHooks();
  }

  if (configService.get("ENV") === "prod") {
    captureMessage(`[INFO] [LOCATION-API] Restart - ${new Date()}`);
  }

  await app.listen(port, "0.0.0.0");
})();
