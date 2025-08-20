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
<script lang="ts" context="module">
  import type { ComponentProps } from 'svelte';

  import ToggleSwitch from '$lib/components/forms/ToggleSwitch.svelte';

  const defaultArgs: ComponentProps<ToggleSwitch> = {
    size: 'medium'
  };

  export const meta = {
    title: 'Selection controls/ToggleSwitch',
    component: ToggleSwitch,
    argTypes: {
      size: {
        control: { type: 'radio' },
        options: ['small', 'medium']
      }
    },
    args: defaultArgs
  };
</script>

<script lang="ts">
  import { Story, Template } from '@storybook/addon-svelte-csf';
</script>

<Template let:args>
  <ToggleSwitch {...args} on:change />
</Template>

<Story name="Default" />

<Story name="Disabled" args={{ disabled: true }}>
  <ToggleSwitch disabled={true} />
</Story>

<Story name="ToggleSwitch sizes" parameters={{ controls: { disable: true } }}>
  <div class="story-row">
    <ToggleSwitch {...defaultArgs} size="medium" />
    <ToggleSwitch {...defaultArgs} size="small" />
  </div>
</Story>

<Story name="ToggleSwitch states" parameters={{ controls: { disable: true } }}>
  <div class="story-row">
    <ToggleSwitch {...defaultArgs} size="medium" />
    <ToggleSwitch {...defaultArgs} size="medium" checked={true} />
    <ToggleSwitch {...defaultArgs} size="medium" disabled={true} />
    <ToggleSwitch {...defaultArgs} size="medium" disabled={true} checked={true} />
  </div>
  <div class="story-row">
    <ToggleSwitch {...defaultArgs} size="small" />
    <ToggleSwitch {...defaultArgs} size="small" checked={true} />
    <ToggleSwitch {...defaultArgs} size="small" disabled={true} />
    <ToggleSwitch {...defaultArgs} size="small" disabled={true} checked={true} />
  </div>
</Story>

<style>
  .story-row {
    display: flex;
    gap: 8px;
    align-items: center;
    flex-direction: row;
    padding-bottom: 8px;
  }
</style>
