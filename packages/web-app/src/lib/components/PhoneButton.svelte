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
