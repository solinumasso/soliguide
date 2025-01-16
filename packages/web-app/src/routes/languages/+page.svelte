<!--
Soliguide: Useful information for those who need it

SPDX-FileCopyrightText: © 2024 Solinum

SPDX-License-Identifier: AGPL-3.0-only

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published
by the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
-->
<script lang="ts">
  import { getContext, setContext } from 'svelte';
  import { goto } from '$app/navigation';
  import { Button, Text } from '@soliguide/design-system';
  import { I18N_CTX_KEY } from '$lib/client/i18n';
  import { themeStore } from '$lib/theme/index';
  import { markLanguageAsSelected, ROUTES_CTX_KEY } from '$lib/client';
  import { getController } from './pageController';
  import LanguageSelector from './LanguageSelector.svelte';
  import type { I18nStore, RoutingStore } from '$lib/client/types';
  import type { ThemeDefinition } from '$lib/theme/types';
  import { page } from '$app/stores';
  import { get } from 'svelte/store';

  const pageStore = getController();

  const i18n: I18nStore = getContext(I18N_CTX_KEY);
  const theme: ThemeDefinition = get(themeStore.getTheme());
  const routes: RoutingStore = getContext(ROUTES_CTX_KEY);

  setContext('CAPTURE_FCTN_CTX_KEY', pageStore.captureEvent);

  pageStore.init(theme.supportedLanguages, theme.defaultLanguage);

  const selectLanguage = (): void => {
    pageStore.captureEvent('validate-language', { newLanguage: $pageStore.selectedLanguage });
    if ($pageStore.canSubmit) {
      $i18n.changeLanguage(String($pageStore.selectedLanguage));
      markLanguageAsSelected();

      const fromPage = $page.url.searchParams.get('from');
      goto(fromPage === 'more-options' ? $routes.ROUTE_MORE_OPTIONS : $routes.ROUTE_HOME);
    }
  };
</script>

<svelte:head>
  <title>{$i18n.t('MENU_SELECT_LANGUAGE')}</title>
</svelte:head>

<section class="page-body">
  <img src="/images/select_language.svg" alt="" />
  <Text type="title2PrimaryExtraBold" as="h1">
    {$i18n.t('MENU_SELECT_LANGUAGE')}
  </Text>
  <div class="subtitle">
    <Text type="text2">{$i18n.t('AVAILABLE_IN_LANGUAGES')}</Text>
  </div>
  <LanguageSelector
    options={$pageStore.availableLanguages}
    selectedOption={$pageStore.selectedLanguage}
    on:change={(value) => pageStore.changeSelection(value.detail)}
  />
</section>

<section class="page-footer">
  <Button block size="large" on:click={selectLanguage} disabled={!$pageStore.canSubmit}>
    {$i18n.t('VALIDATE')}
  </Button>
</section>

<style lang="scss">
  $footer-height: 132px;

  .page-body {
    min-height: 100vh;
    padding: var(--spacingXL) var(--spacingLG) calc($footer-height + var(--spacingXL));
    background: var(--color-gradientBackground);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--spacingXS);

    .subtitle {
      margin-bottom: var(--spacing2XL);
    }
    img {
      width: 220px;
      max-width: 300px;
    }
  }
  .page-footer {
    height: $footer-height;
    padding: var(--spacingXL) var(--spacingLG) var(--spacing4XL);
    background: var(--color-gradientBackground);
    overflow: hidden;
    position: fixed;
    bottom: 0;
    width: 100vw;
  }
</style>
