<script lang="ts">
  import { createEventDispatcher, getContext } from 'svelte';
  import Near from 'svelte-google-materialdesign-icons/Near_me.svelte';
  import { Button } from '@soliguide/design-system';
  import { getMapLink } from '$lib/client/index';
  import { I18N_CTX_KEY } from '$lib/client/i18n';
  import type { I18nStore } from '$lib/client/types';

  export let address: string;
  export let coordinates: [number, number] | undefined;
  export let reversed = false;

  export let onOrientation: boolean;

  const i18n: I18nStore = getContext(I18N_CTX_KEY);

  const disabled = onOrientation;

  const gotoLink = () => {
    if (!disabled) {
      window.open(getMapLink(address, coordinates), '_blank', 'noopener,noreferrer');
    }
  };

  const dispatch = createEventDispatcher();
</script>

<Button
  on:click={(event) => {
    gotoLink();
    dispatch('click', event);
  }}
  size="small"
  type={reversed ? 'reversed' : 'neutralOutlined'}
  {disabled}
>
  <Near slot="icon" />
  {$i18n.t('BTN_Y_ALLER')}
</Button>
