import { NestFactory } from '@nestjs/core';
import { SearchModule } from './search.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';

async function bootstrap() {
  const app = await NestFactory.create(SearchModule);

  const config = new DocumentBuilder()
    .setTitle('Soliguide Search')
    .setDescription('The search API for Soliguide')
    .setVersion('2026-03-04')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('swagger', app, document, {
    jsonDocumentUrl: 'swagger/json',
  });

  app.use('/api/docs', apiReference({ content: document }));

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
