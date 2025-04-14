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
  import Update from 'svelte-google-materialdesign-icons/Update.svelte';
  import Star from 'svelte-google-materialdesign-icons/Star.svelte';
  import { AppIcon, Tag, Text, TextClamper } from '@soliguide/design-system';
  import PlaceDetailsSection from './PlaceDetailsSection.svelte';

  import { I18N_CTX_KEY } from '$lib/client/i18n';
  import { formatToDateWithFullMonth } from '$lib/client';
  import DOMPurify from 'dompurify';
  import {
    type PlaceDetailsInfo,
    type Source,
    type Tag as TagType,
    type TranslatableElement
  } from '$lib/models/types';

  import type { I18nStore } from '$lib/client/types';
  import { getTitleAndIcon } from '../functions';

  export let info: PlaceDetailsInfo[] = [];

  export let lastUpdate: string;
  export let sources: Source[] = [];

  const i18n: I18nStore = getContext(I18N_CTX_KEY);

  const formatContent = ({ value }: TagType): string => {
    const rawContent = $i18n.t(value);
    return DOMPurify.sanitize(rawContent);
  };

  const getFormattedDescription = (description: TranslatableElement[]): string => {
    return description.map(({ key, params }) => $i18n.t(key, params)).join(', ');
  };
</script>

<PlaceDetailsSection>
  <div class="info-content">
    <div class="details-container">
      {#each info as { type, description, tags, needTranslation, translatedText }}
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
              {#if tags.length}
                <div class="tags">
                  {#each tags as tag}
                    <Tag variant="warning">
                      <Star slot="icon" />
                      <!-- eslint-disable-next-line svelte/no-at-html-tags -->
                      {@html formatContent(tag)}
                    </Tag>
                  {/each}
                </div>
              {/if}
            {/if}
          </p>
        </div>
      {/each}
    </div>
    <div class="info-footer">
      <div class="last-update">
        <AppIcon icon={Update} />
        <Text type="caption2" color="neutral">
          {`${$i18n.t('EXPORTS_HEADER_LAST_UPDATE')} : ${formatToDateWithFullMonth(lastUpdate, $i18n.language)}`}
        </Text>
      </div>
      {#if sources.length}
        <div class="card-header-source">
          <Text type="caption2" color="neutral">
            {$i18n.t('SOURCE')}
            {#each sources as source, index}
              {source.label}
              {#if source.licenseLabel && source.licenseLink}(<a
                  href={source.licenseLink}
                  target="_blank">{source.licenseLabel}</a
                >){/if}{#if index < sources.length - 1}<span>, </span>
              {/if}
            {/each}
          </Text>
        </div>
      {/if}
    </div>
  </div>
</PlaceDetailsSection>

<style>
  .public-description {
    font-size: 0.8rem;
    font-style: normal;
    line-height: 1.2rem;
    color: var(--color-textShy);
  }
  .public-description :global(b) {
    display: block !important;
    color: black;
    font-size: 15px;
    font-size: 0.9rem;
  }

  .info-content {
    display: flex;
    flex-direction: column;
    gap: var(--spacingXL);
  }

  .details-container {
    display: flex;
    flex-direction: column;
    gap: var(--spacingLG);
  }

  .detail {
    display: flex;
    gap: var(--spacingMD);
  }

  .icon {
    height: 18px;
    width: 18px;
    color: var(--color-textDark);
  }

  .tags {
    display: flex;
    gap: var(--spacing4XS);
    flex-wrap: wrap;
    margin-bottom: var(--spacing4XS);
  }

  .info-footer {
    flex-direction: column;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: var(--spacingXS);
  }

  .last-update {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: var(--spacingXS);
  }

  .card-header-source {
    text-align: center;
  }

  .card-header-source a {
    text-decoration: revert;
  }
</style>
