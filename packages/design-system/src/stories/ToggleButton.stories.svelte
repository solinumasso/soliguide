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

  import type { ToggleButtonSize, ToggleButtonType } from '$lib/types';
  import ToggleButton from '$lib/components/ToggleButton.svelte';

  const defaultArgs: ComponentProps<ToggleButton> = {
    label: 'ToggleButton text',
    type: 'secondaryBordered',
    size: 'medium',
    name: 'group1'
  };

  export const meta = {
    title: 'General/ToggleButton',
    component: ToggleButton,
    argTypes: {
      type: {
        control: { type: 'radio' },
        options: [
          'secondaryBordered',
          'secondaryOutline',
          'primaryShy',
          'primaryReversed'
        ] satisfies ToggleButtonType[]
      },
      size: {
        control: { type: 'radio' },
        options: ['xsmall', 'medium', 'large'] satisfies ToggleButtonSize[]
      },
      icon: { table: { disable: true } },
      hasIcon: { table: { disable: true } },
      iconOnly: { control: 'boolean' },
      singleSelect: { control: 'boolean' },
      name: { control: 'text' },
      submit: { table: { disable: true } }
    },
    args: defaultArgs
  };
</script>

<script lang="ts">
  import { Story, Template } from '@storybook/addon-svelte-csf';
  import Settings from 'svelte-google-materialdesign-icons/Settings.svelte';
  import Favorite from 'svelte-google-materialdesign-icons/Favorite.svelte';
  import Heart from 'svelte-google-materialdesign-icons/Sentiment_very_satisfied.svelte';

  let checked = false;
</script>

<Template let:args>
  <ToggleButton {...args} on:change>{args.label}</ToggleButton>
</Template>

<Story name="Default" args={{}} />
<Story name="With icon" args={{ icon: Settings, hasIcon: true }} />

<Story name="Disabled" args={{ disabled: true }}>
  <div class="story-row">
    <ToggleButton disabled={true}>{defaultArgs.label}</ToggleButton>
    <ToggleButton disabled={true} type="primaryShy" icon={Favorite}></ToggleButton>
    <ToggleButton disabled={true} type="primaryReversed" icon={Favorite}></ToggleButton>
  </div>
</Story>

<Story name="ToggleButton variants" parameters={{ controls: { disable: true } }}>
  <div class="story-row">
    <ToggleButton {...defaultArgs} type="secondaryBordered">{defaultArgs.label}</ToggleButton>
    <ToggleButton {...defaultArgs} type="secondaryOutline">{defaultArgs.label}</ToggleButton>
    <ToggleButton {...defaultArgs} type="primaryShy" icon={Favorite}>
      {defaultArgs.label}
    </ToggleButton>
    <ToggleButton {...defaultArgs} type="primaryReversed" icon={Favorite}>
      {defaultArgs.label}
    </ToggleButton>
  </div>
</Story>

<Story name="ToggleButton sizes" parameters={{ controls: { disable: true } }}>
  <div class="story-row">
    <ToggleButton {...defaultArgs} size="large">{defaultArgs.label}</ToggleButton>
    <ToggleButton {...defaultArgs} size="medium">{defaultArgs.label}</ToggleButton>
    <ToggleButton {...defaultArgs} size="xsmall">{defaultArgs.label}</ToggleButton>
  </div>
</Story>

<Story name="ToggleButton Icon" parameters={{ controls: { disable: true } }}>
  <div class="story-row">
    <ToggleButton {...defaultArgs}>{defaultArgs.label}</ToggleButton>
    <ToggleButton {...defaultArgs} iconOnly icon={Settings}>{defaultArgs.label}</ToggleButton>
    <ToggleButton {...defaultArgs} icon={Settings}>{defaultArgs.label}</ToggleButton>
  </div>
</Story>

<Story name="Favorites Icon" parameters={{ controls: { disable: true } }}>
  <div class="story-row">
    <ToggleButton
      {...defaultArgs}
      iconOnly
      type="primaryShy"
      icon={checked ? Heart : Favorite}
      on:change={() => (checked = !checked)}
    >
      {defaultArgs.label}
    </ToggleButton>
  </div>
</Story>

<style lang="scss">
  .story-row {
    display: flex;
    gap: 8px;
    align-items: center;
    flex-direction: row;
  }
</style>
