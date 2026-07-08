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
  import { createEventDispatcher, getContext } from 'svelte';
  import { Categories, getCategoryTranslationKey } from '@soliguide/common';
  import { Text } from '@soliguide/design-system';
  import AcUnit from 'svelte-google-materialdesign-icons/Ac_unit.svelte';
  import CategoryIcon from '$lib/components/CategoryIcon.svelte';
  import thermalIcon from '../../assets/images/thermal_icon.png';
  import { I18N_CTX_KEY } from '$lib/client/i18n';
  import type { I18nStore } from '$lib/client/types';

  export let disabled = false;

  const i18n: I18nStore = getContext(I18N_CTX_KEY);
  const dispatch = createEventDispatcher<{
    search: { category: Categories; airConditioned: boolean };
  }>();

  // The four heatwave-related 1-click searches shown in the card
  const quickSearches: { category: Categories; airConditioned: boolean }[] = [
    { category: Categories.FOUNTAIN, airConditioned: false },
    { category: Categories.SHOWER, airConditioned: false },
    { category: Categories.DAY_HOSTING, airConditioned: true },
    { category: Categories.LIBRARIES, airConditioned: true }
  ];
</script>

<section class="heatwave-card">
  <span class="snowflake" aria-hidden="true"><AcUnit size="190" /></span>
  <div class="heatwave-header">
    <span class="header-icon" aria-hidden="true">
      <img src={thermalIcon} alt="" class="thermal-icon" />
    </span>
    <div class="header-text">
      <Text as="h2" type="title4PrimaryExtraBold" color="inverse">
        {$i18n.t('HEATWAVE_EMERGENCY_TITLE')}
      </Text>
      <Text type="caption1" color="inverse">
        <span class="header-description">{$i18n.t('HEATWAVE_EMERGENCY_DESCRIPTION')}</span>
      </Text>
    </div>
  </div>

  <div class="quick-searches">
    {#each quickSearches as { category, airConditioned }}
      <button
        type="button"
        class="quick-search-button"
        {disabled}
        on:click={() => dispatch('search', { category, airConditioned })}
      >
        <span class="button-icon" aria-hidden="true">
          <CategoryIcon categoryId={category} variation="filled" size={14} />
        </span>
        <Text type="text2" color="inverse">{$i18n.t(getCategoryTranslationKey(category))}</Text>
      </button>
    {/each}
  </div>
</section>

<style lang="scss">
  .heatwave-card {
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    gap: var(--spacingMD);
    padding: var(--spacingLG);
    border-radius: var(--radiusRounded);
    background: var(--color-surfaceSecondaryGradient);
    color: var(--color-textInverse);
  }

  .snowflake {
    position: absolute;
    top: -32px;
    right: -24px;
    opacity: 0.15;
    color: var(--color-surfaceSecondary2);
    font-size: 190px;
    line-height: 1;
    pointer-events: none;
    z-index: 0;
  }

  .heatwave-header {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    gap: var(--spacingSM);
    padding: var(--spacingSM);
    border-radius: var(--radiusRounded);
    background: var(--color-surfaceWhiteAlphaLight);
  }

  .header-icon {
    flex-shrink: 0;
    width: 44px;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--radiusFull);
    background: var(--color-surfaceWhite);
  }

  .thermal-icon {
    width: 28px;
    height: 28px;
    object-fit: contain;
  }

  .header-text {
    display: flex;
    flex-direction: column;
    gap: var(--spacing3XS);
  }

  .header-description {
    opacity: 0.85;
  }

  .quick-searches {
    position: relative;
    z-index: 1;
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacingXS);
  }

  .quick-search-button {
    display: inline-flex;
    align-items: center;
    gap: var(--spacingXS);
    width: fit-content;
    /* 12px horizontal has no design-system spacing token (scale skips from 10px to 14px) */
    padding: var(--spacingXS) 0.75rem;
    border: none;
    border-radius: var(--radiusFull);
    background: var(--color-surfaceWhiteAlphaLight);
    color: var(--color-textInverse);
    font: inherit;
    text-align: left;
    cursor: pointer;

    &:hover:not(:disabled) {
      background: var(--color-surfaceWhiteAlphaStrong);
    }

    &:disabled {
      cursor: default;
      opacity: 0.6;
    }
  }

  .button-icon {
    flex-shrink: 0;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--radiusFull);
    background: var(--color-surfaceWhite);
    color: var(--color-textHighlightSecondary);
    font-size: 14px;
  }
</style>
