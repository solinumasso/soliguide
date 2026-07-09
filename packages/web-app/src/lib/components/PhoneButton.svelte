<script lang="ts">
  import { createEventDispatcher, getContext } from 'svelte';
  import type { Phone } from '$lib/models/types';
  import PhoneIcon from 'svelte-google-materialdesign-icons/Phone.svelte';
  import { get, writable } from 'svelte/store';
  import { Button, ButtonLink } from '@soliguide/design-system';
  import { parsePhoneNumber } from '@soliguide/common';
  import { I18N_CTX_KEY } from '$lib/client/i18n';
  import type { I18nStore } from '$lib/client/types';
  import type { ThemeDefinition } from '$lib/theme/types';
  import { themeStore } from '$lib/theme';

  export let phones: Phone[] = [];

  export let type: 'primaryFill' | 'neutralOutlined' = 'primaryFill';

  const i18n: I18nStore = getContext(I18N_CTX_KEY);
  const theme: ThemeDefinition = get(themeStore.getTheme());

  const dispatch = createEventDispatcher();

  const currentCountry = theme.country;
  $: hasValidPhone = phones.length && phones[0].phoneNumber;
  $: phoneHref = writable(
    hasValidPhone ? `tel:${parsePhoneNumber(phones[0], currentCountry)}` : ''
  );
</script>

{#if hasValidPhone}
  <ButtonLink
    icon
    size="small"
    {type}
    href={$phoneHref}
    title={$i18n.t('TO_CALL')}
    on:click={(event) => {
      dispatch('click', event);
    }}
  >
    <PhoneIcon variation="filled" slot="icon" />
    {$i18n.t('TO_CALL')}
  </ButtonLink>
{:else}
  <Button size="small" aria-disabled="true" title={$i18n.t('TO_CALL')} disabled>
    <PhoneIcon variation="filled" slot="icon" />
    {$i18n.t('TO_CALL')}
  </Button>
{/if}
