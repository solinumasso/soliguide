<script lang="ts">
  import { PhoneButton } from '$lib/components';
  import { getPlaceDetailsPageController } from '../pageController';
  import type { Phone } from '$lib/models/types';
  import GoToButton from './GoToButton.svelte';

  export let phones: Phone[];

  export let address: string;
  export let coordinates: [number, number] | undefined;

  export let onOrientation: boolean;

  const placeController = getPlaceDetailsPageController();
</script>

<div class="footer">
  <GoToButton
    {address}
    {coordinates}
    {onOrientation}
    on:click={() => {
      placeController.captureEvent('footer-go-to-click');
    }}
  />
  <PhoneButton
    {phones}
    on:click={() => {
      placeController.captureEvent('footer-phone-click');
    }}
  />
</div>

<style lang="scss">
  .footer {
    width: 100%;
    background: white;
    padding: var(--spacingLG);
    gap: var(--spacingXL);
    border-top: var(--color-borderNeutral) solid 1px;
    box-shadow: var(--shadowMD);
    display: flex;
    justify-content: center;
  }
</style>
