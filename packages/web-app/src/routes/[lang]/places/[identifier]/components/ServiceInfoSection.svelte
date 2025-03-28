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
  import { I18N_CTX_KEY } from '$lib/client/i18n';
  import { TextClamper } from '@soliguide/design-system';
  import { getContext } from 'svelte';
  import DOMPurify from 'dompurify';
  import { type PlaceDetailsInfo, type TranslatableElement } from '$lib/models/types';
  import type { I18nStore } from '$lib/client/types';
  import { getTitleAndIcon } from '../functions';

  export let info: PlaceDetailsInfo[] = [];

  const i18n: I18nStore = getContext(I18N_CTX_KEY);

  const getFormattedDescription = (description: TranslatableElement[]): string => {
    return description.map(({ key, params }) => $i18n.t(key, params)).join(', ');
  };
</script>

<div class="info-content">
  {#each info as { type, description, needTranslation, translatedText }}
    {@const details = getTitleAndIcon($i18n, type)}
    <div class="detail">
      <div class="icon">
        <svelte:component this={details.icon} size="18" />
      </div>

      <p class="public-description">
        {#if !needTranslation && translatedText}
          <!-- eslint-disable-next-line svelte/no-at-html-tags -->
          {@html DOMPurify.sanitize(translatedText)}
        {:else}
          <b>{details.title}</b>
          <TextClamper
            linesNotClamped={3}
            showMoreLabel={$i18n.t('SEE_MORE')}
            showLessLabel={$i18n.t('SEE_LESS')}
          >
            <!-- eslint-disable-next-line svelte/no-at-html-tags -->
            {@html DOMPurify.sanitize(getFormattedDescription(description))}
          </TextClamper>
        {/if}
      </p>
    </div>
  {/each}
</div>

<style lang="scss">
  .public-description {
    font-size: 0.7rem;
    font-style: normal;
    line-height: 1.2rem;
    color: var(--color-textShy);
  }
  .public-description :global(b) {
    display: block !important;
    color: black;
    font-size: 15px;
    font-size: 0.85rem;
  }
  .info-content {
    display: flex;
    flex-direction: column;
    gap: var(--spacingLG);
  }

  .detail {
    display: flex;
    gap: var(--spacingMD);
  }

  .icon {
    height: 16px;
    width: 16px;
    color: var(--color-textDark);
  }
</style>
