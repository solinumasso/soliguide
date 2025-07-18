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
  import { I18N_CTX_KEY } from '$lib/client/i18n';
  import type { I18nStore } from '$lib/client/types';
  import { InfoBlock } from '@soliguide/design-system';
  import type { PlaceCampaignBannerMessage } from '$lib/models/types';

  const i18n: I18nStore = getContext(I18N_CTX_KEY);

  export let campaignBanner: PlaceCampaignBannerMessage | null;
</script>

{#if campaignBanner}
  <InfoBlock withIcon={true} variant="warning" text={$i18n.t(campaignBanner)}></InfoBlock>
{/if}
