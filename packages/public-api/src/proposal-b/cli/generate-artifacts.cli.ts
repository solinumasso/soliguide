import { NestFactory } from '@nestjs/core';
import { SearchModule } from '../app/search.module';
import { VersioningEngine } from '../runtime/versioning.engine';

async function run(): Promise<void> {
  const app = await NestFactory.createApplicationContext(SearchModule, {
    logger: false,
  });

  try {
    const engine = app.get(VersioningEngine);
    await engine.generateArtifacts();
  } finally {
    await app.close();
  }
}

void run();
