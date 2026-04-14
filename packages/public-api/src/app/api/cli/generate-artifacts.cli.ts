import { NestFactory } from '@nestjs/core';
import { ArtifactGenerationService } from '../../../api-versioning/artifacts';
import { SearchModule } from '../../search.module';
import { config } from 'dotenv';

config();

async function run(): Promise<void> {
  process.env.PUBLIC_API_GENERATE_ARTIFACTS = '1';

  const app = await NestFactory.createApplicationContext(SearchModule, {
    logger: false,
    abortOnError: false,
  });

  try {
    const artifactGenerationService = app.get(ArtifactGenerationService);
    await artifactGenerationService.generateArtifacts();
  } finally {
    await app.close();
  }
}

void run().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
