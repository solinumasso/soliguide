<script lang="ts">
  import { InfoIcon, Text, Tag } from '@soliguide/design-system';
  import { PhoneButton, PlaceStatus, TodayInfo } from '$lib/components';
  import AcUnit from 'svelte-google-materialdesign-icons/Ac_unit.svelte';
  import GoToButton from './GoToButton.svelte';
  import { getPlaceDetailsPageController } from '../pageController';

  import type {
    Phone,
    TodayInfo as TodayInfoType,
    PlaceDetailsTempInfo,
    PlaceCampaignBannerMessage
  } from '$lib/models/types';
  import {
    TempInfoStatus,
    type PlaceOpeningStatus,
    type ThermalComfortData,
    isObjectEmpty,
    shouldDisplayThermalComfort
  } from '@soliguide/common';

  import type { I18nStore } from '$lib/client/types';
  import type { ThemeDefinition } from '$lib/theme/types';
  import { I18N_CTX_KEY } from '$lib/client/i18n';
  import { themeStore } from '$lib/theme';
  import { getContext } from 'svelte';
  import { get } from 'svelte/store';

  export let todayInfo: TodayInfoType = {};
  export let name: string;
  export let status: PlaceOpeningStatus;
  export let phones: Phone[];
  export let address: string;
  export let coordinates: [number, number] | undefined;
  export let onOrientation: boolean;
  export let tempInfo: PlaceDetailsTempInfo;
  export let campaignBanner: PlaceCampaignBannerMessage | null;
  export let thermalComfort: ThermalComfortData;

  const placeController = getPlaceDetailsPageController();
  const i18n: I18nStore = getContext(I18N_CTX_KEY);
  const theme: ThemeDefinition = get(themeStore.getTheme());

  $: shouldDisplayThermalComfortTag = shouldDisplayThermalComfort(theme.country);
</script>

<header class="card-header">
  <div class="details-container">
    <div class="tag-hours-container">
      <div class="status-tags">
        <PlaceStatus openingStatus={status} />
        {#if shouldDisplayThermalComfortTag && thermalComfort?.airConditioned === true}
          <Tag variant="info">
            <AcUnit slot="icon" aria-hidden="true" />
            {$i18n.t('AIR_CONDITIONED_RIBBON')}
          </Tag>
        {:else if shouldDisplayThermalComfortTag && thermalComfort?.airConditioned === false}
          <Tag variant="error">
            <AcUnit slot="icon" aria-hidden="true" />
            {$i18n.t('NOT_AIR_CONDITIONED_RIBBON')}
          </Tag>
        {/if}
      </div>
      {#if !isObjectEmpty(todayInfo)}
        <TodayInfo {todayInfo}>
          {#if tempInfo.hours?.status === TempInfoStatus.CURRENT && !tempInfo.message}
            <a href={`#openingHoursSection`}
              ><InfoIcon
                size="small"
                variant="warning"
                withShadow
                altTag={$i18n.t('TEMPORARY_HOURS_CURRENTLY_ACTIVE')}
              ></InfoIcon></a
            >
          {/if}</TodayInfo
        >
      {/if}
    </div>
    <div class="name-container">
      <Text type="title1PrimaryExtraBold">{name}</Text>
      {#if campaignBanner}
        <a href="#bannerMessage"
          ><InfoIcon altTag={$i18n.t('NO_RECENT_SCHEDULE_UPDATE')} variant="warning" size="medium"
          ></InfoIcon></a
        >
      {:else if tempInfo.message}
        <a href="#bannerMessage"
          ><InfoIcon altTag={$i18n.t('PLACE_HAVE_IMPORTANT_INFO')} variant="warning" size="medium"
          ></InfoIcon></a
        >
      {/if}
    </div>
  </div>

  <div class="actions">
    <GoToButton
      {address}
      {coordinates}
      {onOrientation}
      reversed
      on:click={() => {
        placeController.captureEvent('header-go-to-click');
      }}
    />
    <PhoneButton
      {phones}
      on:click={() => {
        placeController.captureEvent('header-phone-click');
      }}
    />
  </div>
</header>

<style lang="scss">
  .card-header {
    display: flex;
    flex-direction: column;
    gap: var(--spacingXL);

    padding: 0 var(--spacingLG) var(--spacingXL) var(--spacingLG);
    background: var(--color-surfaceSecondaryGradient);
    color: var(--color-textInverse);
  }

  .name-container {
    display: flex;
    justify-content: space-between;
  }

  .details-container {
    display: flex;
    gap: var(--spacingLG);
    flex-direction: column;
    padding: 0 var(--spacingLG);
  }

  .actions {
    display: flex;
    justify-content: center;
    gap: var(--spacingXL);
  }

  .tag-hours-container {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing3XS);
    align-self: stretch;
  }

  .status-tags {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: var(--spacingXS);
  }
</style>
