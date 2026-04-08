import { NestFactory } from '@nestjs/core';
import { SearchModule } from '../../../app/search.module';
import { ArtifactGenerationService } from '../../../api-versioning/artifacts';

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
