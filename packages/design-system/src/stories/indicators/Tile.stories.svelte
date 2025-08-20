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
  import { BabyParcel } from '$lib';
  import Tile from '$lib/components/Tile.svelte';
  import type { TileVariant } from '$lib/types';
  import type { ComponentProps } from 'svelte';

  const defaultArgs: ComponentProps<Tile> = {
    variant: 'primary',
    label: 'Tile label',
    withIcon: true
  };

  export const meta = {
    title: 'Indicators/Tile',
    component: 'Tile',
    argTypes: {
      variant: {
        control: { type: 'radio' },
        options: ['primary', 'secondary', 'tertiary'] satisfies TileVariant[]
      }
    },
    args: defaultArgs
  };
</script>

<script lang="ts">
  import { Story, Template } from '@storybook/addon-svelte-csf';
</script>

<Template let:args>
  <Tile {...args}><BabyParcel variation="filled" size={'16'}></BabyParcel></Tile>
</Template>

<Story name="Default" args={{ ...defaultArgs }} />

<Story name="Tile variants without icons" parameters={{ controls: { disable: true } }}>
  <div class="story-row">
    <Tile withIcon={false} label="Primary" variant="primary" />
    <Tile withIcon={false} label="Secondary" variant="secondary" />
    <Tile withIcon={false} label="Tertiary" variant="tertiary" />
  </div>
</Story>

<Story name="Tile variants with icons" parameters={{ controls: { disable: true } }}>
  <div class="story-row">
    <Tile label="Primary" variant="primary">
      <BabyParcel variation="filled" size={'16'}></BabyParcel>
    </Tile>
    <Tile label="Secondary" variant="secondary">
      <BabyParcel variation="filled" size={'16'}></BabyParcel>
    </Tile>
    <Tile label="Tertiary" variant="tertiary">
      <BabyParcel variation="filled" size={'16'}></BabyParcel>
    </Tile>
  </div>
</Story>

<style>
  .story-row {
    display: flex;
    gap: 25px;
    align-items: flex-end;
    flex-direction: row;
    margin-bottom: 30px;
  }
</style>
