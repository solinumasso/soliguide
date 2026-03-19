import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { searchVersioningDefinition } from './schema/search.versioning';
import { VERSIONING_DEFINITION } from '../api-versioning/runtime/versioning.tokens';
import { SearchModule } from './search.module';

describe('SearchModule', () => {
  let app: INestApplication | undefined;

  afterEach(async () => {
    if (app) {
      await app.close();
      app = undefined;
    }
  });

  it('boots when generated artifact schemas cover all supported versions', async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [SearchModule],
    }).compile();

    app = moduleRef.createNestApplication();

    await expect(app.init()).resolves.toBe(app);
  });

  it('fails to boot when generated artifact schemas miss a supported version', async () => {
    await expect(
      Test.createTestingModule({
        imports: [SearchModule],
      })
        .overrideProvider(VERSIONING_DEFINITION)
        .useValue({
          ...searchVersioningDefinition,
          versions: [
            ...searchVersioningDefinition.versions,
            {
              version: '2026-03-12',
              description: 'Added for invariant check',
              requestChanges: [],
              responseChanges: [],
            },
          ],
        })
        .compile(),
    ).rejects.toThrow(
      'Generated request schemas are missing for API version(s): 2026-03-12',
    );
  });
});
