import { NestFactory } from "@nestjs/core";
import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from "@nestjs/swagger";

import { AppModule } from "../../app.module";

export async function buildProductionBaseOpenApiDocument(): Promise<OpenAPIObject> {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    { logger: false }
  );

  try {
    const swaggerConfig = new DocumentBuilder()
      .setTitle("Soliguide Public API")
      .setDescription(
        "This API exposes public Soliguide data for search and integrations."
      )
      .setVersion("1.0")
      .build();

    return SwaggerModule.createDocument(app, swaggerConfig);
  } finally {
    await app.close();
  }
}
