import { NestFactory } from "@nestjs/core";
import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import helmet from "helmet";
import { AppModule } from "./app.module";

(async () => {
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

  await app.listen(process.env.PORT ?? 3002, "0.0.0.0");
})();
