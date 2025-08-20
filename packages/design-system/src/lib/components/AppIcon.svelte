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
    primary: 'icon-primary',
    secondary: 'icon-secondary',
    tertiary: 'icon-tertiary',
    quartary: 'icon-quartary'
  };

  $: cls = types[type] || types.primary;
</script>

<span class={`app-icon ${cls}`} class:disabled>
  <svelte:component this={icon} size={16} />
</span>

<style>
  /* .app-icon {
    border-radius: var(--radiusFull);
    height: 24px;
    width: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .icon-primary {
    background-color: var(--color-surfacePrimary2);
    color: var(--color-interactionHighlightPrimary);
  }
  .icon-secondary {
    background-color: var(--color-surfaceSecondary1);
    color: var(--color-textHighlightSecondary);
  }
  .icon-tertiary {
    background-color: var(--color-surfaceTertiary1);
    color: var(--color-textHighlightTertiary);
  }
  .icon-quartary {
    background-color: var(--color-surfaceQuartary1);
    color: var(--color-textHighlightQuartary);
  }
  .disabled {
    background-color: var(--color-surfaceGray1);
    color: var(--color-textShy);
  } */
</style>
