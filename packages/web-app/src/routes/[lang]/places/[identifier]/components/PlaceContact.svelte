<script lang="ts">
  import { getThemeContext } from '$lib/theme';
  import { getContext } from 'svelte';
  import Email from 'svelte-google-materialdesign-icons/Mail.svelte';
  import Public from 'svelte-google-materialdesign-icons/Public.svelte';
  import Phone from 'svelte-google-materialdesign-icons/Phone.svelte';
  import Smartphone from 'svelte-google-materialdesign-icons/Smartphone.svelte';
  import { ListItem, Text } from '@soliguide/design-system';
  import { I18N_CTX_KEY } from '$lib/client/i18n';
  import PlaceDetailsSection from './PlaceDetailsSection.svelte';
  import { parsePhoneNumber } from '@soliguide/common';
  import { getPlaceDetailsPageController } from '../pageController';
  import type { Phone as PhoneType } from '$lib/models/types';
  import type { I18nStore } from '$lib/client/types';

  export let phones: PhoneType[];
  export let website: string;
  export let instagram: string;
  export let facebook: string;
  export let email: string;

  const i18n: I18nStore = getContext(I18N_CTX_KEY);
  const theme = getThemeContext();

  const placeController = getPlaceDetailsPageController();
  const currentCountry = theme.country;

  /**
   * Same formatting as the Angular frontend, which uses parsePhoneNumber for both
   * the displayed number and the call link. A number it cannot parse is dropped
   * rather than rendering a row linking to `tel:null`.
   */
  $: dialablePhones = (phones ?? [])
    .map((phone) => ({
      label: phone.label,
      displayNumber: parsePhoneNumber(phone, currentCountry)
    }))
    .filter(({ displayNumber }) => displayNumber);
</script>

<PlaceDetailsSection>
  <div class="contact">
    <Text type="title3PrimaryExtraBold">{$i18n.t('CONTACT_AND_INFO')}</Text>

    <div>
      {#if dialablePhones.length}
        {#each dialablePhones as { label, displayNumber }}
          <ListItem
            type="link"
            subTitle={label}
            title={displayNumber}
            size="small"
            shape={email || website || facebook || instagram ? 'bordered' : 'default'}
            href={`tel:${displayNumber}`}
            on:click={() => {
              placeController.captureEvent('call', {
                isClickable: true
              });
            }}
          >
            <Phone size="16" slot="icon" />
          </ListItem>
        {/each}
      {/if}

      {#if email}
        <ListItem
          type="link"
          title={email}
          size="small"
          shape={website || facebook || instagram ? 'bordered' : 'default'}
          href={`mailto:${email}`}
          on:click={() => {
            placeController.captureEvent('email');
          }}
        >
          <Email variation="filled" size="16" slot="icon" />
        </ListItem>
      {/if}

      {#if website}
        <ListItem
          type="externalLink"
          title={website}
          size="small"
          shape={facebook || instagram ? 'bordered' : 'default'}
          href={website}
          on:click={() => {
            placeController.captureEvent('website');
          }}
        >
          <Public size="16" slot="icon" />
        </ListItem>
      {/if}

      {#if facebook}
        <ListItem
          type="externalLink"
          title={$i18n.t('FACEBOOK_PAGE')}
          size="small"
          shape={instagram ? 'bordered' : 'default'}
          href={facebook}
          on:click={() => {
            placeController.captureEvent('facebook');
          }}
        >
          <Smartphone size="16" slot="icon" variation="filled" />
        </ListItem>
      {/if}

      {#if instagram}
        <ListItem
          type="externalLink"
          title={$i18n.t('INSTAGRAM_ACCOUNT')}
          size="small"
          shape="default"
          href={instagram}
          on:click={() => {
            placeController.captureEvent('instagram');
          }}
        >
          <Smartphone size="16" slot="icon" variation="filled" />
        </ListItem>
      {/if}
    </div>
  </div>
</PlaceDetailsSection>

<style lang="scss">
  .contact {
    display: flex;
    flex-direction: column;
    gap: var(--spacingLG);
  }
</style>
