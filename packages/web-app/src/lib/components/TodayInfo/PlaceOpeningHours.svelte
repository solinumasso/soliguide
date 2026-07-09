<script lang="ts">
  import { Text } from '@soliguide/design-system';
  import QueryBuilder from 'svelte-google-materialdesign-icons/Query_builder.svelte';
  import { formatTimeRangeToLocale } from '$lib/client';
  import { I18N_CTX_KEY } from '$lib/client/i18n';
  import { getContext } from 'svelte';
  import type { I18nStore } from '$lib/client/types';
  import type { HoursRange } from '$lib/models/types';

  const i18n: I18nStore = getContext(I18N_CTX_KEY);

  export let openingRange: HoursRange[];

  $: formatedContent = formatTimeRangeToLocale(openingRange)
    .map((range) => `${$i18n.t('OPENING_RANGE', { start: range.start, end: range.end })}`)
    .join(' - ');
</script>

<div class="opening-hours-container">
  <div class="opening-hours">
    <QueryBuilder size="16" />
    <Text ellipsis type="text2Medium"
      >{$i18n.t('TODAY_OPENING_RANGE', { openingRange: formatedContent })}</Text
    >
  </div>
  <slot />
</div>

<style lang="scss">
  .opening-hours-container {
    display: flex;
    gap: var(--spacing3XS);
  }

  .opening-hours {
    max-width: 100%;
    display: flex;
    align-items: center;
    gap: var(--spacing4XS);
  }
</style>
