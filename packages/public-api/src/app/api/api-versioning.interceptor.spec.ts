import {
  BadRequestException,
  InternalServerErrorException,
  type CallHandler,
  type ExecutionContext,
} from '@nestjs/common';
import { of, lastValueFrom } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { VersioningEngine } from '../../api-versioning/runtime';
import { ApiVersioningInterceptor } from './api-versioning.interceptor';

type HttpRequest = {
  body: unknown;
  headers?: Record<string, string | readonly string[] | undefined>;
};

function createExecutionContext(request: HttpRequest): ExecutionContext {
  return {
    switchToHttp: () => ({
      getRequest: () => request,
    }),
  } as unknown as ExecutionContext;
}

describe('ApiVersioningInterceptor', () => {
  const mockVersioningEngine = {
    upgradeRequest: vi.fn(),
    downgradeResponse: vi.fn(),
  };

  let interceptor: ApiVersioningInterceptor;

  beforeEach(() => {
    mockVersioningEngine.upgradeRequest.mockReset();
    mockVersioningEngine.downgradeResponse.mockReset();

    interceptor = new ApiVersioningInterceptor(
      mockVersioningEngine as unknown as VersioningEngine,
    );
  });

  it('upgrades request payload before handler and downgrades handler response', async () => {
    const request: HttpRequest = {
      body: { legacyField: true },
      headers: { 'x-api-version': '2026-01-01' },
    };
    const canonicalRequest = { locationMode: 'country', country: 'FR' };
    const canonicalResponse = { results: [] };
    const downgradedResponse = { places: [] };
    const handle = vi.fn(() => of(canonicalResponse));
    const next: CallHandler = { handle };

    mockVersioningEngine.upgradeRequest.mockResolvedValue(canonicalRequest);
    mockVersioningEngine.downgradeResponse.mockResolvedValue(
      downgradedResponse,
    );

    const output$ = await interceptor.intercept(
      createExecutionContext(request),
      next,
    );
    const output = await lastValueFrom(output$);

    expect(mockVersioningEngine.upgradeRequest).toHaveBeenCalledWith(
      { legacyField: true },
      '2026-01-01',
    );
    expect(request.body).toEqual(canonicalRequest);
    expect(handle).toHaveBeenCalledTimes(1);
    expect(mockVersioningEngine.downgradeResponse).toHaveBeenCalledWith(
      canonicalResponse,
      '2026-01-01',
    );
    expect(output).toEqual(downgradedResponse);
  });

  it('uses undefined version when x-api-version header is missing', async () => {
    const request: HttpRequest = {
      body: { locationMode: 'country', country: 'FR' },
      headers: {},
    };
    const canonicalRequest = { locationMode: 'country', country: 'FR' };
    const canonicalResponse = { results: [] };
    const next: CallHandler = { handle: vi.fn(() => of(canonicalResponse)) };

    mockVersioningEngine.upgradeRequest.mockResolvedValue(canonicalRequest);
    mockVersioningEngine.downgradeResponse.mockResolvedValue(canonicalResponse);

    const output$ = await interceptor.intercept(
      createExecutionContext(request),
      next,
    );
    await lastValueFrom(output$);

    expect(mockVersioningEngine.upgradeRequest).toHaveBeenCalledWith(
      request.body,
      undefined,
    );
    expect(mockVersioningEngine.downgradeResponse).toHaveBeenCalledWith(
      canonicalResponse,
      undefined,
    );
  });

  it('uses first value when x-api-version header is an array', async () => {
    const request: HttpRequest = {
      body: { legacy: true },
      headers: {
        'x-api-version': ['2026-01-01', '2026-03-03'],
      },
    };
    const next: CallHandler = { handle: vi.fn(() => of({ results: [] })) };

    mockVersioningEngine.upgradeRequest.mockResolvedValue({ canonical: true });
    mockVersioningEngine.downgradeResponse.mockResolvedValue({ legacy: true });

    const output$ = await interceptor.intercept(
      createExecutionContext(request),
      next,
    );
    await lastValueFrom(output$);

    expect(mockVersioningEngine.upgradeRequest).toHaveBeenCalledWith(
      { legacy: true },
      '2026-01-01',
    );
    expect(mockVersioningEngine.downgradeResponse).toHaveBeenCalledWith(
      { results: [] },
      '2026-01-01',
    );
  });

  it('propagates bad request errors from request upgrade', async () => {
    const request: HttpRequest = {
      body: { legacy: true },
      headers: { 'x-api-version': '2026-99-99' },
    };
    const handle = vi.fn(() => of({ results: [] }));
    const next: CallHandler = { handle };
    const error = new BadRequestException('Unsupported API version');

    mockVersioningEngine.upgradeRequest.mockRejectedValue(error);

    await expect(
      interceptor.intercept(createExecutionContext(request), next),
    ).rejects.toBe(error);
    expect(handle).not.toHaveBeenCalled();
  });

  it('propagates internal server errors from response downgrade', async () => {
    const request: HttpRequest = {
      body: { locationMode: 'country', country: 'FR' },
      headers: { 'x-api-version': '2026-01-01' },
    };
    const next: CallHandler = { handle: vi.fn(() => of({ results: [] })) };
    const error = new InternalServerErrorException('Downgrade failed');

    mockVersioningEngine.upgradeRequest.mockResolvedValue(request.body);
    mockVersioningEngine.downgradeResponse.mockRejectedValue(error);

    const output$ = await interceptor.intercept(
      createExecutionContext(request),
      next,
    );

    await expect(lastValueFrom(output$)).rejects.toBe(error);
  });
});
