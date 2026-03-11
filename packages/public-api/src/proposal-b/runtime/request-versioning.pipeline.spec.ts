/* eslint-disable @typescript-eslint/require-await */
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { DslCompiler } from '../versioning/dsl-compiler';
import { requestSchemasByVersion } from '../generated/contracts';
import { RequestVersioningPipeline } from './request-versioning.pipeline';
import { searchVersioningDefinition } from '../app/search';
import { VersionRegistry } from '../versioning/version-registry';
import { VersionResolver } from '../versioning/version-resolver';

describe('ProposalC RequestVersioningPipeline', () => {
  let pipeline: RequestVersioningPipeline;

  beforeEach(() => {
    const registry = new VersionRegistry(
      searchVersioningDefinition,
      new DslCompiler(),
    );
    const resolver = new VersionResolver();

    pipeline = new RequestVersioningPipeline(
      registry,
      resolver,
      requestSchemasByVersion,
    );
  });

  it('uses canonical schema when version header is missing', async () => {
    await expect(
      pipeline.upgradeRequest({ isOpenToday: 'true', page: '2' }, undefined),
    ).resolves.toEqual({
      isOpenToday: true,
      page: 2,
    });
  });

  it('rejects unsupported versions with 400', async () => {
    await expect(
      pipeline.upgradeRequest({}, '2026-03-10'),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('rejects invalid payload for source schema with 400', async () => {
    await expect(
      pipeline.upgradeRequest({ limit: 0 }, '2026-03-03'),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('applies upgrade chain from client version and supports deps injection', async () => {
    const normalizeOpenToday = jest.fn().mockResolvedValue(false);

    await expect(
      pipeline.upgradeRequest(
        { openToday: 'any-value', page: '3' },
        '2026-03-03',
        {
          deps: {
            normalizeOpenToday,
          },
        },
      ),
    ).resolves.toEqual({
      isOpenToday: false,
      page: 3,
    });

    expect(normalizeOpenToday).toHaveBeenCalledWith(true);
  });

  it('returns 500 when an upgrade transform throws', async () => {
    await expect(
      pipeline.upgradeRequest({ openToday: true }, '2026-03-03', {
        deps: {
          normalizeOpenToday: async () => {
            throw new Error('lookup failed');
          },
        },
      }),
    ).rejects.toBeInstanceOf(InternalServerErrorException);
  });

  it('returns 500 when generated request schema is missing for a supported version', async () => {
    const registry = new VersionRegistry(
      searchVersioningDefinition,
      new DslCompiler(),
    );
    const resolver = new VersionResolver();
    const missingCanonicalSchema = new Map(requestSchemasByVersion);
    missingCanonicalSchema.delete('2026-03-09');

    const pipelineWithMissingSchema = new RequestVersioningPipeline(
      registry,
      resolver,
      missingCanonicalSchema,
    );

    await expect(
      pipelineWithMissingSchema.upgradeRequest(
        { isOpenToday: true },
        '2026-03-09',
      ),
    ).rejects.toBeInstanceOf(InternalServerErrorException);
  });
});
