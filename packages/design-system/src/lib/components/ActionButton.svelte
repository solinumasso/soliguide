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
  import { createEventDispatcher, type SvelteComponent, type ComponentType } from 'svelte';
  import Button from '$lib/components/buttons/Button.svelte';
  import ToggleButton from '$lib/components/ToggleButton.svelte';
  import type { TopbarActionType } from '$lib/types/TopbarAction';

  export let type: TopbarActionType = 'button';
  export let label: string;
  export let reversed = false;
  export let icon: ComponentType<SvelteComponent>;
  export let iconColor: string | null = null;
  export let active = false;

  const dispatch = createEventDispatcher();
</script>

{#if type === 'toggle'}
  <ToggleButton
    aria-label={label}
    type={reversed ? 'primaryReversed' : 'primaryShy'}
    {icon}
    {iconColor}
    checked={active}
    on:change={() => dispatch('action')}
  />
{:else}
  <Button
    iconPosition="iconOnly"
    aria-label={label}
    type={reversed ? 'reversed' : 'shy'}
    on:click={() => dispatch('action')}
  >
    <svelte:component this={icon} slot="icon" {...iconColor ? { color: iconColor } : {}} />
  </Button>
{/if}