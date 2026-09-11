<script lang="ts">
  import {
    buildCountryVersions,
    buildCountryVersionUrl,
    getAllThemes,
    getLegalLinksContext,
    getThemeContext,
    type CountryVersion
  } from '$lib/theme';
  import { getContext, onMount } from 'svelte';
  import ScreenSearchDesktop from 'svelte-google-materialdesign-icons/Screen_search_desktop.svelte';
  import Transcribe from 'svelte-google-materialdesign-icons/Transcribe.svelte';
  import Cookie from 'svelte-google-materialdesign-icons/Cookie.svelte';
  import Https from 'svelte-google-materialdesign-icons/Https.svelte';
  import Gavel from 'svelte-google-materialdesign-icons/Gavel.svelte';
  import Security from 'svelte-google-materialdesign-icons/Security.svelte';
  import Mouse from 'svelte-google-materialdesign-icons/Mouse.svelte';
  import MenuBook from 'svelte-google-materialdesign-icons/Menu_book.svelte';
  import { LegalPage } from '@soliguide/common';
  import { CookieModal } from '$lib/components';
  import {
    canNativeAppSwitchCountry,
    isInsideNativeApp,
    requestNativeCountrySwitch
  } from '$lib/services';
  import ColoredCard from './ColoredCard.svelte';
  import { Text, BasicCard, Button, ListItem } from '@soliguide/design-system';
  import { getPageController } from './pageController';
  import { I18N_CTX_KEY } from '$lib/client/i18n';
  import { ROUTES_CTX_KEY } from '$lib/client/index';
  import type { I18nStore, RoutingStore } from '$lib/client/types';
  import { goto } from '$app/navigation';

  const i18n: I18nStore = getContext(I18N_CTX_KEY);
  const theme = getThemeContext();
  const routes: RoutingStore = getContext(ROUTES_CTX_KEY);
  const legalLinks = getLegalLinksContext();

  const pageState = getPageController();

  const openCookieDialog = () => {
    pageState.openCookieModal();
  };

  const navigateToExternal = (url: string | null) => {
    if (!url) {
      return;
    }
    window.open(url, '_blank');
  };

  const changeLanguage = () => {
    pageState.captureEvent('click-change-language');
    goto(`${$routes.ROUTE_LANGUAGES}?from=more-options`);
  };

  const countryVersions = buildCountryVersions(theme, getAllThemes());

  /**
   * Offered everywhere the switch actually lands somewhere: in a browser, where
   * it is a plain navigation, and in a mobile application recent enough to take
   * it over. Hidden in older applications only, where that same navigation would
   * throw the visitor out to the system browser.
   *
   * Resolved on mount rather than at module scope, where there is no window.
   */
  let canSwitchCountry = false;

  onMount(() => {
    canSwitchCountry = !isInsideNativeApp() || canNativeAppSwitchCountry();
  });

  /**
   * Each country is a separate deployment on its own hostname, so switching is a
   * full page load and not a client side navigation.
   *
   * Inside the mobile application the native application owns the country: it is
   * asked to switch so that the choice is remembered and the user stays in the
   * app. In a browser, the page navigates to the country's home page itself.
   */
  const switchCountry = (countryVersion: CountryVersion) => {
    pageState.captureEvent('click-change-country', { newCountry: countryVersion.country });

    if (requestNativeCountrySwitch(countryVersion.theme)) {
      return;
    }

    window.location.assign(buildCountryVersionUrl(countryVersion, new URL(window.location.href)));
  };
</script>

<svelte:head>
  <title>{$i18n.t('SOLIGUIDE_MORE_OPTIONS', { brandName: theme.brandName })}</title>
</svelte:head>

<section>
  <div class="title">
    <Text type="title2PrimaryExtraBold">{$i18n.t('MORE_OPTIONS_TITLE')}</Text>
  </div>

  {#if theme.links.practicalFiles}
    <ColoredCard
      cardType="primary"
      title={$i18n.t('FICHES_PRATIQUES')}
      description={$i18n.t('FICHES_PRATIQUES_DESCRIPTION')}
      actionName={$i18n.t('PLUS_INFOS')}
      imgUrl="/images/paper.svg"
      on:action={() => {
        pageState.captureEvent('click-access-practical-files');
        navigateToExternal(theme.links.practicalFiles);
      }}
    />
  {/if}

  {#if canSwitchCountry && countryVersions.length}
    <ColoredCard
      cardType="secondary"
      title={$i18n.t('COUNTRY_VERSIONS')}
      description={$i18n.t('COUNTRY_VERSIONS_DESCRIPTION')}
      imgUrl="/images/globe.svg"
    >
      <svelte:fragment slot="actions">
        {#each countryVersions as countryVersion (countryVersion.theme)}
          <Button
            type="neutralOutlined"
            size="xsmall"
            on:click={() => switchCountry(countryVersion)}
          >
            {$i18n.t(countryVersion.nameKey)}
          </Button>
        {/each}
      </svelte:fragment>
    </ColoredCard>
  {/if}

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
      {#if theme.capabilities.cookieManagement}
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
        href={legalLinks[LegalPage.COOKIE_POLICY]}
        on:click={() => pageState.captureEvent('click-cookie-policy')}
      >
        <MenuBook variation="filled" slot="icon" size="16" />
      </ListItem>
      <ListItem
        type="externalLink"
        shape="bordered"
        size="small"
        title={$i18n.t('PRIVACY_POLICY')}
        href={legalLinks[LegalPage.PRIVACY_POLICY]}
        on:click={() => pageState.captureEvent('click-privacy-policy')}
      >
        <Https variation="filled" slot="icon" size="16" />
      </ListItem>
      <ListItem
        type="externalLink"
        shape="bordered"
        size="small"
        title={$i18n.t('DATA_PROTECTION_AGREEMENT')}
        href={legalLinks[LegalPage.DATA_PROCESSING_AGREEMENT]}
        on:click={() => pageState.captureEvent('click-data-protection-agreement')}
      >
        <Gavel variation="filled" slot="icon" size="16" />
      </ListItem>
      <ListItem
        type="externalLink"
        shape="bordered"
        size="small"
        title={$i18n.t('LEGAL_NOTICE')}
        href={legalLinks[LegalPage.LEGAL_NOTICES]}
        on:click={() => pageState.captureEvent('click-legal-notice')}
      >
        <Security variation="filled" slot="icon" size="16" />
      </ListItem>
      <ListItem
        type="externalLink"
        size="small"
        title={$i18n.t('GCU')}
        href={legalLinks[LegalPage.GCU]}
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
        shape={theme.links.becomeTranslator ? 'bordered' : 'default'}
        size="small"
        title={$i18n.t('SEE_ORGANIZATION_SITE', { organizationName: theme.organization.name })}
        href={theme.links.organizationSite}
        on:click={() => pageState.captureEvent('click-access-organization-site')}
      >
        <ScreenSearchDesktop variation="filled" slot="icon" size="16" />
      </ListItem>
      {#if theme.links.becomeTranslator}
        <ListItem
          type="externalLink"
          size="small"
          title={$i18n.t('BECOME_TRANSLATOR')}
          href={theme.links.becomeTranslator}
          on:click={() => pageState.captureEvent('click-become-translator')}
        >
          <Transcribe variation="filled" slot="icon" size="16" />
        </ListItem>
      {/if}
    </div>
  </BasicCard>
</section>

{#if $pageState.cookieModalOpen}
  <CookieModal
    cookiePolicyLink={legalLinks[LegalPage.COOKIE_POLICY]}
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
