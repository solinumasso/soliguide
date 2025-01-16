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
  import Email from 'svelte-google-materialdesign-icons/Mail.svelte';
  import Public from 'svelte-google-materialdesign-icons/Public.svelte';
  import Phone from 'svelte-google-materialdesign-icons/Phone.svelte';
  import Smartphone from 'svelte-google-materialdesign-icons/Smartphone.svelte';
  import { ListItem, Text } from '@soliguide/design-system';
  import { I18N_CTX_KEY } from '$lib/client/i18n';
  import PlaceDetailsSection from './PlaceDetailsSection.svelte';
  import { themeStore } from '$lib/theme';
  import { parsePhoneNumber } from '@soliguide/common';
  import { getPlaceDetailsPageController } from '../pageController';
  import type { Phone as PhoneType } from '$lib/models/types';
  import type { I18nStore } from '$lib/client/types';
  import type { ThemeDefinition } from '$lib/theme/types';
  import { get } from 'svelte/store';

  export let phones: PhoneType[];
  export let website: string;
  export let instagram: string;
  export let facebook: string;
  export let email: string;

  const i18n: I18nStore = getContext(I18N_CTX_KEY);
  const theme: ThemeDefinition = get(themeStore.getTheme());

  const placeController = getPlaceDetailsPageController();
  const currentCountry = theme.country;

  $: formattedPhones = phones?.map((phone) => ({
    ...phone,
    formattedNumber: parsePhoneNumber(phone, currentCountry)
  }));
</script>

<PlaceDetailsSection>
  <div class="contact">
    <Text type="title3PrimaryExtraBold">{$i18n.t('CONTACT_AND_INFO')}</Text>

    <div>
      {#if phones?.length}
        {#each formattedPhones as { label, formattedNumber }}
          <ListItem
            type="link"
            subTitle={label}
            title={formattedNumber}
            size="small"
            shape={email || website || facebook || instagram ? 'bordered' : 'default'}
            href={`tel:${formattedNumber}`}
            on:click={() => {
              placeController.captureEvent('call', {
                isClickable: Boolean(formattedNumber)
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
