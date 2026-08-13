<script lang="ts">
  import { getThemeContext } from '$lib/theme';
  import { createEventDispatcher, getContext } from 'svelte';
  import type { Phone } from '$lib/models/types';
  import PhoneIcon from 'svelte-google-materialdesign-icons/Phone.svelte';
  import { Button, ButtonLink } from '@soliguide/design-system';
  import { buildTelHref } from '@soliguide/common';
  import { I18N_CTX_KEY } from '$lib/client/i18n';
  import type { I18nStore } from '$lib/client/types';

  export let phones: Phone[] = [];

  export let type: 'primaryFill' | 'neutralOutlined' = 'primaryFill';

  const i18n: I18nStore = getContext(I18N_CTX_KEY);
  const theme = getThemeContext();

  const dispatch = createEventDispatcher();

  // A number the device cannot dial gets a disabled button rather than a dead link
  $: callablePhone = phones.find((phone) => buildTelHref(phone, theme.country)) ?? null;
  $: telHref = callablePhone ? buildTelHref(callablePhone, theme.country) : null;
</script>

{#if telHref}
  <ButtonLink
    icon
    size="small"
    {type}
    href={telHref}
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
