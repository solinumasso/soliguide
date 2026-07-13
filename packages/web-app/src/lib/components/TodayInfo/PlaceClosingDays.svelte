<script lang="ts">
  import Block from 'svelte-google-materialdesign-icons/Block.svelte';
  import { formatDateRangeToLocale } from '$lib/client';
  import { I18N_CTX_KEY } from '$lib/client/i18n';
  import { getContext } from 'svelte';
  import { page } from '$app/stores';
  import type { I18nStore } from '$lib/client/types';
  import type { DaysRange } from '$lib/models/types';

  const i18n: I18nStore = getContext(I18N_CTX_KEY);

  export let closingRange: DaysRange;

  $: formatedContent = formatDateRangeToLocale(closingRange, $page.params.lang);
</script>

<div class="closing-days">
  <span class="closing-days-icon">
    <Block id="closing-days-icon" size="16" />
  </span>
  <span class="closing-days-text text-secondary-text2-medium"
    >{formatedContent.end
      ? $i18n.t('CLOSING_DAYS_RANGE', {
          startDate: formatedContent.start,
          endDate: formatedContent.end
        })
      : $i18n.t('CLOSING_DAYS_RANGE_WITHOUT_END_DATE', {
          startDate: formatedContent.start
        })}</span
  >
</div>

<style lang="scss">
  .closing-days {
    gap: var(--spacing4XS);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
  }
  .closing-days-text {
    vertical-align: middle;
  }
  .closing-days-icon {
    vertical-align: middle;
  }
</style>
