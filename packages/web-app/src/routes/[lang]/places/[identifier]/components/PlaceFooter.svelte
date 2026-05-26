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
