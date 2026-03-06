import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'nestjs-pino';
import { captureMessage } from '@sentry/nestjs';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  app.useLogger(app.get(Logger));

  const config = new DocumentBuilder()
    .setTitle('Soligare API')
    .setDescription(
      'Search and match potential duplicates from automatic imports',
    )
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('doc', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidUnknownValues: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.enableShutdownHooks();

  const configService = app.get(ConfigService);

  const port = configService.get('PORT');

  if (configService.get('ENV') === 'prod') {
    captureMessage(`[INFO] [SOLIGARE] Restart - ${new Date()}`);
  }

  await app.listen(port, '0.0.0.0');
}
bootstrap();
