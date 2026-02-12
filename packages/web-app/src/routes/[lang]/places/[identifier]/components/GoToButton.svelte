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
