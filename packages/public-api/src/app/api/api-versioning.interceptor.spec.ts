import { describe, expect, it, vi } from 'vitest';
import { of, lastValueFrom } from 'rxjs';
import { ApiVersioningInterceptor } from './api-versioning.interceptor';
import type { VersioningEngine } from '../../api-versioning/runtime';

function buildExecutionContext(request: {
  body: unknown;
  headers: Record<string, string>;
}) {
  return {
    switchToHttp: () => ({
      getRequest: () => request,
    }),
  } as never;
}

describe('ApiVersioningInterceptor', () => {
  it('downgrades legacy version responses', async () => {
    const request = { body: {}, headers: { 'x-api-version': '2026-01-01' } };

    const versioningEngine: Pick<
      VersioningEngine,
      'upgradeRequest' | 'downgradeResponse'
    > = {
      upgradeRequest: vi.fn(
        (payload: unknown): Promise<unknown> => Promise.resolve(payload),
      ),
      downgradeResponse: vi.fn(
        (payload: unknown): Promise<unknown> => Promise.resolve(payload),
      ),
    };

    const interceptor = new ApiVersioningInterceptor(
      versioningEngine as VersioningEngine,
    );

    const result = await lastValueFrom(
      await interceptor.intercept(buildExecutionContext(request), {
        handle: () =>
          of({
            places: [{ id: '1' }, { id: '2' }, { id: '2' }],
          }),
      } as never),
    );

    expect(result).toEqual({
      places: [{ id: '1' }, { id: '2' }, { id: '2' }],
    });

    expect(versioningEngine.downgradeResponse).toHaveBeenCalledTimes(1);
  });

  it('returns payload for canonical version', async () => {
    const request = { body: {}, headers: { 'x-api-version': '2026-03-03' } };

    const versioningEngine: Pick<
      VersioningEngine,
      'upgradeRequest' | 'downgradeResponse'
    > = {
      upgradeRequest: vi.fn(
        (payload: unknown): Promise<unknown> => Promise.resolve(payload),
      ),
      downgradeResponse: vi.fn(
        (payload: unknown): Promise<unknown> => Promise.resolve(payload),
      ),
    };

    const interceptor = new ApiVersioningInterceptor(
      versioningEngine as VersioningEngine,
    );

    await lastValueFrom(
      await interceptor.intercept(buildExecutionContext(request), {
        handle: () => of({ places: [{ id: '1' }] }),
      } as never),
    );

    expect(versioningEngine.downgradeResponse).toHaveBeenCalledTimes(1);
  });
});
