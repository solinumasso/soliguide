import { NestFactory } from '@nestjs/core';

import { ArtifactGenerationService } from '../../api-versioning/artifacts';
import { SearchModule } from '../search.module';

async function run(): Promise<void> {
  const app = await NestFactory.createApplicationContext(SearchModule, {
    logger: false,
  });

  try {
    const artifactGenerationService = app.get(ArtifactGenerationService);
    await artifactGenerationService.generateArtifacts();
  } finally {
    await app.close();
  }
}

void run();
