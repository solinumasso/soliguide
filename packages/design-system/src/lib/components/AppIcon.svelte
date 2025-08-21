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
  import type { AppIconType } from '$lib/types/AppIcon';
  import type { ComponentType, SvelteComponent } from 'svelte';
  import Star from 'svelte-google-materialdesign-icons/Star.svelte';

  export let type: AppIconType = 'primary';
  export let icon: ComponentType<SvelteComponent> = Star;
  export let disabled = false;

  const types: Record<AppIconType, string> = {
    primary: 'bg-surfacePrimary2 text-interactionHighlightPrimary',
    secondary: 'bg-surfaceSecondary1 text-highlightSecondary',
    tertiary: 'bg-surfaceTertiary1 text-highlightTertiary',
    quartary: 'bg-surfaceQuartary1 text-highlightQuartary'
  };

  $: cls = `${types[type] || types.primary} ${disabled ? 'bg-surfaceGray1! text-shy' : ''}`;
</script>

<span class={`flex items-center justify-center rounded-full w-6 h-6 ${cls}`}>
  <svelte:component this={icon} size={16} />
</span>
