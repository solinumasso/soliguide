import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import {
  NestFastifyApplication,
  FastifyAdapter,
} from "@nestjs/platform-fastify";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import helmet from "helmet";
import { Logger } from "nestjs-pino";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";
import { AppSentryGlobalFilter } from "./sentry";

export async function bootstrapApplication(): Promise<NestFastifyApplication> {
  try {
    const app = await NestFactory.create<NestFastifyApplication>(
      AppModule,
      new FastifyAdapter()
    );

    app.useLogger(app.get(Logger));

    const configService = app.get(ConfigService);

    const swaggerConfig = new DocumentBuilder()
      .setTitle("Soliguide Location API")
      .setDescription(
        "This API allows you to retrieve the addresses, cities, departments and regions of the countries where Soliguide is deployed."
      )
      .setVersion("1.0")
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup("doc", app, document);

    app.use(helmet());

    // const domains: string = configService.get("SOLIGUIDE_DOMAINS");
    // const corsOrigins = getCorsDomains(domains)

    app.enableCors({
      // origin: ["local", "test"].includes(configService.get("ENV"))
      //   ? true
      //   : corsOrigins, // https://github.com/fastify/fastify-cors
      methods: ["GET"],
    });

    if (!!configService.get("LOCATION_API_SENTRY_DSN")) {
      app.useGlobalFilters(new AppSentryGlobalFilter());
    }

    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidUnknownValues: true,
        forbidNonWhitelisted: true,
      })
    );

    return app;
  } catch (err) {
    // eslint:disable-next-line: no-console
    console.error("[bootstrapApplication] Error bootstraping application", err);
    throw err;
  }
}
