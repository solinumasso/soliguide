import { CallHandler, ExecutionContext } from '@nestjs/common';
import { lastValueFrom, of } from 'rxjs';
import { SearchResponse20260309DTO } from './search.2026-03-09.dto';
import { SearchVersioningInterceptor } from './search-versioning.interceptor';
import { SEARCH_RESPONSE_DOWNGRADE_CONFIG } from './search.versioning';
import { VersionMapperService } from './versioning/version-mapper.service';

describe('SearchVersioningInterceptor', () => {
  const canonicalResponse: SearchResponse20260309DTO = {
    _links: {
      self: { href: '/search?page=1&limit=100' },
      next: { href: '/search?page=1&limit=100' },
      prev: { href: '/search?page=1&limit=100' },
    },
    results: [],
    page: {
      current: 1,
      limit: 100,
      totalPages: 1,
      totalResults: 0,
    },
  };

  const createContext = (request: {
    header: (name: string) => string | undefined;
    query: Record<string, unknown>;
  }): ExecutionContext => {
    return {
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    } as unknown as ExecutionContext;
  };

  it('uses header version with higher priority than query parameter', async () => {
    const applyDowngradeChain = jest.fn().mockReturnValue({ downgraded: true });
    const versionMapperService = {
      applyDowngradeChain,
    } as unknown as VersionMapperService;
    const interceptor = new SearchVersioningInterceptor(versionMapperService);
    const context = createContext({
      header: (name) => (name === 'X-API-VERSION' ? 'v2026-03-03' : undefined),
      query: { apiVersion: '2026-03-09' },
    });
    const next: CallHandler<SearchResponse20260309DTO> = {
      handle: () => of(canonicalResponse),
    };

    await lastValueFrom(interceptor.intercept(context, next));

    expect(applyDowngradeChain).toHaveBeenCalledWith({
      ...SEARCH_RESPONSE_DOWNGRADE_CONFIG,
      targetVersion: '2026-03-03',
      payload: canonicalResponse,
    });
  });

  it('uses query version when header is missing', async () => {
    const applyDowngradeChain = jest.fn().mockReturnValue(canonicalResponse);
    const versionMapperService = {
      applyDowngradeChain,
    } as unknown as VersionMapperService;
    const interceptor = new SearchVersioningInterceptor(versionMapperService);
    const context = createContext({
      header: () => undefined,
      query: { apiVersion: 'v2026-03-03' },
    });
    const next: CallHandler<SearchResponse20260309DTO> = {
      handle: () => of(canonicalResponse),
    };

    await lastValueFrom(interceptor.intercept(context, next));

    expect(applyDowngradeChain).toHaveBeenCalledWith({
      ...SEARCH_RESPONSE_DOWNGRADE_CONFIG,
      targetVersion: '2026-03-03',
      payload: canonicalResponse,
    });
  });

  it('passes null targetVersion when no API version is provided', async () => {
    const applyDowngradeChain = jest.fn().mockReturnValue(canonicalResponse);
    const versionMapperService = {
      applyDowngradeChain,
    } as unknown as VersionMapperService;
    const interceptor = new SearchVersioningInterceptor(versionMapperService);
    const context = createContext({
      header: () => undefined,
      query: {},
    });
    const next: CallHandler<SearchResponse20260309DTO> = {
      handle: () => of(canonicalResponse),
    };

    await lastValueFrom(interceptor.intercept(context, next));

    expect(applyDowngradeChain).toHaveBeenCalledWith({
      ...SEARCH_RESPONSE_DOWNGRADE_CONFIG,
      targetVersion: null,
      payload: canonicalResponse,
    });
  });
});
