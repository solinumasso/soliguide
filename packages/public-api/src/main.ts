import { NestFactory } from "@nestjs/core";
import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";
import helmet from "helmet";
import { PlaceModel } from "@soliguide/api";
import { AppModule } from "./app.module";

import { config } from "dotenv";
import { setupOpenApi } from "./openapi";
import { buildPublicApiCorsOptions } from "./public-api-cors";

config();

(async () => {
  const mongodbUri = process.env.MONGODB_URI;
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new Error("JWT_SECRET is required");
  }

  if (mongodbUri) {
    await PlaceModel.base.connect(mongodbUri, {
      maxIdleTimeMS: 50_000,
      serverSelectionTimeoutMS: 5_000,
    });
  } else {
    throw new Error("MONGODB_URI is required");
  }

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter()
  );

  app.enableCors(buildPublicApiCorsOptions());

  await setupOpenApi(app);

  app.use(helmet());
  app.enableShutdownHooks();

  await app.listen(process.env.PORT ?? 3002, "0.0.0.0");
})();
