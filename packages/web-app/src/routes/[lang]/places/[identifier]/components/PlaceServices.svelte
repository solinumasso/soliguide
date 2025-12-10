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
  import {
    Accordion,
    AccordionGroup,
    InfoBlock,
    ListItem,
    Tag,
    Text,
    TextClamper
  } from '@soliguide/design-system';
  import { I18N_CTX_KEY } from '$lib/client/i18n';
  import PlaceDetailsSection from './PlaceDetailsSection.svelte';
  import ServiceHours from './ServiceHours.svelte';
  import ServiceInfoSection from './ServiceInfoSection.svelte';
  import { CategoryIcon } from '$lib/components';
  import DOMPurify from 'dompurify';
  import Warning from 'svelte-google-materialdesign-icons/Warning_amber.svelte';
  import type { PlaceTempInfoHoursReady, Service } from '$lib/models/types';
  import { getCategoryTranslationKey, TempInfoStatus, type DayName } from '@soliguide/common';
  import type { I18nStore } from '$lib/client/types';
  import { formatDateToLocale } from '$lib/client/date';
  import { page } from '$app/stores';

  const i18n: I18nStore = getContext(I18N_CTX_KEY);

  export let services: Service[];
  export let currentDay: DayName;
  // eslint-disable-next-line prefer-destructuring
  $: lang = $page.params.lang;

  const getFormatedDates = (info: PlaceTempInfoHoursReady, lang: string) => {
    const { dateDebut, dateFin, status } = info;
    if (!dateDebut) return '';

    const startDate = formatDateToLocale(dateDebut, lang);
    const endDate = dateFin ? formatDateToLocale(dateFin, lang) : null;

    if (!endDate) {
      return status === TempInfoStatus.CURRENT
        ? $i18n.t('SERVICE_TEMPORARY_CLOSED_START_DATE_ONLY', { startDate })
        : $i18n.t('SERVICE_TEMPORARY_CLOSED_START_DATE_ONLY_INCOMING', { startDate });
    }

    return status === TempInfoStatus.CURRENT
      ? $i18n.t('SERVICE_TEMPORARY_CLOSED', { startDate, endDate })
      : $i18n.t('SERVICE_TEMPORARY_CLOSED_INCOMING', { startDate, endDate });
  };
</script>

<PlaceDetailsSection>
  <div class="title">
    <Text type="title3PrimaryExtraBold">{$i18n.t('SERVICES_OFFERED')}</Text>
    <Text type="text2" color="shy">{$i18n.t('ALL_SERVICES_AVAILABLE')}</Text>
  </div>
  <div class="AccordionGroup">
    <AccordionGroup>
      <div class="services">
        {#each services as { category, description, hours, info, saturation, tempClosure }, index}
          {#if description || hours || info.length || saturation || tempClosure}
            <section class="service-accordion">
              <Accordion
                title={$i18n.t(getCategoryTranslationKey(category))}
                isExpanded={index === 0}
                key={`${category}-${index}`}
                shy={index === services.length - 1}
              >
                <span slot="icon">
                  <CategoryIcon categoryId={category} />
                </span>
                <div class="accordion-items">
                  {#if saturation?.tag}
                    <div class="tags-container">
                      <Tag variant={saturation.tag.variant}>
                        <Warning slot="icon" />
                        {$i18n.t(saturation.tag.value)}
                      </Tag>
                    </div>
                  {/if}

                  {#if tempClosure}
                    <InfoBlock
                      withIcon={true}
                      variant={tempClosure.status === TempInfoStatus.CURRENT ? 'error' : 'warning'}
                      text={getFormatedDates(tempClosure, lang)}
                    ></InfoBlock>
                  {/if}

                  {#if description}
                    <section class="description">
                      <TextClamper
                        linesNotClamped={3}
                        showMoreLabel={$i18n.t('SEE_MORE')}
                        showLessLabel={$i18n.t('SEE_LESS')}
                      >
                        <Text type="caption1" color="shy">
                          <!-- eslint-disable-next-line svelte/no-at-html-tags -->
                          {@html DOMPurify.sanitize(description)}
                        </Text>
                      </TextClamper>
                    </section>
                  {/if}

                  {#if info.length}
                    <ServiceInfoSection {info} />
                  {/if}

                  {#if hours}
                    <ServiceHours {hours} {currentDay} />
                  {/if}
                </div>
              </Accordion>
            </section>
          {:else}
            <section class="service-list">
              <ListItem
                shape={index === services.length - 1 ? 'default' : 'bordered'}
                title={$i18n.t(getCategoryTranslationKey(category))}
              >
                <span slot="icon">
                  <CategoryIcon categoryId={category} />
                </span>
              </ListItem>
            </section>
          {/if}
        {/each}
      </div></AccordionGroup
    >
  </div></PlaceDetailsSection
>

<style lang="scss">
  .services {
    display: flex;
    flex-direction: column;
    gap: var(--spacingXS);
  }

  .service-accordion {
    padding: var(--spacingXS) 0px 0px 0px;
  }

  .service-list {
    padding: 0px var(--spacing3XS);
  }

  .title {
    display: flex;
    flex-direction: column;
    gap: var(--spacing3XS);
    margin-bottom: var(--spacingLG);
  }

  .accordion-items {
    display: flex;
    flex-direction: column;
    gap: var(--spacingSM);

    .tags-container {
      display: flex;
      gap: var(--spacing4XS);
    }
  }

  .description {
    // The HTML doesn't display correctly without this because of the base styles
    :global(li) {
      margin-left: var(--spacingMD);
    }

    :global(ul li) {
      list-style: initial;
    }

    :global(ol li) {
      list-style: decimal;
    }
  }
</style>
