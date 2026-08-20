import { describe, expect, it } from 'vitest';
import { Themes } from '@soliguide/common';

import { THEME_BLUEPRINTS } from './blueprints';
import { buildThemeDefinition } from './buildThemeDefinition';
import { getCanonicalOrigin } from './getCanonicalOrigin';

const FALLBACK_ORIGIN = 'https://app-web-app.cleverapps.io';

describe('getCanonicalOrigin', () => {
  it('uses the first configured hostname', () => {
    const theme = buildThemeDefinition(THEME_BLUEPRINTS[Themes.SOLIGUIA_ES], {
      PUBLIC_SOLIGUIA_ES_HOSTNAMES: 'app.soliguia.es,es.app.demo.soliguide.dev'
    });

    expect(getCanonicalOrigin(theme, FALLBACK_ORIGIN)).toBe('https://app.soliguia.es');
  });

  it('keeps alias hostnames on the canonical origin, so the API resolves the country', () => {
    const theme = buildThemeDefinition(THEME_BLUEPRINTS[Themes.SOLIGUIA_ES], {
      PUBLIC_SOLIGUIA_ES_HOSTNAMES: 'app.soliguia.es,es.app.demo.soliguide.dev'
    });

    expect(getCanonicalOrigin(theme, 'https://es.app.demo.soliguide.dev')).toBe(
      'https://app.soliguia.es'
    );
  });

  it('falls back to the incoming origin when no hostname is configured', () => {
    const theme = buildThemeDefinition(THEME_BLUEPRINTS[Themes.SOLIGUIDE_FR], {});

    expect(getCanonicalOrigin(theme, FALLBACK_ORIGIN)).toBe(FALLBACK_ORIGIN);
  });
});
