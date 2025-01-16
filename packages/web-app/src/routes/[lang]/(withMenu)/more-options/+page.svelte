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
  import { getContext } from 'svelte';
  import ScreenSearchDesktop from 'svelte-google-materialdesign-icons/Screen_search_desktop.svelte';
  import Transcribe from 'svelte-google-materialdesign-icons/Transcribe.svelte';
  import Cookie from 'svelte-google-materialdesign-icons/Cookie.svelte';
  import Https from 'svelte-google-materialdesign-icons/Https.svelte';
  import Gavel from 'svelte-google-materialdesign-icons/Gavel.svelte';
  import Security from 'svelte-google-materialdesign-icons/Security.svelte';
  import Mouse from 'svelte-google-materialdesign-icons/Mouse.svelte';
  import MenuBook from 'svelte-google-materialdesign-icons/Menu_book.svelte';
  import { CookieModal } from '$lib/components';
  import ColoredCard from './ColoredCard.svelte';
  import { Text, BasicCard, ListItem } from '@soliguide/design-system';
  import { getPageController } from './pageController';
  import { I18N_CTX_KEY } from '$lib/client/i18n';
  import { ROUTES_CTX_KEY } from '$lib/client/index';
  import type { I18nStore, RoutingStore } from '$lib/client/types';
  import type { ThemeDefinition } from '$lib/theme/types';
  import { goto } from '$app/navigation';
  import { themeStore } from '$lib/theme';
  import { get } from 'svelte/store';

  const i18n: I18nStore = getContext(I18N_CTX_KEY);
  const theme: ThemeDefinition = get(themeStore.getTheme());
  const routes: RoutingStore = getContext(ROUTES_CTX_KEY);

  const links = {
    fichesPratiquesLink: theme.links.fichesPratiques,
    solinumSiteLink: theme.links.solinumSite,
    becomeTranslatorLink: theme.links.becomeTranslator,
    cookiePolicyLink: theme.links.cookiePolicy,
    privacyPolicyLink: theme.links.privacyPolicy,
    dataProtectionAgreementLink: theme.links.dataProtectionAgreement,
    legalNoticeLink: theme.links.legalNotice,
    termsAndConditionsLink: theme.links.termsAndConditions
  };

  const pageState = getPageController();
  pageState.init(links);

  const openCookieDialog = () => {
    console.log('Open cookie dialog');
    pageState.openCookieModal();
  };

  const navigateToExternal = (url: string) => {
    window.open(url, '_blank');
  };

  const changeLanguage = () => {
    pageState.captureEvent('click-change-language');
    goto(`${$routes.ROUTE_LANGUAGES}?from=more-options`);
  };
</script>

<svelte:head>
  <title>{$i18n.t('SOLIGUIDE_MORE_OPTIONS', { brandName: theme.brandName })}</title>
</svelte:head>

<section>
  <div class="title">
    <Text type="title2PrimaryExtraBold">{$i18n.t('MORE_OPTIONS_TITLE')}</Text>
  </div>

  <ColoredCard
    cardType="primary"
    title={$i18n.t('FICHES_PRATIQUES')}
    description={$i18n.t('FICHES_PRATIQUES_DESCRIPTION')}
    actionName={$i18n.t('PLUS_INFOS')}
    imgUrl="/images/paper.svg"
    on:action={() => {
      pageState.captureEvent('click-access-practical-files');
      navigateToExternal($pageState.fichesPratiquesLink);
    }}
  />

  <BasicCard>
    <Text type="text2Bold">{$i18n.t('SETTINGS')}</Text>
    <div class="group">
      <ListItem
        type="actionFull"
        shape="bordered"
        size="small"
        title={$i18n.t('CHANGE_LANGUAGE')}
        on:click={changeLanguage}
      >
        <Transcribe variation="filled" slot="icon" size="16" />
      </ListItem>
      {#if theme.chatWebsiteId}
        <ListItem
          type="actionFull"
          shape="bordered"
          size="small"
          title={$i18n.t('MANAGE_COOKIES')}
          on:click={() => {
            pageState.captureEvent('click-manage-cookies');
            openCookieDialog();
          }}
        >
          <Cookie variation="filled" slot="icon" size="16" />
        </ListItem>
      {/if}
      <ListItem
        type="externalLink"
        shape="bordered"
        size="small"
        title={$i18n.t('COOKIE_POLICY')}
        href={$pageState.cookiePolicyLink}
        on:click={() => pageState.captureEvent('click-cookie-policy')}
      >
        <MenuBook variation="filled" slot="icon" size="16" />
      </ListItem>
      <ListItem
        type="externalLink"
        shape="bordered"
        size="small"
        title={$i18n.t('PRIVACY_POLICY')}
        href={$pageState.privacyPolicyLink}
        on:click={() => pageState.captureEvent('click-privacy-policy')}
      >
        <Https variation="filled" slot="icon" size="16" />
      </ListItem>
      <ListItem
        type="externalLink"
        shape="bordered"
        size="small"
        title={$i18n.t('DATA_PROTECTION_AGREEMENT')}
        href={$pageState.dataProtectionAgreementLink}
        on:click={() => pageState.captureEvent('click-data-protection-agreement')}
      >
        <Gavel variation="filled" slot="icon" size="16" />
      </ListItem>
      <ListItem
        type="externalLink"
        shape="bordered"
        size="small"
        title={$i18n.t('LEGAL_NOTICE')}
        href={$pageState.legalNoticeLink}
        on:click={() => pageState.captureEvent('click-legal-notice')}
      >
        <Security variation="filled" slot="icon" size="16" />
      </ListItem>
      <ListItem
        type="externalLink"
        size="small"
        title={$i18n.t('GCU')}
        href={$pageState.termsAndConditionsLink}
        on:click={() => pageState.captureEvent('click-terms-and-conditions')}
      >
        <Mouse variation="filled" slot="icon" size="16" />
      </ListItem>
    </div>
  </BasicCard>
  <BasicCard>
    <Text type="text2Bold">{theme.brandName}</Text>
    <div class="group">
      <ListItem
        type="externalLink"
        shape="bordered"
        size="small"
        title={$i18n.t('SEE_SOLINUM_SITE')}
        href={$pageState.solinumSiteLink}
        on:click={() => pageState.captureEvent('click-access-solinum')}
      >
        <ScreenSearchDesktop variation="filled" slot="icon" size="16" />
      </ListItem>
      <ListItem
        type="externalLink"
        size="small"
        title={$i18n.t('BECOME_TRANSLATOR')}
        href={$pageState.becomeTranslatorLink}
        on:click={() => pageState.captureEvent('click-become-translator')}
      >
        <Transcribe variation="filled" slot="icon" size="16" />
      </ListItem>
    </div>
  </BasicCard>
</section>

{#if $pageState.cookieModalOpen}
  <CookieModal
    cookiePolicyLink={$pageState.cookiePolicyLink}
    zendeskChatbotLink={$routes.ROUTE_TALK}
    on:close={pageState.closeCookieModal}
  />
{/if}

<style lang="scss">
  section {
    display: flex;
    flex-direction: column;
    padding: var(--spacingXL);
    gap: var(--spacingXL);
  }

  .group {
    margin-bottom: -8px;
  }
</style>
