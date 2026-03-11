import 'reflect-metadata';
import { Provider } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { afterEach, describe, expect, it } from 'vitest';
import { buildResourceVersionToken } from './version-mapper.tokens';
import { VersionMapperService } from './version-mapper.service';
import {
  DowngradeMapper,
  UpgradeMapper,
  VersioningResourceConfig,
} from './version-mapper.types';

describe('VersionMapperService', () => {
  const config: VersioningResourceConfig = {
    resource: 'search_response',
    versions: ['1', '2', '3'],
    canonicalVersion: '3',
  };

  const modules: TestingModule[] = [];

  const buildService = async (providers: Provider[]) => {
    const module = await Test.createTestingModule({
      providers: [VersionMapperService, ...providers],
    }).compile();

    modules.push(module);

    return module.get(VersionMapperService);
  };

  afterEach(async () => {
    await Promise.all(modules.splice(0).map((module) => module.close()));
  });

  it('applies downgrade mappers step by step until target version', async () => {
    const service = await buildService([
      {
        provide: buildResourceVersionToken(config.resource, '3'),
        useValue: {
          downgrade: (payload: { version: string; history: string[] }) => ({
            version: '2',
            history: [...payload.history, '3->2'],
          }),
        } satisfies DowngradeMapper,
      },
      {
        provide: buildResourceVersionToken(config.resource, '2'),
        useValue: {
          downgrade: (payload: { version: string; history: string[] }) => ({
            version: '1',
            history: [...payload.history, '2->1'],
          }),
        } satisfies DowngradeMapper,
      },
    ]);

    const result = service.applyDowngradeChain({
      ...config,
      targetVersion: 'v1',
      payload: { version: '3', history: [] },
    });

    expect(result).toEqual({ version: '1', history: ['3->2', '2->1'] });
  });

  it('applies upgrade mappers step by step until canonical version', async () => {
    const service = await buildService([
      {
        provide: buildResourceVersionToken(config.resource, '1'),
        useValue: {
          upgrade: (payload: { version: string; history: string[] }) => ({
            version: '2',
            history: [...payload.history, '1->2'],
          }),
        } satisfies UpgradeMapper,
      },
      {
        provide: buildResourceVersionToken(config.resource, '2'),
        useValue: {
          upgrade: (payload: { version: string; history: string[] }) => ({
            version: '3',
            history: [...payload.history, '2->3'],
          }),
        } satisfies UpgradeMapper,
      },
    ]);

    const result = service.applyUpgradeChain({
      ...config,
      sourceVersion: 'v1',
      payload: { version: '1', history: [] },
    });

    expect(result).toEqual({ version: '3', history: ['1->2', '2->3'] });
  });

  it('validates downgrade chain and throws if a step is missing', async () => {
    const service = await buildService([
      {
        provide: buildResourceVersionToken(config.resource, '3'),
        useValue: {
          downgrade: (payload: unknown) => payload,
        } satisfies DowngradeMapper,
      },
    ]);

    expect(() => service.validateDowngradeChain(config)).toThrow(
      'Missing mapper "search_response_2"',
    );
  });

  it('validates upgrade chain and throws if a step is missing', async () => {
    const service = await buildService([
      {
        provide: buildResourceVersionToken(config.resource, '1'),
        useValue: {
          upgrade: (payload: unknown) => payload,
        } satisfies UpgradeMapper,
      },
    ]);

    expect(() => service.validateUpgradeChain(config)).toThrow(
      'Missing mapper "search_response_2"',
    );
  });
});
