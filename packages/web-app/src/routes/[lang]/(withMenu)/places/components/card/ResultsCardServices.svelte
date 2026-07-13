<script lang="ts">
  import { Text, Badge } from '@soliguide/design-system';
  import { getContext } from 'svelte';
  import { I18N_CTX_KEY } from '$lib/client/i18n';
  import { CategoryIcon } from '$lib/components';
  import type { I18nStore } from '$lib/client/types';
  import { getCategoryTranslationKey, type Categories } from '@soliguide/common';

  const i18n: I18nStore = getContext(I18N_CTX_KEY);

  export let services: Categories[] = [];
  let servicesToDisplay: Categories[];
  let servicesHidden: Categories[];

  $: {
    servicesToDisplay = services.slice(0, 3);
    servicesHidden = services.slice(3);
  }
</script>

<div class="services-container">
  <Text as="h3" type="text2Medium">{$i18n.t('SERVICES')}</Text>
  <ul class="services">
    {#each servicesToDisplay as service}
      <li class="services-item">
        <CategoryIcon categoryId={service} />
        <Text as="span" color="shy" type="text2">{$i18n.t(getCategoryTranslationKey(service))}</Text
        >
      </li>
    {/each}
    {#if servicesHidden.length > 0}
      <li class="services-item">
        <Text as="span" color="shy" type="text2">+</Text>
        <Badge text={String(servicesHidden.length)} />
      </li>
    {/if}
  </ul>
</div>

<style lang="scss">
  .services-container {
    display: flex;
    flex-direction: column;
    gap: var(--spacing3XS);
  }

  .services {
    margin-top: var(--spacing3XS);
    list-style-type: none;
    min-height: 50px;
    overflow: hidden;
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacingSM) var(--spacingLG);
  }

  .services-item {
    display: flex;
    align-items: center;
    gap: var(--spacing3XS);
  }
</style>
