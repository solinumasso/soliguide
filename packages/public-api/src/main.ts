import { NestFactory } from "@nestjs/core";
import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import helmet from "helmet";
import { PlaceModel } from "@soliguide/api";
import { AppModule } from "./app.module";

import { config } from "dotenv";

config();

(async () => {
  const mongodbUri = process.env.MONGODB_URI;
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new Error("JWT_SECRET is required");
  }

  if (mongodbUri) {
    await PlaceModel.db.base.connect(mongodbUri, {
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

  const swaggerConfig = new DocumentBuilder()
    .setTitle("Soliguide Public API")
    .setDescription(
      "This API exposes public Soliguide data for search and integrations."
    )
    .setVersion("1.0")
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup("doc", app, document);

  app.use(helmet());
  app.enableShutdownHooks();

  await app.listen(process.env.PORT ?? 3002, "0.0.0.0");
})();
