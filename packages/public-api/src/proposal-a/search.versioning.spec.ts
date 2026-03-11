import {
  SEARCH_RESPONSE_DOWNGRADE_CONFIG,
  SearchResponseDowngradeMappersStartupValidator,
} from './search.versioning';
import { VersionMapperService } from './versioning/version-mapper.service';

describe('SearchResponseDowngradeMappersStartupValidator', () => {
  it('validates the full search response downgrade chain at startup', () => {
    const validateDowngradeChain = jest.fn();
    const versionMapperService = {
      validateDowngradeChain,
    } as unknown as VersionMapperService;

    const validator = new SearchResponseDowngradeMappersStartupValidator(
      versionMapperService,
    );

    validator.onModuleInit();

    expect(validateDowngradeChain).toHaveBeenCalledWith(
      SEARCH_RESPONSE_DOWNGRADE_CONFIG,
    );
  });
});
