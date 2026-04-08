import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { searchVersioningDefinition } from './api/schema/search.versioning';
import { VERSIONING_DEFINITION } from '../api-versioning/runtime/versioning.tokens';
import { SearchModule } from './search.module';
import { afterEach, describe, expect, it } from 'vitest';

const generatedContractsOverride = {
  requestSchemasByVersion: new Map(
    searchVersioningDefinition.versions.map(({ version }) => [version, {}]),
  ),
  responseSchemasByVersion: new Map(
    searchVersioningDefinition.versions.map(({ version }) => [version, {}]),
  ),
};

describe('SearchModule', () => {
  let app: INestApplication | undefined;

  afterEach(() => {
    delete (
      globalThis as {
        __PUBLIC_API_GENERATED_CONTRACTS__?: unknown;
      }
    ).__PUBLIC_API_GENERATED_CONTRACTS__;
  });

  afterEach(async () => {
    if (app) {
      await app.close();
      app = undefined;
    }
  });

  it.skip(
    'boots when generated artifact schemas cover all supported versions',
    async () => {
      const moduleRef = await Test.createTestingModule({
        imports: [SearchModule],
      }).compile();
      expect(moduleRef).toBeDefined();
    },
  );

  it('fails to boot when generated artifact schemas miss a supported version', async () => {
    (
      globalThis as {
        __PUBLIC_API_GENERATED_CONTRACTS__?: unknown;
      }
    ).__PUBLIC_API_GENERATED_CONTRACTS__ = generatedContractsOverride;

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
              version: '2026-04-01',
              description: 'Added for invariant check',
              requestChanges: [],
              responseChanges: [],
            },
          ],
        })
        .compile(),
    ).rejects.toThrow(
      'Generated request schemas are missing for API version(s): 2026-04-01',
    );
  });
});
