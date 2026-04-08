import { Inject, Injectable } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { z } from 'zod';
import { describe, expect, it, vi } from 'vitest';
import { DslCompiler } from '../versioning/dsl/dsl-compiler';
import { RequestVersioningPipeline } from './request-versioning.pipeline';
import { ResponseVersioningPipeline } from './response-versioning.pipeline';
import {
  buildSchemaCaches,
  catalogCanonicalResponse,
  catalogVersioningDefinition,
  expectedLegacyResponse,
} from '../testing';
import { VersioningEngine } from './versioning.engine';
import { RenameFieldChange } from '../versioning/changes';
import { VersionRegistry } from '../versioning/version-registry';
import { VersionResolver } from '../versioning/version-resolver';
import type {
  ValidationSchemaCache,
  Version,
  VersioningDefinition,
} from '../versioning/versioning.types';

describe('ProposalC VersioningEngine', () => {
  const { requestSchemasByVersion } = buildSchemaCaches(
    catalogVersioningDefinition,
  );

  const buildEngine = (): VersioningEngine =>
    buildEngineFromDefinition(catalogVersioningDefinition, {
      requestSchemasByVersion,
    });

  it('upgrades request payloads to canonical form', async () => {
    const engine = buildEngine();

    await expect(
      engine.upgradeRequest({ openToday: true }, '2026-03-03'),
    ).resolves.toEqual({ isOpenToday: true });
  });

  it('downgrades response payloads to the requested client version', async () => {
    const engine = buildEngine();

    await expect(
      engine.downgradeResponse(catalogCanonicalResponse, '2026-03-03'),
    ).resolves.toEqual(expectedLegacyResponse);
  });

  describe('mixed version changes (DI + non-DI)', () => {
    it('applies mixed request upgrade and response downgrade chains in sequence', async () => {
      const upgrade = vi.fn((value: unknown) => `svc:${String(value)}`);
      const downgrade = vi.fn((value: unknown) =>
        String(value).replace(/^svc:/, ''),
      );

      const moduleRef = await Test.createTestingModule({
        providers: [
          {
            provide: CAT_TEXT_SERVICE,
            useValue: {
              upgrade,
              downgrade,
            } satisfies CatTextService,
          },
          {
            provide: RenameCatMoodRequestChange,
            useFactory: (service: CatTextService) =>
              new RenameCatMoodRequestChange(service),
            inject: [CAT_TEXT_SERVICE],
          },
          {
            provide: RenameCatMoodResponseChange,
            useFactory: (service: CatTextService) =>
              new RenameCatMoodResponseChange(service),
            inject: [CAT_TEXT_SERVICE],
          },
          {
            provide: MixedBookCatVersionProvider,
            useFactory: (
              requestDiChange: RenameCatMoodRequestChange,
              responseDiChange: RenameCatMoodResponseChange,
            ) =>
              new MixedBookCatVersionProvider(
                requestDiChange,
                responseDiChange,
              ),
            inject: [RenameCatMoodRequestChange, RenameCatMoodResponseChange],
          },
        ],
      }).compile();

      const provider = moduleRef.get(MixedBookCatVersionProvider);
      const definition = buildMixedDefinition(provider.toVersion());
      const engine = buildEngineFromDefinition(definition);

      await expect(
        engine.upgradeRequest(
          { bookName: 'dune', catMood: 'curious' },
          '2026-03-03',
        ),
      ).resolves.toEqual({
        bookTitle: 'DUNE',
        catEmotion: 'svc:curious',
      });

      await expect(
        engine.downgradeResponse(
          {
            bookTitle: 'DUNE',
            catEmotion: 'svc:curious',
          },
          '2026-03-03',
        ),
      ).resolves.toEqual({
        bookName: 'dune',
        catMood: 'curious',
      });

      expect(upgrade).toHaveBeenCalledWith('curious');
      expect(downgrade).toHaveBeenCalledWith('svc:curious');
    });
  });
});

function buildMixedDefinition(version20260309: Version): VersioningDefinition {
  return {
    resource: 'book-cat',
    baseRequestSchema: z
      .object({
        bookName: z.string().optional(),
        catMood: z.string().optional(),
      })
      .strict(),
    baseResponseSchema: z
      .object({
        bookName: z.string(),
        catMood: z.string(),
      })
      .strict(),
    versions: [
      {
        version: '2026-03-03',
        description: 'Initial',
        requestChanges: [],
        responseChanges: [],
      },
      version20260309,
    ],
  };
}

function buildEngineFromDefinition(
  definition: VersioningDefinition,
  options?: {
    requestSchemasByVersion?: ValidationSchemaCache;
  },
): VersioningEngine {
  const registry = new VersionRegistry(definition, new DslCompiler());
  const resolver = new VersionResolver();
  const resolvedRequestSchemas =
    options?.requestSchemasByVersion ??
    buildSchemaCaches(definition).requestSchemasByVersion;

  const requestPipeline = new RequestVersioningPipeline(
    registry,
    resolver,
    resolvedRequestSchemas,
  );
  const responsePipeline = new ResponseVersioningPipeline(registry, resolver);

  return new VersioningEngine(requestPipeline, responsePipeline);
}

interface CatTextService {
  upgrade(value: unknown): unknown;
  downgrade(value: unknown): unknown;
}

const CAT_TEXT_SERVICE = Symbol('CAT_TEXT_SERVICE');

class RenameBookNameRequestChange extends RenameFieldChange {
  override description = 'rename request bookName to bookTitle';
  override from = 'bookName';
  override to = 'bookTitle';
  override schema = z.string();

  override upgrade(value: unknown, _container: Record<string, unknown>) {
    return String(value).toUpperCase();
  }
}

@Injectable()
class RenameCatMoodRequestChange extends RenameFieldChange {
  override description = 'rename request catMood to catEmotion';
  override from = 'catMood';
  override to = 'catEmotion';
  override schema = z.string();

  constructor(
    @Inject(CAT_TEXT_SERVICE)
    private readonly catTextService: CatTextService,
  ) {
    super();
  }

  override upgrade(value: unknown, _container: Record<string, unknown>) {
    return this.catTextService.upgrade(value);
  }
}

class RenameBookTitleResponseChange extends RenameFieldChange {
  override description = 'rename response bookName to bookTitle';
  override from = 'bookName';
  override to = 'bookTitle';
  override schema = z.string();

  override downgrade(value: unknown, _container: Record<string, unknown>) {
    return String(value).toLowerCase();
  }
}

@Injectable()
class RenameCatMoodResponseChange extends RenameFieldChange {
  override description = 'rename response catMood to catEmotion';
  override from = 'catMood';
  override to = 'catEmotion';
  override schema = z.string();

  constructor(
    @Inject(CAT_TEXT_SERVICE)
    private readonly catTextService: CatTextService,
  ) {
    super();
  }

  override downgrade(value: unknown, _container: Record<string, unknown>) {
    return this.catTextService.downgrade(value);
  }
}

@Injectable()
class MixedBookCatVersionProvider {
  constructor(
    private readonly requestDiChange: RenameCatMoodRequestChange,
    private readonly responseDiChange: RenameCatMoodResponseChange,
  ) {}

  toVersion(): Version {
    return {
      version: '2026-03-09',
      description: 'Mixed DI and non-DI field changes',
      requestChanges: [new RenameBookNameRequestChange(), this.requestDiChange],
      responseChanges: [
        new RenameBookTitleResponseChange(),
        this.responseDiChange,
      ],
    };
  }
}
