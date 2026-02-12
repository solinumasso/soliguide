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
  import Map from 'svelte-google-materialdesign-icons/Map.svelte';
  // Visibility will be added in V2
  // import Visibility from 'svelte-google-materialdesign-icons/Visibility.svelte';
  import Copy from 'svelte-google-materialdesign-icons/Content_copy.svelte';
  import { ListItem, Text } from '@soliguide/design-system';
  import { I18N_CTX_KEY } from '$lib/client/i18n';
  import { getMapLink } from '$lib/client';
  import PlaceDetailsSection from './PlaceDetailsSection.svelte';
  import { getPlaceDetailsPageController } from '../pageController';
  import type { I18nStore } from '$lib/client/types';

  export let address: string;
  export let coordinates: [number, number] | undefined;

  export let onOrientation: boolean;
  const i18n: I18nStore = getContext(I18N_CTX_KEY);
  const placeController = getPlaceDetailsPageController();

  const gotoLink = () => {
    placeController.captureEvent('see-on-map', { placeAddress: address });
    window.open(getMapLink(address, coordinates), '_blank', 'noopener,noreferrer');
  };

  const copyText = () => {
    placeController.captureEvent('copy-address', { placeAddress: address });
    navigator.clipboard.writeText(address);
  };
</script>

<PlaceDetailsSection>
  <div class="how-to-get-there">
    <Text type="title3PrimaryExtraBold">{$i18n.t('HOW_TO_GO')}</Text>

    <div>
      <ListItem type="actionRight" title="Adresse" subTitle={address}>
        <Copy on:click={copyText} size="16" slot="actionIcon" />
      </ListItem>

      <!-- Show address will be added in V2  -->

      <!-- <ListItem shape="bordered" title={$i18n.t('SHOW_ADDRESS')} type="actionFull" size="small">
        <Visibility size="16" slot="icon" variation="filled" />
      </ListItem> -->

      {#if !onOrientation}
        <ListItem
          shape="default"
          title={$i18n.t('SEE_ON_MAP')}
          type="actionFull"
          size="small"
          on:click={gotoLink}
        >
          <Map size="16" slot="icon" variation="filled" />
        </ListItem>
      {/if}
    </div>
  </div>
</PlaceDetailsSection>

<style lang="scss">
  .how-to-get-there {
    display: flex;
    flex-direction: column;
    gap: var(--spacingLG);
  }
</style>
